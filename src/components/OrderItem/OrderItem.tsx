import type { Order } from '@/types';
import { formatCurrency } from '@/utils';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

interface OrderItemProps {
  order: Order;
  onEdit: (order: Order) => void;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export const OrderItem = ({
  order,
  onEdit,
  onRemove,
  onQuantityChange,
}: OrderItemProps) => {
  const subtotal = order.quantity * order.unitPrice;
  const canDecrease = order.quantity > MIN_QUANTITY;
  const canIncrease = order.quantity < MAX_QUANTITY;

  return (
    <article
      className="order-item-card cursor-pointer active:bg-gray-50"
      onClick={() => onEdit(order)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onEdit(order);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Editar ${order.name}`}
    >
      <div className="flex items-start gap-2 min-w-0">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-base text-gray-900 truncate">{order.name}</p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(order.id);
          }}
          aria-label={`Remover ${order.name}`}
          className="flex items-center justify-center size-9 -mt-1 -mr-1 text-gray-400 rounded-lg active:bg-gray-100 active:text-red-600 shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 mt-2 min-w-0">
        <div
          className="flex items-center gap-0.5 shrink-0 rounded-lg bg-primary-50 p-0.5"
          role="group"
          aria-label={`Quantidade de ${order.name}`}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onQuantityChange(order.id, order.quantity - 1)}
            disabled={!canDecrease}
            aria-label={`Diminuir quantidade de ${order.name}`}
            className="flex items-center justify-center size-8 rounded-md text-primary-700 active:bg-primary-100 disabled:opacity-30 disabled:active:bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-3.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>

          <span
            className="min-w-6 text-center text-sm font-semibold tabular-nums text-primary-700"
            aria-live="polite"
          >
            {order.quantity}
          </span>

          <button
            type="button"
            onClick={() => onQuantityChange(order.id, order.quantity + 1)}
            disabled={!canIncrease}
            aria-label={`Aumentar quantidade de ${order.name}`}
            className="flex items-center justify-center size-8 rounded-md text-primary-700 active:bg-primary-100 disabled:opacity-30 disabled:active:bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-3.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        <p className="text-base font-semibold tabular-nums text-gray-900 whitespace-nowrap">
          {formatCurrency(subtotal)}
        </p>
      </div>
    </article>
  );
};
