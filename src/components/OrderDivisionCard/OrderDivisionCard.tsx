import { useEffect, useId, useState } from 'react';
import type { Order, Person } from '@/types';
import { formatCurrency, getInitials } from '@/utils';
import { PersonChip } from '../PersonChip';

interface OrderDivisionCardProps {
  order: Order;
  assignedPeople: Person[];
  allPeople: Person[];
  onAddPerson: (personId: string) => void;
  onRemovePerson: (personId: string) => void;
}

interface AssignPeopleSheetProps {
  orderName: string;
  allPeople: Person[];
  assignedIds: Set<string>;
  onToggle: (personId: string) => void;
  onClose: () => void;
}

const AssignPeopleSheet = ({
  orderName,
  allPeople,
  assignedIds,
  onToggle,
  onClose,
}: AssignPeopleSheetProps) => {
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-lg max-h-[80vh] flex flex-col">
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 mb-1">
          Quem consumiu?
        </h2>
        <p className="text-sm text-gray-600 mb-4 truncate">{orderName}</p>

        {allPeople.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">
            Adicione pessoas à mesa primeiro.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 overflow-y-auto min-h-0" role="list">
            {allPeople.map((person) => {
              const isAssigned = assignedIds.has(person.id);
              return (
                <li key={person.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(person.id)}
                    aria-pressed={isAssigned}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border min-h-11 active:scale-[0.99] transition-colors ${
                      isAssigned
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span
                      className="inline-flex items-center justify-center size-8 rounded-full text-white text-xs font-semibold shrink-0"
                      style={{ backgroundColor: person.color }}
                      aria-hidden="true"
                    >
                      {getInitials(person.name)}
                    </span>
                    <span className="flex-1 text-left text-sm font-medium text-gray-900">
                      {person.name}
                    </span>
                    {isAssigned ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5 text-primary-600 shrink-0"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span
                        className="size-5 rounded-full border-2 border-gray-300 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full btn-primary"
        >
          Concluído
        </button>
      </div>
    </div>
  );
};

export const OrderDivisionCard = ({
  order,
  assignedPeople,
  allPeople,
  onAddPerson,
  onRemovePerson,
}: OrderDivisionCardProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const subtotal = order.quantity * order.unitPrice;
  const hasPeople = assignedPeople.length > 0;
  const assignedIds = new Set(assignedPeople.map((p) => p.id));

  const handleToggle = (personId: string) => {
    if (assignedIds.has(personId)) {
      onRemovePerson(personId);
    } else {
      onAddPerson(personId);
    }
  };

  return (
    <>
      <article
        className={`card flex flex-col gap-3 ${
          !hasPeople ? 'border-red-300 bg-red-50/40' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              <span className="truncate">{order.name}</span>
              <span className="text-gray-500 font-normal">
                {' '}
                ({order.quantity}x) — {formatCurrency(subtotal)}
              </span>
            </p>
            {!hasPeople ? (
              <p className="text-xs text-red-600 mt-1">Selecione ao menos 1 pessoa</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {assignedPeople.map((person) => (
            <PersonChip
              key={person.id}
              person={person}
              size="sm"
              onRemove={() => onRemovePerson(person.id)}
            />
          ))}

          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            aria-label={`Adicionar pessoas a ${order.name}`}
            className="inline-flex items-center justify-center size-11 rounded-full bg-gray-100 text-gray-500 active:bg-gray-200 shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </article>

      {isSheetOpen ? (
        <AssignPeopleSheet
          orderName={order.name}
          allPeople={allPeople}
          assignedIds={assignedIds}
          onToggle={handleToggle}
          onClose={() => setIsSheetOpen(false)}
        />
      ) : null}
    </>
  );
};
