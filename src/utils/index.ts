export { formatCurrency, getInitials, sanitizeOrderName } from './format';
export { migrateLegacyStorage } from './migrateStorage';
export { buildSummaryText, shareSummary } from './shareSummary';
export { resetCalculation } from './resetCalculation';
export { parseReceiptText } from './parseReceiptText';

/**
 * Formats a date using the Brazilian locale
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};
