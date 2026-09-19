import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AddOrderModal,
  BottomNavigation,
  Button,
  OcrCaptureModal,
  OrderItem,
  PageHeader,
} from '@/components';
import { DEFAULT_TABLE_LABEL, ROUTES } from '@/constants';
import { useOrders } from '@/hooks';
import { formatCurrency } from '@/utils';
import type { Order } from '@/types';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders, addOrder, updateOrder, removeOrder, getTotal } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>();

  const total = getTotal();
  const canProceed = orders.length > 0;

  const handleCloseOrderModal = () => {
    setIsModalOpen(false);
    setEditingOrder(undefined);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleOrdersExtracted = (extracted: Omit<Order, 'id'>[]) => {
    for (const order of extracted) {
      addOrder(order);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader title="Comanda" subtitle={DEFAULT_TABLE_LABEL} />

      <div className="flex-1 flex flex-col container-mobile py-5 pb-4">
        <section className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 leading-7">Pedidos</h2>
            <p className="text-sm text-gray-600 mt-0.5">Adicione os itens consumidos</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsOcrModalOpen(true)}
              aria-label="Escanear cupom"
              title="Escanear cupom"
              className="btn-secondary !px-2.5 !py-2 !min-h-10 !min-w-10"
            >
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
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.055-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
                />
              </svg>
            </button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingOrder(undefined);
                setIsModalOpen(true);
              }}
              className="!px-3 !py-2 !min-h-10"
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
          </div>
        </section>

        <section className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto" aria-label="Lista de pedidos">
          {orders.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <p className="text-sm text-gray-400 text-center">
                Nenhum item adicionado.
                <br />
                Toque em Adicionar ou Escanear para começar.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                onEdit={handleEditOrder}
                onRemove={removeOrder}
              />
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
        onClose={handleCloseOrderModal}
        onAdd={addOrder}
        onEdit={updateOrder}
        editingOrder={editingOrder}
      />

      <OcrCaptureModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onOrdersExtracted={handleOrdersExtracted}
      />
    </div>
  );
};
