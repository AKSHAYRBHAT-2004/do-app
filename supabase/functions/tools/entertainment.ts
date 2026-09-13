// Tools for ENTERTAINMENT domain

export const suggest_activity = async (params: { freeMinutes: number, budget?: number, mood?: string }) => {
  if (params.freeMinutes <= 15) {
    return {
      type: 'micro_break',
      options: [
        { title: 'Listen to 1 podcast episode chapter', duration: 12, cost: 0 },
        { title: 'Guided 10-minute mindful breathing', duration: 10, cost: 0 },
        { title: 'Quick acoustic guitar practice', duration: 15, cost: 0 }
      ]
    };
  }

  return {
    type: 'extended_activity',
    options: [
      { title: 'Visit contemporary art exhibition downtown', duration: 90, cost: 250, distance: '3.4 km' },
      { title: 'Try specialty pour-over coffee tasting', duration: 45, cost: 350, distance: '1.2 km' },
      { title: 'Sunset rooftop lounge chill', duration: 60, cost: 600, distance: '2.5 km' }
    ]
  };
};

export const plan_evening = async (params: { budget: number, companions?: string }) => {
  return {
    theme: 'Cozy Dinner & Indie Film',
    timeline: [
      { time: '7:30 PM', activity: 'Dinner at Olive Bistro (Italian Comfort)', estimatedCost: 1400 },
      { time: '9:15 PM', activity: 'Catch late-night screening or dessert walk', estimatedCost: 500 }
    ],
    totalBudget: 1900,
    transportSuggestion: 'Metro line 2 or quick rideshare'
  };
};

export const find_events = async (params: { city?: string, category?: string }) => {
  return [
    { title: 'Live Stand-up Comedy Showcase', venue: 'The Laugh Club', date: 'This Friday 8:00 PM', ticketPrice: 499 },
    { title: 'Acoustic Indie Music Night', venue: 'Blue Tokai Cafe', date: 'Saturday 7:00 PM', ticketPrice: 300 },
    { title: 'Weekend Farmers & Artisans Market', venue: 'Central Grounds', date: 'Sunday 10:00 AM', ticketPrice: 0 }
  ];
};

export const recommend_content = async (params: { genre?: string, timeMinutes?: number }) => {
  return {
    movies: [
      { title: 'Past Lives', duration: '1h 45m', platform: 'Prime Video', rating: '96% Rotten Tomatoes', why: 'Deep, emotional, compact' },
      { title: 'The Holdovers', duration: '2h 13m', platform: 'JioCinema', rating: '97% Rotten Tomatoes', why: 'Comforting & witty' }
    ],
    documentaries: [
      { title: 'Jiro Dreams of Sushi', duration: '1h 21m', platform: 'Netflix', why: 'Inspiring mastery' }
    ]
  };
};
