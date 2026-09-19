import type { Order } from '@/types';

type ParsedOrder = Omit<Order, 'id'>;

// Skip common receipt headers/footers (case-insensitive)
const SKIP_LINE_PATTERN =
  /^(total|subtotal|sub[\s-]?total|desconto|troco|pagamento|forma\s+de\s+pagamento|cart[aã]o|dinheiro|pix|cpf|cnpj|nfce|nfc-e|cupom|comanda|mesa|gar[cç]om|gorjeta|servi[cç]o|taxa|vlr\.?\s*total|valor\s+total|qtd|quant|item|descricao|descri[cç][aã]o|vl\.?\s*unit|atendente|documento|precuenta|items?|fecha|hora|caba|bs\s*as)/i;

/**
 * Parses a price string into a number.
 * Handles multiple formats: "10,00", "10.00", "1.234,56", "1000", "38100.00"
 */
function parsePrice(raw: string): number | null {
  const cleaned = raw.trim().replace(/[^\d.,]/g, '');
  if (!cleaned) return null;

  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  let normalized = cleaned;

  if (hasComma && hasDot) {
    // Determine which is the decimal separator by position
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      // Format: 1.234,56 (Brazilian)
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Format: 1,234.56 (US/Argentina)
      normalized = cleaned.replace(/,/g, '');
    }
  } else if (hasComma) {
    // Only comma - could be "10,00" or "1000,00"
    // If comma is in last 3 positions, treat as decimal
    const commaPos = cleaned.lastIndexOf(',');
    if (cleaned.length - commaPos <= 3) {
      normalized = cleaned.replace(',', '.');
    } else {
      normalized = cleaned.replace(/,/g, '');
    }
  }
  // If only dots or no separator, keep as-is (could be "1000" or "10.00")

  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

const MAX_NAME_LENGTH = 60;

/**
 * Title-cases a product name and keeps it layout-safe.
 */
function normalizeName(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/\s+/g, ' ')
    // Strip OCR noise: trailing dashes/dots and menu codes like (w)
    .replace(/\s*[.\-_·•—–|]+$/g, '')
    .replace(/\s*\([^)]{0,4}\)\s*$/g, '')
    .trim();

  const titled = cleaned
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());

  if (titled.length <= MAX_NAME_LENGTH) return titled;
  return `${titled.slice(0, MAX_NAME_LENGTH - 1).trimEnd()}…`;
}

function shouldSkipLine(line: string): boolean {
  return SKIP_LINE_PATTERN.test(line.trim());
}

/**
 * Count slashes or pipes at the start of a line (some receipts use /// for quantity).
 */
function countLeadingMarkers(line: string): number {
  const match = line.match(/^([\/|]+)/);
  return match ? match[1].length : 0;
}

/**
 * Extracts order items from OCR text in a generic way.
 * 
 * Supports multiple receipt formats:
 * 1. "2x AGUA SEM GAS R$ 10,00"
 * 2. "/// Self-Service 18,00 54,00" (slashes = quantity)
 * 3. "2x PLATO FIEL(w) 6800 13800" (qty x name price_unit price_total)
 * 4. "Água sem gás 10,00" (implicit qty = 1)
 */
export function parseReceiptText(text: string): ParsedOrder[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const orders: ParsedOrder[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    if (shouldSkipLine(line)) continue;

    let quantity = 1;
    let name = '';
    let unitPrice: number | null = null;

    // Check for leading markers (slashes/pipes indicating quantity)
    const markerCount = countLeadingMarkers(line);
    if (markerCount > 0) {
      quantity = markerCount;
      const withoutMarkers = line.replace(/^[\/|]+\s*/, '');
      
      // Extract name and numbers from remaining text
      // Pattern: "name number1 number2" or "name number"
      const parts = withoutMarkers.split(/\s+/);
      const numbers: number[] = [];
      const nameParts: string[] = [];

      for (const part of parts) {
        const price = parsePrice(part);
        if (price !== null) {
          numbers.push(price);
        } else {
          nameParts.push(part);
        }
      }

      name = nameParts.join(' ');
      
      // If we have multiple numbers, prefer the first as unit price
      if (numbers.length > 0) {
        unitPrice = numbers[0];
      }
    } else {
      // Standard patterns without markers
      
      // Pattern 1: "2x NAME 6800 13800" or "2 x NAME 6800 13800"
      // Extract qty at start, then name, then numbers
      const qtyMatch = line.match(/^(\d{1,3})\s*[xX×]?\s+(.+)$/);
      
      if (qtyMatch) {
        quantity = Number(qtyMatch[1]);
        const remainder = qtyMatch[2];
        
        // Split remainder into name parts and numbers
        const parts = remainder.split(/\s+/);
        const numbers: number[] = [];
        const nameParts: string[] = [];

        for (const part of parts) {
          const price = parsePrice(part);
          if (price !== null) {
            numbers.push(price);
          } else {
            nameParts.push(part);
          }
        }

        name = nameParts.join(' ');
        
        // If multiple numbers, first is usually unit price
        if (numbers.length > 0) {
          unitPrice = numbers[0];
        }
      } else {
        // Pattern 2: "NAME price1 price2" or "NAME price"
        // No explicit quantity - find name and extract prices
        const parts = line.split(/\s+/);
        const numbers: number[] = [];
        const nameParts: string[] = [];

        for (const part of parts) {
          const price = parsePrice(part);
          if (price !== null) {
            numbers.push(price);
          } else {
            nameParts.push(part);
          }
        }

        name = nameParts.join(' ');
        
        // If we have numbers, use the first one
        // (if qty=1 and two numbers present, they should be equal)
        if (numbers.length > 0) {
          unitPrice = numbers[0];
        }
      }
    }

    // Clean and validate name
    name = name
      .replace(/[\s.\-_·•—–|]+$/g, '')
      .replace(/^[\s.\-_·•—–|]+/g, '')
      .trim();
    if (name.length < 2) continue;
    if (/^\d+$/.test(name)) continue; // Skip pure numbers
    if (shouldSkipLine(name)) continue;

    // Must have at least 2 letters to be a valid product
    const letterCount = (name.match(/[a-zA-ZÀ-ÿ]/g) ?? []).length;
    if (letterCount < 2) continue;

    // Must have a valid price
    if (unitPrice === null || !Number.isFinite(unitPrice)) continue;
    if (!Number.isFinite(quantity) || quantity < 1) continue;

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
