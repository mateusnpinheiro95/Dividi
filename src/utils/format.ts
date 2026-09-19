/**
 * Formata um número para moeda brasileira (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Retorna a inicial maiúscula do nome (primeira palavra)
 */
export const getInitials = (nome: string): string => {
  const trimmed = nome.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
};
