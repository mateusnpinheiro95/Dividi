import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PERSON_COLORS, STORAGE_KEYS } from '@/constants';
import type { Order, OrderAssignment, Person } from '@/types';

interface UsePeopleReturn {
  people: Person[];
  assignments: OrderAssignment[];
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  assignPersonToOrder: (orderId: string, personId: string) => void;
  removePersonFromOrder: (orderId: string, personId: string) => void;
  getPeopleForOrder: (orderId: string) => Person[];
  allOrdersHavePeople: (orders: Order[]) => boolean;
  getNextColor: () => string;
}

function pickNextColor(people: Person[]): string {
  const usedCounts = new Map<string, number>();
  for (const color of PERSON_COLORS) {
    usedCounts.set(color, 0);
  }
  for (const person of people) {
    usedCounts.set(person.color, (usedCounts.get(person.color) ?? 0) + 1);
  }

  let bestColor: string = PERSON_COLORS[0];
  let bestCount = Number.POSITIVE_INFINITY;
  for (const color of PERSON_COLORS) {
    const count = usedCounts.get(color) ?? 0;
    if (count < bestCount) {
      bestCount = count;
      bestColor = color;
    }
  }
  return bestColor;
}

export function usePeople(): UsePeopleReturn {
  const [people, setPeople] = useLocalStorage<Person[]>(STORAGE_KEYS.PEOPLE, []);
  const [assignments, setAssignments] = useLocalStorage<OrderAssignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    []
  );

  const getNextColor = useCallback(() => pickNextColor(people), [people]);

  const addPerson = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (trimmed.length < 2) return;

      const newPerson: Person = {
        id: crypto.randomUUID(),
        name: trimmed,
        color: pickNextColor(people),
      };
      setPeople((prev) => [...prev, newPerson]);
    },
    [people, setPeople]
  );

  const removePerson = useCallback(
    (id: string) => {
      setPeople((prev) => prev.filter((person) => person.id !== id));
      setAssignments((prev) =>
        prev
          .map((item) => ({
            ...item,
            personIds: item.personIds.filter((personId) => personId !== id),
          }))
          .filter((item) => item.personIds.length > 0)
      );
    },
    [setPeople, setAssignments]
  );

  const assignPersonToOrder = useCallback(
    (orderId: string, personId: string) => {
      setAssignments((prev) => {
        const existing = prev.find((item) => item.orderId === orderId);
        if (!existing) {
          return [...prev, { orderId, personIds: [personId] }];
        }
        if (existing.personIds.includes(personId)) {
          return prev;
        }
        return prev.map((item) =>
          item.orderId === orderId
            ? { ...item, personIds: [...item.personIds, personId] }
            : item
        );
      });
    },
    [setAssignments]
  );

  const removePersonFromOrder = useCallback(
    (orderId: string, personId: string) => {
      setAssignments((prev) =>
        prev
          .map((item) =>
            item.orderId === orderId
              ? { ...item, personIds: item.personIds.filter((id) => id !== personId) }
              : item
          )
          .filter((item) => item.personIds.length > 0)
      );
    },
    [setAssignments]
  );

  const getPeopleForOrder = useCallback(
    (orderId: string): Person[] => {
      const entry = assignments.find((item) => item.orderId === orderId);
      if (!entry) return [];
      return entry.personIds
        .map((personId) => people.find((person) => person.id === personId))
        .filter((person): person is Person => person !== undefined);
    },
    [assignments, people]
  );

  const allOrdersHavePeople = useCallback(
    (orders: Order[]): boolean => {
      if (orders.length === 0) return false;
      return orders.every((order) => {
        const entry = assignments.find((item) => item.orderId === order.id);
        return !!entry && entry.personIds.length > 0;
      });
    },
    [assignments]
  );

  return {
    people,
    assignments,
    addPerson,
    removePerson,
    assignPersonToOrder,
    removePersonFromOrder,
    getPeopleForOrder,
    allOrdersHavePeople,
    getNextColor,
  };
}
