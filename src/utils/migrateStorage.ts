import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from '@/constants';
import type { Order, OrderAssignment, Person, TipConfig, TipType } from '@/types';

const MIGRATION_FLAG = 'dividi:storage-migrated-v1';

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

function hasKey(key: string): boolean {
  return window.localStorage.getItem(key) !== null;
}

interface LegacyOrder {
  id: string;
  nome?: string;
  name?: string;
  valorUnitario?: number;
  unitPrice?: number;
  quantidade?: number;
  quantity?: number;
}

interface LegacyPerson {
  id: string;
  nome?: string;
  name?: string;
  cor?: string;
  color?: string;
}

interface LegacyAssignment {
  pedidoId?: string;
  orderId?: string;
  pessoaIds?: string[];
  personIds?: string[];
}

interface LegacyTipConfig {
  ativa?: boolean;
  active?: boolean;
  tipo?: string;
  type?: string;
  percentual?: number;
  percentage?: number;
  valorFixo?: number;
  fixedAmount?: number;
  participantes?: string[];
  participants?: string[];
  inicializado?: boolean;
  initialized?: boolean;
  pessoasConhecidas?: string[];
  knownPersonIds?: string[];
}

function migrateOrders(legacy: LegacyOrder[]): Order[] {
  return legacy.map((item) => ({
    id: item.id,
    name: item.name ?? item.nome ?? '',
    unitPrice: item.unitPrice ?? item.valorUnitario ?? 0,
    quantity: item.quantity ?? item.quantidade ?? 1,
  }));
}

function migratePeople(legacy: LegacyPerson[]): Person[] {
  return legacy.map((item) => ({
    id: item.id,
    name: item.name ?? item.nome ?? '',
    color: item.color ?? item.cor ?? '#3B82F6',
  }));
}

function migrateAssignments(legacy: LegacyAssignment[]): OrderAssignment[] {
  return legacy
    .map((item) => ({
      orderId: item.orderId ?? item.pedidoId ?? '',
      personIds: item.personIds ?? item.pessoaIds ?? [],
    }))
    .filter((item) => item.orderId.length > 0);
}

function migrateTipType(value: string | undefined): TipType {
  if (value === 'fixed' || value === 'valor-fixo') return 'fixed';
  return 'percentage';
}

function migrateTipConfig(legacy: LegacyTipConfig): TipConfig {
  return {
    active: legacy.active ?? legacy.ativa ?? true,
    type: migrateTipType(legacy.type ?? legacy.tipo),
    percentage: legacy.percentage ?? legacy.percentual ?? 10,
    fixedAmount: legacy.fixedAmount ?? legacy.valorFixo ?? 0,
    participants: legacy.participants ?? legacy.participantes ?? [],
    initialized: legacy.initialized ?? legacy.inicializado ?? false,
    knownPersonIds: legacy.knownPersonIds ?? legacy.pessoasConhecidas ?? [],
  };
}

/**
 * One-time migration from Portuguese storage keys/shapes to English.
 * Safe to call on every boot — runs only once per browser.
 */
export function migrateLegacyStorage(): void {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem(MIGRATION_FLAG) === '1') return;

  // Current table label (plain string or JSON string)
  if (!hasKey(STORAGE_KEYS.CURRENT_TABLE) && hasKey(LEGACY_STORAGE_KEYS.CURRENT_TABLE)) {
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEYS.CURRENT_TABLE);
    if (legacy !== null) {
      window.localStorage.setItem(STORAGE_KEYS.CURRENT_TABLE, legacy);
    }
  }

  if (!hasKey(STORAGE_KEYS.ORDERS) && hasKey(LEGACY_STORAGE_KEYS.ORDERS)) {
    const legacy = readJson<LegacyOrder[]>(LEGACY_STORAGE_KEYS.ORDERS);
    if (legacy) writeJson(STORAGE_KEYS.ORDERS, migrateOrders(legacy));
  }

  if (!hasKey(STORAGE_KEYS.PEOPLE) && hasKey(LEGACY_STORAGE_KEYS.PEOPLE)) {
    const legacy = readJson<LegacyPerson[]>(LEGACY_STORAGE_KEYS.PEOPLE);
    if (legacy) writeJson(STORAGE_KEYS.PEOPLE, migratePeople(legacy));
  }

  if (!hasKey(STORAGE_KEYS.ASSIGNMENTS) && hasKey(LEGACY_STORAGE_KEYS.ASSIGNMENTS)) {
    const legacy = readJson<LegacyAssignment[]>(LEGACY_STORAGE_KEYS.ASSIGNMENTS);
    if (legacy) writeJson(STORAGE_KEYS.ASSIGNMENTS, migrateAssignments(legacy));
  }

  if (!hasKey(STORAGE_KEYS.TIP_CONFIG) && hasKey(LEGACY_STORAGE_KEYS.TIP_CONFIG)) {
    const legacy = readJson<LegacyTipConfig>(LEGACY_STORAGE_KEYS.TIP_CONFIG);
    if (legacy) writeJson(STORAGE_KEYS.TIP_CONFIG, migrateTipConfig(legacy));
  }

  // Clean up legacy keys
  for (const key of Object.values(LEGACY_STORAGE_KEYS)) {
    window.localStorage.removeItem(key);
  }

  window.localStorage.setItem(MIGRATION_FLAG, '1');
}
