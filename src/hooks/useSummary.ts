import { useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { usePeople } from '@/hooks/usePeople';
import { useTip } from '@/hooks/useTip';
import type { PersonSummary, TipConfig } from '@/types';

/** Rounds a monetary value to 2 decimal places (cents) */
function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function computeTipAmount(subtotal: number, config: TipConfig): number {
  if (!config.active) return 0;

  if (config.type === 'percentage') {
    return roundMoney(subtotal * (config.percentage / 100));
  }

  return roundMoney(config.fixedAmount);
}

interface UseSummaryReturn {
  subtotal: number;
  tipAmount: number;
  grandTotal: number;
  tipPercentage: number | undefined;
  tipType: TipConfig['type'];
  summaries: PersonSummary[];
  hasData: boolean;
}

export function useSummary(): UseSummaryReturn {
  const { orders, getTotal } = useOrders();
  const { people, assignments } = usePeople();
  const { config } = useTip();

  return useMemo(() => {
    const subtotal = getTotal();
    const tipAmount = computeTipAmount(subtotal, config);
    const grandTotal = roundMoney(subtotal + tipAmount);

    const orderTotals = new Map<string, number>();
    for (const person of people) {
      orderTotals.set(person.id, 0);
    }

    for (const order of orders) {
      const assignment = assignments.find((item) => item.orderId === order.id);
      const personIds = assignment?.personIds ?? [];
      if (personIds.length === 0) continue;

      const orderTotal = order.quantity * order.unitPrice;
      const share = orderTotal / personIds.length;

      for (const personId of personIds) {
        if (!orderTotals.has(personId)) continue;
        orderTotals.set(personId, (orderTotals.get(personId) ?? 0) + share);
      }
    }

    const tipParticipants = config.participants.filter((id) =>
      people.some((person) => person.id === id)
    );
    const tipShare =
      tipAmount > 0 && tipParticipants.length > 0
        ? tipAmount / tipParticipants.length
        : 0;

    const summaries: PersonSummary[] = people.map((person) => {
      const orderTotal = roundMoney(orderTotals.get(person.id) ?? 0);
      const personTip = tipParticipants.includes(person.id)
        ? roundMoney(tipShare)
        : 0;

      return {
        personId: person.id,
        name: person.name,
        color: person.color,
        orderTotal,
        tipAmount: personTip,
        total: roundMoney(orderTotal + personTip),
      };
    });

    return {
      subtotal,
      tipAmount,
      grandTotal,
      tipPercentage: config.type === 'percentage' ? config.percentage : undefined,
      tipType: config.type,
      summaries,
      hasData: orders.length > 0 && people.length > 0,
    };
  }, [orders, people, assignments, config, getTotal]);
}
