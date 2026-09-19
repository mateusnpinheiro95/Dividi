export { formatCurrency } from './format';

/**
 * Formata uma data para o padrão brasileiro
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};
