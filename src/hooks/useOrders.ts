import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/constants';
import type { Pedido } from '@/types';

interface UseOrdersReturn {
  pedidos: Pedido[];
  addPedido: (pedido: Omit<Pedido, 'id'>) => void;
  removePedido: (id: string) => void;
  calcularTotal: () => number;
}

export function useOrders(): UseOrdersReturn {
  const [pedidos, setPedidos] = useLocalStorage<Pedido[]>(STORAGE_KEYS.PEDIDOS, []);

  const addPedido = useCallback(
    (pedido: Omit<Pedido, 'id'>) => {
      const novoPedido: Pedido = {
        ...pedido,
        id: crypto.randomUUID(),
      };
      setPedidos((prev) => [...prev, novoPedido]);
    },
    [setPedidos]
  );

  const removePedido = useCallback(
    (id: string) => {
      setPedidos((prev) => prev.filter((pedido) => pedido.id !== id));
    },
    [setPedidos]
  );

  const total = useMemo(
    () => pedidos.reduce((acc, pedido) => acc + pedido.quantidade * pedido.valorUnitario, 0),
    [pedidos]
  );

  const calcularTotal = useCallback(() => total, [total]);

  return {
    pedidos,
    addPedido,
    removePedido,
    calcularTotal,
  };
}
