// Global application types

export interface Order {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Table {
  id: string;
  orders: Order[];
}

export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface OrderAssignment {
  orderId: string;
  personIds: string[];
}

export type TipType = 'percentage' | 'fixed';

export interface TipConfig {
  active: boolean;
  type: TipType;
  percentage: number;
  fixedAmount: number;
  participants: string[];
  /** Whether the participants list has been initialized at least once */
  initialized: boolean;
  /** Person IDs already seen — used to detect new people and include them by default */
  knownPersonIds: string[];
}
