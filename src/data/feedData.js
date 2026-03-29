// ─── Feed placeholder plans ───────────────────────────────────────────────────
// slidePhotos: verified Unsplash CDN IDs, all confirmed 200 via download redirect.
// RULE: slidePhotos[0] is always the card thumbnail AND cover slide.
//       slidePhotos[1-3] fill the remaining preview slides.
// These are NEVER touched by getPlanPhotos fallback logic — they are complete arrays.

export const FEED_PLANS = [
  {
    id: 'feed-1',
    title: 'Big Sur Coast Road Trip',
    location: 'Big Sur, California',
    destinationTheme: 'coastal',
    days: 3,
    // Bixby Bridge sunny | foggy cliffs | drone coastline
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop',
    slidePhotos: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520962922320-2038eebab146?q=80&w=800&auto=format&fit=crop',
    ],
    highlights: ['Bixby Creek Bridge', 'McWay Falls', 'Pfeiffer Beach'],
    bestSeason: 'Spring / Fall',
    estimatedBudget: '$150–$250/day',
    author: 'Sarah M.',
    authorAvatar: 'S',
    likes: 248,
    days_data: [
      {
        dayNumber: 1, theme: 'Arrival & Coastline',
        activities: [
          { id: 'd1a1', time: '10:00 AM', title: 'Bixby Creek Bridge', description: 'One of the most photographed bridges in California, spanning a dramatic coastal canyon.', type: 'Sightseeing', duration: '1h', travelTimeToNext: '10 min drive', tip: 'Arrive early for golden hour light on the bridge.' },
          { id: 'd1a2', time: '12:00 PM', title: 'McWay Falls', description: 'An 80-foot waterfall that drops directly onto a pristine beach cove.', type: 'Nature', duration: '1.5h', travelTimeToNext: '5 min drive', tip: 'The overlook trail is short but the view is spectacular.' },
          { id: 'd1a3', time: '3:00 PM', title: 'Pfeiffer Beach', description: 'Purple-sand beach with dramatic sea stacks and keyhole rock formations.', type: 'Beach', duration: '2h', travelTimeToNext: '15 min drive', tip: 'Look for the Keyhole Arch at sunset for stunning photos.' },
        ],
      },
      {
        dayNumber: 2, theme: 'Redwoods & Wildlife',
        activities: [
          { id: 'd2a1', time: '9:00 AM', title: 'Pfeiffer Big Sur State Park', description: 'Ancient redwood groves and fern-lined canyon trails.', type: 'Hiking', duration: '3h', travelTimeToNext: '20 min drive', tip: 'The Valley View Trail offers the best panoramic overlook.' },
          { id: 'd2a2', time: '1:00 PM', title: 'Point Sur Lighthouse', description: 'Historic lighthouse perched on a volcanic rock above the Pacific.', type: 'Culture', duration: '2h', travelTimeToNext: '10 min drive', tip: 'Tours run only on weekends — check the schedule ahead.' },
        ],
      },
      {
        dayNumber: 3, theme: 'Southern Highlights',
        activities: [
          { id: 'd3a1', time: '10:00 AM', title: 'Julia Pfeiffer Burns State Park', description: 'Coastal bluffs, sea caves, and the iconic McWay Falls overlook.', type: 'Nature', duration: '2h', travelTimeToNext: '30 min drive', tip: 'The Overlook Trail is wheelchair accessible and worth every step.' },
          { id: 'd3a2', time: '1:00 PM', title: 'Nepenthe Restaurant', description: 'Legendary cliffside restaurant with sweeping views of the Pacific.', type: 'Food', duration: '1.5h', travelTimeToNext: '0', tip: 'Order the Ambrosia burger — a Big Sur institution since 1949.' },
        ],
      },
    ],
  },

  {
    id: 'feed-2',
    title: 'Disneyland Magic Weekend',
    location: 'Anaheim, California',
    destinationTheme: 'urban',
    days: 2,
    // Sleeping Beauty Castle | castle wide | fireworks night
    img: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop',
    slidePhotos: [
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1476889789755-3f35a9426984?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548193741-0c518de0cf09?q=80&w=800&auto=format&fit=crop',
    ],
    highlights: ['Sleeping Beauty Castle', 'Space Mountain', 'World of Color'],
    bestSeason: 'Weekdays in Jan–Feb',
    estimatedBudget: '$250–$400/day',
    author: 'Mike T.',
    authorAvatar: 'M',
    likes: 192,
    days_data: [
      {
        dayNumber: 1, theme: 'Disneyland Park',
        activities: [
          { id: 'd1a1', time: '8:00 AM', title: 'Sleeping Beauty Castle', description: 'The iconic pink-and-blue castle at the heart of Disneyland.', type: 'Sightseeing', duration: '30min', travelTimeToNext: '2 min walk', tip: 'Arrive at rope drop to walk right in — lines grow fast after 10am.' },
          { id: 'd1a2', time: '9:00 AM', title: 'Space Mountain', description: 'Classic indoor roller coaster through a simulated galaxy.', type: 'Ride', duration: '1h', travelTimeToNext: '5 min walk', tip: 'Use Lightning Lane first thing — wait times triple by noon.' },
          { id: 'd1a3', time: '12:00 PM', title: 'Blue Bayou Restaurant', description: 'Atmospheric Cajun-Creole dining inside the Pirates of the Caribbean.', type: 'Food', duration: '1.5h', travelTimeToNext: '5 min walk', tip: 'Book 60 days in advance — walk-ups are nearly impossible.' },
          { id: 'd1a4', time: '9:00 PM', title: 'Fantasmic! Night Show', description: 'Epic outdoor spectacular with fire, water screens, and classic Disney characters.', type: 'Entertainment', duration: '1h', travelTimeToNext: '0', tip: 'Grab a spot on the right side of the river for the best sightlines.' },
        ],
      },
      {
        dayNumber: 2, theme: 'Disney California Adventure',
        activities: [
          { id: 'd2a1', time: '9:00 AM', title: 'Radiator Springs Racers', description: 'Cars-themed dark ride through a replica Route 66 canyon town.', type: 'Ride', duration: '1h', travelTimeToNext: '5 min walk', tip: 'The single-rider line cuts wait time by up to 60%.' },
          { id: 'd2a2', time: '11:00 AM', title: 'Guardians of the Galaxy: Mission Breakout', description: 'High-energy drop tower with Awesome Mix Vol. 1 pumping the whole way.', type: 'Ride', duration: '45min', travelTimeToNext: '10 min walk', tip: 'The random music tracks make every ride feel different.' },
          { id: 'd2a3', time: '9:00 PM', title: 'World of Color', description: 'Spectacular water, light, and projection show on Paradise Bay.', type: 'Entertainment', duration: '1h', travelTimeToNext: '0', tip: 'Stand on the far left — the purple zone has the least crowd and great views.' },
        ],
      },
    ],
  },

  {
    id: 'feed-3',
    title: 'Hawaii Big Island Adventure',
    location: 'Big Island, Hawaii',
    destinationTheme: 'tropical',
    days: 4,
    // Lava flow | green coastline | volcano crater | black sand beach
    img: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=800&auto=format&fit=crop',
    slidePhotos: [
      'https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    ],
    highlights: ['Kilauea Volcano', 'Punaluu Black Sand Beach', 'Waipio Valley'],
    bestSeason: 'Apr–Jun, Sep–Nov',
    estimatedBudget: '$200–$350/day',
    author: 'Lena K.',
    authorAvatar: 'L',
    likes: 317,
    days_data: [
      {
        dayNumber: 1, theme: 'Volcano Country',
        activities: [
          { id: 'd1a1', time: '8:00 AM', title: 'Hawaii Volcanoes National Park', description: 'Home to Kilauea, one of the world\'s most active volcanoes.', type: 'Nature', duration: '4h', travelTimeToNext: '30 min drive', tip: 'Visit Halema\'uma\'u Crater at dusk for the lava glow — bring a jacket.' },
          { id: 'd1a2', time: '1:00 PM', title: 'Thurston Lava Tube', description: '500-year-old lava tube you can walk through — naturally lit at the entrance.', type: 'Adventure', duration: '1h', travelTimeToNext: '20 min drive', tip: 'The far end of the tube (unlit section) is open to adventurous hikers with a flashlight.' },
          { id: 'd1a3', time: '4:00 PM', title: 'Punaluu Black Sand Beach', description: 'Dramatic jet-black volcanic sand beach where sea turtles bask in the sun.', type: 'Beach', duration: '1.5h', travelTimeToNext: '0', tip: 'Hawaiian green sea turtles (honu) are protected — watch from 6 feet away.' },
        ],
      },
      {
        dayNumber: 2, theme: 'Waterfalls & Valley',
        activities: [
          { id: 'd2a1', time: '9:00 AM', title: 'Waipio Valley Lookout', description: 'Breathtaking 2,000-foot cliffs framing Hawaii\'s most sacred valley.', type: 'Sightseeing', duration: '1h', travelTimeToNext: '1h drive', tip: 'The road down is 4WD only — take a valley tour operator instead.' },
          { id: 'd2a2', time: '12:00 PM', title: 'Akaka Falls State Park', description: '442-foot waterfall plunging into a lush jungle gorge.', type: 'Nature', duration: '1.5h', travelTimeToNext: '20 min drive', tip: 'The loop trail is under a mile and takes about 30 minutes — very manageable.' },
        ],
      },
      {
        dayNumber: 3, theme: 'Snorkel & Stars',
        activities: [
          { id: 'd3a1', time: '7:00 AM', title: 'Kealakekua Bay Snorkel', description: 'Crystal-clear marine sanctuary with spinner dolphins and vibrant coral.', type: 'Adventure', duration: '3h', travelTimeToNext: '30 min drive', tip: 'Morning kayak tours include snorkel gear and reach spots boats cannot.' },
          { id: 'd3a2', time: '8:00 PM', title: 'Mauna Kea Stargazing', description: 'World\'s best stargazing at 13,796 feet above the clouds.', type: 'Experience', duration: '2h', travelTimeToNext: '0', tip: 'Acclimatize at the visitor center (9,200 ft) for 30 min before going to the summit.' },
        ],
      },
      {
        dayNumber: 4, theme: 'Coffee & Coast',
        activities: [
          { id: 'd4a1', time: '9:00 AM', title: 'Kona Coffee Farm Tour', description: 'Walk the only coffee-growing region in the USA with tasting included.', type: 'Food', duration: '2h', travelTimeToNext: '15 min drive', tip: 'Buy beans directly from the farm — they\'re fresher and cheaper than airport stores.' },
          { id: 'd4a2', time: '12:00 PM', title: 'Hapuna Beach', description: 'Half-mile of white sand consistently ranked among Hawaii\'s best beaches.', type: 'Beach', duration: '3h', travelTimeToNext: '0', tip: 'Arrive by 11am to claim a shaded spot under the ironwood trees.' },
        ],
      },
    ],
  },
]
