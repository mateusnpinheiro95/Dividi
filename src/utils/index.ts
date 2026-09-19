export { formatCurrency, getInitials } from './format';
export { migrateLegacyStorage } from './migrateStorage';

/**
 * Formats a date using the Brazilian locale
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};
