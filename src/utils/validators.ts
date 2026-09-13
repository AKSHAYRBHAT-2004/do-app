export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidBudget = (amount: any): boolean => {
  if (typeof amount === 'number') return amount > 0;
  if (typeof amount === 'string') {
    const parsed = parseFloat(amount);
    return !isNaN(parsed) && parsed > 0;
  }
  return false;
};

export const isNotEmpty = (text: string | null | undefined): boolean => {
  return text !== null && text !== undefined && text.trim().length > 0;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Simple check for MVP: 10-15 digits
  const regex = /^\+?[\d\s-]{10,15}$/;
  return regex.test(phone.replace(/[\s-]/g, ''));
};

export const sanitizeInput = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/[<>]/g, '') // Remove obvious tag brackets
    .trim();
};
