import type { Order } from '@/types';

type ParsedOrder = Omit<Order, 'id'>;

const SKIP_LINE_PATTERN =
  /^(total|subtotal|sub[\s-]?total|desconto|troco|pagamento|forma\s+de\s+pagamento|cart[aã]o|dinheiro|pix|cpf|cnpj|nfce|nfc-e|cupom|comanda|mesa|gar[cç]om|gorjeta|servi[cç]o|taxa|vlr\.?\s*total|valor\s+total|qtd|item|descricao|descri[cç][aã]o)/i;

/**
 * Parses a Brazilian currency string into a number.
 * Handles "10,00", "10.00", "1.234,56", "1,234.56".
 */
function parsePrice(raw: string): number | null {
  const cleaned = raw.trim().replace(/[^\d.,]/g, '');
  if (!cleaned) return null;

  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  let normalized = cleaned;

  if (hasComma && hasDot) {
    // Assume the last separator is the decimal one
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      // 1.234,56
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // 1,234.56
      normalized = cleaned.replace(/,/g, '');
    }
  } else if (hasComma) {
    normalized = cleaned.replace(',', '.');
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

/**
 * Title-cases a product name while keeping short words lowercase when appropriate.
 */
function normalizeName(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

function shouldSkipLine(line: string): boolean {
  return SKIP_LINE_PATTERN.test(line.trim());
}

/**
 * Extracts order items from OCR text of a Brazilian restaurant receipt.
 *
 * Supported patterns (examples):
 * - "2x AGUA SEM GAS R$ 10,00"
 * - "1 UN REFRIGERANTE 8,50"
 * - "Água sem gás ............ 10,00" (qty defaults to 1)
 * - "2  Cerveja  12,90"
 */
export function parseReceiptText(text: string): ParsedOrder[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const orders: ParsedOrder[] = [];
  const seen = new Set<string>();

  // Pattern A: qty + optional x/un + name + optional R$ + price
  // e.g. "2x AGUA SEM GAS R$ 10,00" | "1 UN REFRIGERANTE 8.50" | "2 Cerveja 12,90"
  const patternWithQty =
    /^(\d{1,3})\s*(?:[xX×]|un(?:id(?:ade)?)?\.?)?\s+(.+?)\s+(?:R\$\s*)?([\d]+(?:[.,]\d{1,2})?)\s*$/i;

  // Pattern B: name + optional R$ + price (quantity defaults to 1)
  // e.g. "Água sem gás R$ 10,00" | "Refrigerante ........ 8,50"
  const patternNamePrice =
    /^(.+?)\s+(?:R\$\s*)?([\d]+(?:[.,]\d{1,2})?)\s*$/i;

  for (const line of lines) {
    if (shouldSkipLine(line)) continue;

    let quantity = 1;
    let name = '';
    let priceRaw = '';

    const matchQty = line.match(patternWithQty);
    if (matchQty) {
      quantity = Number(matchQty[1]);
      name = matchQty[2];
      priceRaw = matchQty[3];
    } else {
      const matchName = line.match(patternNamePrice);
      if (!matchName) continue;
      name = matchName[1];
      priceRaw = matchName[2];
    }

    // Clean name: remove trailing dots/dashes used as separators on receipts
    name = name.replace(/[\s.\-_·•]+$/g, '').replace(/^[\s.\-_·•]+/g, '').trim();
    if (name.length < 2) continue;
    if (/^\d+$/.test(name)) continue;
    if (shouldSkipLine(name)) continue;

    // Avoid matching lines that are mostly numbers (codes, CNPJ fragments)
    const letterCount = (name.match(/[a-zA-ZÀ-ÿ]/g) ?? []).length;
    if (letterCount < 2) continue;

    const unitPrice = parsePrice(priceRaw);
    if (unitPrice === null) continue;
    if (!Number.isFinite(quantity) || quantity < 1) continue;

    // If the price looks like a line total (qty * unit), convert to unit price
    // Heuristic: when qty > 1 and OCR shows a large total, we keep as unitPrice
    // and trust the printed value as unit price (most Brazilian receipts print unit).
    const normalizedName = normalizeName(name);
    const key = `${normalizedName}|${quantity}|${unitPrice.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    orders.push({
      name: normalizedName,
      quantity: Math.floor(quantity),
      unitPrice,
    });
  }

  return orders;
}
