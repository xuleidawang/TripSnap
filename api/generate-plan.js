import { GoogleGenAI } from '@google/genai'

async function wikiPhoto(pageName) {
  if (!pageName) return null
  try {
    const slug = pageName.trim().replace(/\s+/g, '_')
    const url  = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`
    const res  = await fetch(url, {
      headers: { 'User-Agent': 'TripSnap/1.0 (travel-app)' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data  = await res.json()
    const thumb = data?.thumbnail?.source
    if (!thumb) return null
    return thumb.replace(/\/\d+px-/, '/800px-')
  } catch {
    return null
  }
}

async function fetchSlidePhotos(location, city, country, activityTitles = []) {
  const candidates = [
    location,
    `${location}, ${city}`,
    city,
    activityTitles[0],
    activityTitles[1],
    `${city}, ${country}`,
    country,
  ].filter(Boolean)

  const photos = []
  const tried  = new Set()

  for (const candidate of candidates) {
    if (photos.length >= 3) break   // we need 3 — cover comes from userPhoto
    if (tried.has(candidate)) continue
    tried.add(candidate)
    const url = await wikiPhoto(candidate)
    if (url) photos.push(url)
  }

  return photos
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const {
      location, city, country,
      days = 2, budget = 'moderate', interests = [], photoDescriptions = []
    } = req.body

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const prompt = `You are an expert travel planner. Create a detailed ${days}-day itinerary for ${location}, ${city}, ${country}.
Budget level: ${budget}. Interests: ${interests.join(', ') || 'general sightseeing'}.
Context from photo: ${photoDescriptions.join('; ') || 'standard tourist experience'}.

Rules:
- 4-5 activities per day with specific times
- Include travel times between stops
- Add one concrete insider tip per activity
- Make activity titles SPECIFIC landmark names (e.g. "Sleeping Beauty Castle" not just "Theme park")

Respond ONLY with valid JSON (no markdown fences):
{
  "title": "...",
  "location": "...",
  "highlights": ["...", "...", "..."],
  "bestSeason": "...",
  "estimatedBudget": "...",
  "days": [
    {
      "dayNumber": 1,
      "theme": "...",
      "activities": [
        {
          "id": "d1a1",
          "time": "09:00 AM",
          "title": "Specific Landmark Name",
          "description": "...",
          "type": "Sightseeing",
          "duration": "2h",
          "travelTimeToNext": "15 min walk",
          "tip": "..."
        }
      ]
    }
  ]
}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const text    = response.candidates[0].content.parts[0].text
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const plan    = JSON.parse(cleaned.match(/\{[\s\S]*\}/)[0])

    const day1Acts  = plan.days?.[0]?.activities || []
    const actTitles = day1Acts.slice(0, 2).map(a => a.title).filter(Boolean)
    const slidePhotos = await fetchSlidePhotos(location, city, country, actTitles)

    res.json({ ...plan, slidePhotos })
  } catch (err) {
    console.error('generate-plan error:', err)
    res.status(500).json({ error: err.message })
  }
}
