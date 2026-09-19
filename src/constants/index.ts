// Constantes da aplicação
export const APP_NAME = 'Dividi';

export const ROUTES = {
  HOME: '/',
  ORDERS: '/pedidos',
} as const;

export const STORAGE_KEYS = {
  MESA_ATUAL: 'dividi:mesa-atual',
  PEDIDOS: 'dividi:pedidos',
} as const;

export const DEFAULT_MESA_ID = 'Mesa 01';
