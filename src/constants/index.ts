// Constantes da aplicação
export const APP_NAME = 'Dividi';

export const ROUTES = {
  HOME: '/',
  ORDERS: '/pedidos',
  PEOPLE: '/pessoas',
} as const;

export const STORAGE_KEYS = {
  MESA_ATUAL: 'dividi:mesa-atual',
  PEDIDOS: 'dividi:pedidos',
  PESSOAS: 'dividi:pessoas',
  DIVISAO: 'dividi:divisao',
} as const;

export const DEFAULT_MESA_ID = 'Mesa 01';

/** Cores fixas para avatares de pessoas (cíclicas) */
export const PERSON_COLORS = [
  '#3B82F6', // Azul
  '#A855F7', // Roxo
  '#10B981', // Verde
  '#F59E0B', // Laranja
  '#EC4899', // Rosa
  '#06B6D4', // Ciano
] as const;
