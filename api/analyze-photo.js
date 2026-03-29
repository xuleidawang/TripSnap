import { GoogleGenAI } from '@google/genai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { photoBase64 } = req.body
    if (!photoBase64) return res.status(400).json({ error: 'No photo provided' })

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '')

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: { mimeType: 'image/jpeg', data: base64Data },
          },
          {
            text: `Analyze this travel photo and identify the destination. Respond ONLY with valid JSON (no markdown):
{
  "location": "Specific landmark or area name",
  "city": "City name",
  "country": "Country name",
  "confidence": 0.95,
  "destinationType": "coastal|mountain|urban|desert|tropical|zen|cultural",
  "description": "One sentence describing what you see",
  "visualFeatures": ["feature1", "feature2", "feature3"]
}`,
          },
        ],
      }],
    })

    const text = response.candidates[0].content.parts[0].text
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const data = JSON.parse(cleaned.match(/\{[\s\S]*\}/)[0])

    res.json(data)
  } catch (err) {
    console.error('analyze-photo error:', err)
    res.status(500).json({ error: err.message })
  }
}
