import { useEffect, useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../Button';
import type { Order } from '@/types';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: Omit<Order, 'id'>) => void;
}

interface AddOrderFormProps {
  onClose: () => void;
  onAdd: (order: Omit<Order, 'id'>) => void;
}

const AddOrderForm = ({ onClose, onAdd }: AddOrderFormProps) => {
  const titleId = useId();
  const nameId = useId();
  const priceId = useId();
  const quantityId = useId();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);

  const priceNumber = Number(price.replace(',', '.'));
  const isValid =
    name.trim().length > 0 &&
    Number.isFinite(priceNumber) &&
    priceNumber > 0 &&
    quantity >= 1;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    onAdd({
      name: name.trim(),
      unitPrice: priceNumber,
      quantity,
    });
    onClose();
  };

  return (
    <div className="relative z-10 w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-lg">
      <h2 id={titleId} className="text-lg font-semibold text-gray-900 mb-4">
        Adicionar item
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-[13px] text-gray-600">
            Nome do item
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Água sem gás"
            className="input-field"
            autoFocus
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={priceId} className="text-[13px] text-gray-600">
            Valor unitário (R$)
          </label>
          <input
            id={priceId}
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d.,]/g, ''))}
            placeholder="Ex.: 10,00"
            className="input-field"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={quantityId} className="text-[13px] text-gray-600">
            Quantidade
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              aria-label="Diminuir quantidade"
              className="flex items-center justify-center size-11 rounded-lg border border-gray-200 text-gray-900 font-semibold active:bg-gray-100"
            >
              −
            </button>
            <input
              id={quantityId}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const next = Number(e.target.value);
                setQuantity(Number.isFinite(next) && next >= 1 ? Math.floor(next) : 1);
              }}
              className="input-field text-center tabular-nums"
            />
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              aria-label="Aumentar quantidade"
              className="flex items-center justify-center size-11 rounded-lg border border-gray-200 text-gray-900 font-semibold active:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth disabled={!isValid}>
            Adicionar
          </Button>
        </div>
      </form>
    </div>
  );
};

export const AddOrderModal = ({ isOpen, onClose, onAdd }: AddOrderModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Adicionar item"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar modal"
        onClick={onClose}
      />

      <AddOrderForm onClose={onClose} onAdd={onAdd} />
    </div>
  );
};
