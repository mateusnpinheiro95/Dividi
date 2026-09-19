/**
 * Formats a number as Brazilian currency (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Returns the uppercase initial of the name (first word)
 */
export const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
};
