// Tools for SHOPPING domain

export const find_best_product = async (params: { query: string }) => {
  return {
    best: { name: "Premium Widget X", price: 199, reason: "Best overall quality" },
    alternative: { name: "Widget Pro", price: 179, reason: "Close second" },
    cheapest: { name: "Basic Widget", price: 49, reason: "Best budget option" }
  };
};

export const create_goal_basket = async (params: { goal: string }) => {
  return {
    items: [
      { name: "Running Shoes", estimatedPrice: 120 },
      { name: "Water Bottle", estimatedPrice: 20 },
      { name: "Fitness Tracker", estimatedPrice: 150 }
    ],
    totalEstimated: 290
  };
};

export const compare_prices = async (params: { productName: string }) => {
  return {
    stores: [
      { name: "Amazon", price: 99.99 },
      { name: "Best Buy", price: 104.99 },
      { name: "Walmart", price: 98.50 }
    ]
  };
};
