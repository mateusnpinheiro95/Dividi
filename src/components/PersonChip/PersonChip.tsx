import type { Pessoa } from '@/types';
import { getInitials } from '@/utils';

interface PersonChipProps {
  pessoa: Pessoa;
  size?: 'sm' | 'md';
  showName?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export const PersonChip = ({
  pessoa,
  size = 'sm',
  showName = false,
  selected = false,
  onClick,
  onRemove,
}: PersonChipProps) => {
  const avatarSize = size === 'md' ? 'size-10 text-sm' : 'size-8 text-xs';
  const initials = getInitials(pessoa.nome);

  const content = (
    <>
      <span
        className={`relative inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ${avatarSize}`}
        style={{ backgroundColor: pessoa.cor }}
        aria-hidden={showName ? true : undefined}
      >
        {initials}
        {onRemove ? (
          <span
            className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-gray-700 text-white text-[10px] leading-none"
            aria-hidden="true"
          >
            ×
          </span>
        ) : null}
      </span>
      {showName ? (
        <span className="text-sm font-medium text-gray-900 truncate max-w-20">{pessoa.nome}</span>
      ) : (
        <span className="sr-only">{pessoa.nome}</span>
      )}
    </>
  );

  if (onClick || onRemove) {
    return (
      <button
        type="button"
        onClick={onRemove ?? onClick}
        aria-label={
          onRemove ? `Remover ${pessoa.nome}` : `Selecionar ${pessoa.nome}`
        }
        aria-pressed={onClick ? selected : undefined}
        className={`inline-flex flex-col items-center gap-1 min-h-11 min-w-11 rounded-lg p-1 active:scale-95 transition-transform ${
          selected ? 'ring-2 ring-primary-600 bg-primary-50' : ''
        }`}
      >
        {content}
      </button>
    );
  }

  return (
    <span className="inline-flex flex-col items-center gap-1" title={pessoa.nome}>
      {content}
    </span>
  );
};
