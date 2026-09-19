import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AddOrderModal,
  BottomNavigation,
  Button,
  OrderItem,
  PageHeader,
} from '@/components';
import { DEFAULT_TABLE_LABEL, ROUTES } from '@/constants';
import { useOrders } from '@/hooks';
import { formatCurrency } from '@/utils';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders, addOrder, removeOrder, getTotal } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const total = getTotal();
  const canProceed = orders.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader title="Comanda" subtitle={DEFAULT_TABLE_LABEL} />

      <div className="flex-1 flex flex-col container-mobile py-5 pb-4">
        <section className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 leading-7">Pedidos</h2>
            <p className="text-sm text-gray-600 mt-0.5">Adicione os itens consumidos</p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 !px-3 !py-2 !min-h-10"
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
            Adicionar
          </Button>
        </section>

        <section className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto" aria-label="Lista de pedidos">
          {orders.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <p className="text-sm text-gray-400 text-center">
                Nenhum item adicionado.
                <br />
                Toque em Adicionar para começar.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <OrderItem key={order.id} order={order} onRemove={removeOrder} />
            ))
          )}
        </section>

        <div className="mt-4 shrink-0 flex flex-col gap-3">
          <div className="total-card">
            <span className="text-sm text-gray-600">Total da comanda</span>
            <span className="text-xl font-bold tabular-nums text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            disabled={!canProceed}
            onClick={() => navigate(ROUTES.PEOPLE)}
          >
            Próximo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Button>
        </div>
      </div>

      <BottomNavigation currentStep={1} />

      <AddOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addOrder}
      />
    </div>
  );
};
