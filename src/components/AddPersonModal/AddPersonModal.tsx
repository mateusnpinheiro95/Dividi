import { useEffect, useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../Button';
import { getInitials } from '@/utils';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (nome: string) => void;
  nextColor: string;
}

interface AddPersonFormProps {
  onClose: () => void;
  onAdd: (nome: string) => void;
  nextColor: string;
}

const AddPersonForm = ({ onClose, onAdd, nextColor }: AddPersonFormProps) => {
  const titleId = useId();
  const nomeId = useId();
  const [nome, setNome] = useState('');

  const trimmed = nome.trim();
  const isValid = trimmed.length >= 2;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    onAdd(trimmed);
    onClose();
  };

  return (
    <div className="relative z-10 w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-lg">
      <h2 id={titleId} className="text-lg font-semibold text-gray-900 mb-4">
        Adicionar pessoa
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 py-2">
          <span
            className="inline-flex items-center justify-center size-14 rounded-full text-white text-xl font-semibold"
            style={{ backgroundColor: nextColor }}
            aria-hidden="true"
          >
            {trimmed ? getInitials(trimmed) : '?'}
          </span>
          <p className="text-xs text-gray-500">Pré-visualização do avatar</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={nomeId} className="text-[13px] text-gray-600">
            Nome
          </label>
          <input
            id={nomeId}
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Ana"
            className="input-field"
            autoFocus
            autoComplete="off"
            maxLength={40}
          />
          {trimmed.length > 0 && trimmed.length < 2 ? (
            <p className="text-xs text-red-600">Mínimo de 2 caracteres</p>
          ) : null}
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

export const AddPersonModal = ({
  isOpen,
  onClose,
  onAdd,
  nextColor,
}: AddPersonModalProps) => {
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
      aria-label="Adicionar pessoa"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar modal"
        onClick={onClose}
      />

      <AddPersonForm onClose={onClose} onAdd={onAdd} nextColor={nextColor} />
    </div>
  );
};
