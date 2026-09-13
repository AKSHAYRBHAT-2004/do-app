// Tools for TRAVEL domain

export const plan_trip = async (params: { destination: string, days: number, budget?: string }) => {
  return {
    itinerarySummary: `A ${params.days}-day trip to ${params.destination}`,
    budgetBreakdown: { flights: 500, accommodation: 600, food: 300, activities: 200 },
    packingList: ["Passport", "Comfortable shoes", "Chargers"]
  };
};

export const find_transport = async (params: { from: string, to: string, date: string }) => {
  return {
    options: [
      { type: "Flight", cost: 150, duration: "2h" },
      { type: "Train", cost: 80, duration: "4h" },
      { type: "Bus", cost: 30, duration: "8h" }
    ]
  };
};

export const create_itinerary = async (params: { destination: string, days: number }) => {
  return {
    days: Array.from({ length: params.days }, (_, i) => ({
      day: i + 1,
      activities: ["Morning Sightseeing", "Local Lunch", "Afternoon Museum"]
    }))
  };
};

export const modify_trip = async (params: { tripId: string, modification: string }) => {
  return {
    status: 'success',
    updatedPlan: "Modified trip plan based on request"
  };
};
