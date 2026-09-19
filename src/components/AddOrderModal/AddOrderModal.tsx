import { useEffect, useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../Button';
import type { Pedido } from '@/types';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pedido: Omit<Pedido, 'id'>) => void;
}

interface AddOrderFormProps {
  onClose: () => void;
  onAdd: (pedido: Omit<Pedido, 'id'>) => void;
}

const AddOrderForm = ({ onClose, onAdd }: AddOrderFormProps) => {
  const titleId = useId();
  const nomeId = useId();
  const valorId = useId();
  const quantidadeId = useId();

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const valorNumerico = Number(valor.replace(',', '.'));
  const isValid =
    nome.trim().length > 0 &&
    Number.isFinite(valorNumerico) &&
    valorNumerico > 0 &&
    quantidade >= 1;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    onAdd({
      nome: nome.trim(),
      valorUnitario: valorNumerico,
      quantidade,
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
          <label htmlFor={nomeId} className="text-[13px] text-gray-600">
            Nome do item
          </label>
          <input
            id={nomeId}
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Água sem gás"
            className="input-field"
            autoFocus
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={valorId} className="text-[13px] text-gray-600">
            Valor unitário (R$)
          </label>
          <input
            id={valorId}
            type="text"
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value.replace(/[^\d.,]/g, ''))}
            placeholder="Ex.: 10,00"
            className="input-field"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={quantidadeId} className="text-[13px] text-gray-600">
            Quantidade
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantidade((prev) => Math.max(1, prev - 1))}
              aria-label="Diminuir quantidade"
              className="flex items-center justify-center size-11 rounded-lg border border-gray-200 text-gray-900 font-semibold active:bg-gray-100"
            >
              −
            </button>
            <input
              id={quantidadeId}
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => {
                const next = Number(e.target.value);
                setQuantidade(Number.isFinite(next) && next >= 1 ? Math.floor(next) : 1);
              }}
              className="input-field text-center tabular-nums"
            />
            <button
              type="button"
              onClick={() => setQuantidade((prev) => prev + 1)}
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
