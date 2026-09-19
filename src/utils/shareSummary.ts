import { DEFAULT_TABLE_LABEL } from '@/constants';
import type { PersonSummary } from '@/types';
import { formatCurrency } from '@/utils/format';

interface ShareSummaryParams {
  tableLabel?: string;
  grandTotal: number;
  summaries: PersonSummary[];
}

/**
 * Builds the plain-text summary used for sharing / clipboard.
 */
export function buildSummaryText({
  tableLabel = DEFAULT_TABLE_LABEL,
  grandTotal,
  summaries,
}: ShareSummaryParams): string {
  const lines = [
    tableLabel,
    `Total: ${formatCurrency(grandTotal)}`,
    '',
    ...summaries.map(
      (item) => `${item.name}: ${formatCurrency(item.total)}`
    ),
  ];

  return lines.join('\n');
}

/**
 * Shares the summary via Web Share API, with clipboard fallback.
 * Returns 'shared' | 'copied' | 'cancelled' | 'failed'.
 */
export async function shareSummary(
  params: ShareSummaryParams
): Promise<'shared' | 'copied' | 'cancelled' | 'failed'> {
  const text = buildSummaryText(params);
  const title = `Dividi — ${params.tableLabel ?? DEFAULT_TABLE_LABEL}`;

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled';
      }
      // Fall through to clipboard
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return 'copied';
    }
  } catch {
    // ignore
  }

  return 'failed';
}
