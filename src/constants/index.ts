// Application constants
export const APP_NAME = 'Dividi';

export const ROUTES = {
  HOME: '/',
  ORDERS: '/orders',
  PEOPLE: '/people',
  TIP: '/tip',
} as const;

/** Legacy Portuguese routes kept for redirects */
export const LEGACY_ROUTES = {
  ORDERS: '/pedidos',
  PEOPLE: '/pessoas',
  TIP: '/gorjeta',
} as const;

export const STORAGE_KEYS = {
  CURRENT_TABLE: 'dividi:current-table',
  ORDERS: 'dividi:orders',
  PEOPLE: 'dividi:people',
  ASSIGNMENTS: 'dividi:assignments',
  TIP_CONFIG: 'dividi:tip-config',
} as const;

/** Legacy Portuguese localStorage keys (for one-time migration) */
export const LEGACY_STORAGE_KEYS = {
  CURRENT_TABLE: 'dividi:mesa-atual',
  ORDERS: 'dividi:pedidos',
  PEOPLE: 'dividi:pessoas',
  ASSIGNMENTS: 'dividi:divisao',
  TIP_CONFIG: 'dividi:gorjeta-config',
} as const;

/** Display label shown in the UI (Portuguese) */
export const DEFAULT_TABLE_LABEL = 'Mesa 01';

export const DEFAULT_TIP_PERCENTAGE = 10;
export const MIN_TIP_PERCENTAGE = 0;
export const MAX_TIP_PERCENTAGE = 100;
export const TIP_PERCENTAGE_STEP = 1;

export const DEFAULT_TIP_FIXED = 0;
export const MIN_TIP_FIXED = 0;
export const MAX_TIP_FIXED = 99999;
export const TIP_FIXED_STEP = 1;

/** Fixed avatar colors for people (cycled) */
export const PERSON_COLORS = [
  '#3B82F6', // Blue
  '#A855F7', // Purple
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EC4899', // Pink
  '#06B6D4', // Cyan
] as const;
