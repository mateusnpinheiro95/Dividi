import type { TipType } from '@/types';

interface TipTypeSelectorProps {
  selected: TipType;
  onChange: (type: TipType) => void;
}

const OPTIONS: {
  type: TipType;
  title: string;
  subtitle: string;
}[] = [
  {
    type: 'percentage',
    title: 'Percentual',
    subtitle: 'Padrão 10%',
  },
  {
    type: 'fixed',
    title: 'Valor fixo',
    subtitle: 'Definir valor',
  },
];

export const TipTypeSelector = ({ selected, onChange }: TipTypeSelectorProps) => {
  return (
    <div
      className="grid grid-cols-2 gap-3"
      role="radiogroup"
      aria-label="Tipo de gorjeta"
    >
      {OPTIONS.map((option) => {
        const isSelected = selected === option.type;

        return (
          <button
            key={option.type}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.type)}
            className={`card relative flex flex-col items-start gap-1 p-4 text-left min-h-[88px] transition-colors active:scale-[0.99] ${
              isSelected
                ? 'border-primary-600 ring-2 ring-primary-600 bg-primary-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <span
              className={`absolute top-3 right-3 flex size-5 items-center justify-center rounded-full border-2 ${
                isSelected
                  ? 'border-primary-600 bg-primary-600'
                  : 'border-gray-300 bg-white'
              }`}
              aria-hidden="true"
            >
              {isSelected ? (
                <span className="size-2 rounded-full bg-white" />
              ) : null}
            </span>

            <span className="text-base font-semibold text-gray-900 pr-6">
              {option.title}
            </span>
            <span className="text-sm text-gray-500">{option.subtitle}</span>
          </button>
        );
      })}
    </div>
  );
};
