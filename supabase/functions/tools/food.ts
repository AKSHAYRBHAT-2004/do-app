// Tools for FOOD domain

export const recommend_meal = async (params: { ingredients?: string[], time?: number, budget?: number, preferences?: string[] }) => {
  return {
    suggestion: "Quick Garlic Butter Pasta",
    recipe: "1. Boil pasta. 2. Sauté garlic in butter. 3. Mix and serve.",
    prepTime: 15,
    estimatedCost: 5
  };
};

export const find_restaurants = async (params: { location: string, budget?: string, cuisine?: string }) => {
  return [
    { name: "Spice Route", rating: 4.8, distance: "1.2 km" },
    { name: "Green Bowl", rating: 4.5, distance: "2.0 km" }
  ];
};

export const create_grocery_list = async (params: { days: number, people: number, preferences?: string[] }) => {
  return {
    list: {
      produce: ["Apples", "Spinach", "Tomatoes"],
      dairy: ["Milk", "Cheese"],
      pantry: ["Pasta", "Olive Oil"]
    }
  };
};

export const analyze_menu = async (params: { menuDescription: string }) => {
  return {
    recommendations: ["Grilled Salmon (Healthy)", "Chef's Special Burger (Indulgent)"]
  };
};
