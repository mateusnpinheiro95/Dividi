/**
 * Formats a number for display without a currency symbol (locale-neutral amount).
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const MAX_ORDER_NAME_LENGTH = 60;

/**
 * Keeps product names layout-safe (OCR can return very long unbroken strings).
 */
export const sanitizeOrderName = (name: string): string => {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  if (cleaned.length <= MAX_ORDER_NAME_LENGTH) return cleaned;
  return `${cleaned.slice(0, MAX_ORDER_NAME_LENGTH - 1).trimEnd()}…`;
};

/**
 * Returns the uppercase initial of the name (first word)
 */
export const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
};
