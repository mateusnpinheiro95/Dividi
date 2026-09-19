import type { Pedido } from '@/types';
import { formatCurrency } from '@/utils';

interface OrderItemProps {
  pedido: Pedido;
  onRemove: (id: string) => void;
}

export const OrderItem = ({ pedido, onRemove }: OrderItemProps) => {
  const subtotal = pedido.quantidade * pedido.valorUnitario;

  return (
    <article className="order-item-card">
      <span className="quantity-badge" aria-label={`Quantidade: ${pedido.quantidade}`}>
        {pedido.quantidade}x
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-base text-gray-900 truncate">{pedido.nome}</p>
      </div>

      <p className="text-base font-semibold tabular-nums text-gray-900 shrink-0">
        {formatCurrency(subtotal)}
      </p>

      <button
        type="button"
        onClick={() => onRemove(pedido.id)}
        aria-label={`Remover ${pedido.nome}`}
        className="flex items-center justify-center size-11 -mr-2 text-gray-400 rounded-lg active:bg-gray-100 active:text-red-600 shrink-0"
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
    </article>
  );
};
