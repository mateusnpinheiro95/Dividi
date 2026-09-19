import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/constants';
import { sanitizeOrderName } from '@/utils';
import type { Order } from '@/types';

interface UseOrdersReturn {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<Omit<Order, 'id'>>) => void;
  removeOrder: (id: string) => void;
  getTotal: () => number;
}

function normalizeOrder(order: Order): Order {
  return {
    ...order,
    name: sanitizeOrderName(order.name),
  };
}

export function useOrders(): UseOrdersReturn {
  const [storedOrders, setOrders] = useLocalStorage<Order[]>(STORAGE_KEYS.ORDERS, []);

  const orders = useMemo(
    () => storedOrders.map(normalizeOrder),
    [storedOrders]
  );

  const addOrder = useCallback(
    (order: Omit<Order, 'id'>) => {
      const newOrder: Order = {
        ...order,
        name: sanitizeOrderName(order.name),
        id: crypto.randomUUID(),
      };
      setOrders((prev) => [...prev, newOrder]);
    },
    [setOrders]
  );

  const updateOrder = useCallback(
    (id: string, updates: Partial<Omit<Order, 'id'>>) => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== id) return order;
          const next = { ...order, ...updates };
          if (updates.name !== undefined) {
            next.name = sanitizeOrderName(updates.name);
          }
          return next;
        })
      );
    },
    [setOrders]
  );

  const removeOrder = useCallback(
    (id: string) => {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    },
    [setOrders]
  );

  const total = useMemo(
    () => orders.reduce((acc, order) => acc + order.quantity * order.unitPrice, 0),
    [orders]
  );

  const getTotal = useCallback(() => total, [total]);

  return {
    orders,
    addOrder,
    updateOrder,
    removeOrder,
    getTotal,
  };
}
