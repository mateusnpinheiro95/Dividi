import { useEffect, useState } from 'react';

interface TipAmountControlProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: '%' | null;
  label: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const TipAmountControl = ({
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  label,
}: TipAmountControlProps) => {
  const [draft, setDraft] = useState(() => String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const canDecrease = value > min;
  const canIncrease = value < max;

  const commitDraft = () => {
    const normalized = draft.replace(',', '.');
    const parsed = Number.parseFloat(normalized);
    if (!Number.isFinite(parsed)) {
      setDraft(String(value));
      return;
    }
    const next = clamp(parsed, min, max);
    onChange(next);
    setDraft(String(next));
  };

  return (
    <div
      className="flex items-center justify-between gap-1 rounded-xl bg-gray-100 px-1 py-1"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - step, min, max))}
        disabled={!canDecrease}
        aria-label={`Diminuir ${label}`}
        className="flex items-center justify-center size-11 shrink-0 rounded-lg text-gray-700 active:bg-gray-200 disabled:text-gray-300 disabled:active:bg-transparent"
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </button>

      <div className="flex-1 flex items-center justify-center min-w-0 gap-0.5">
        <label htmlFor="tip-amount-input" className="sr-only">
          {label}
        </label>
        <input
          id="tip-amount-input"
          type="text"
          inputMode="decimal"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur();
            }
          }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="w-20 max-w-[40%] bg-transparent text-center text-xl font-semibold tabular-nums text-gray-900 outline-none focus:ring-0 border-0 p-0"
        />
        {suffix === '%' ? (
          <span className="text-xl font-semibold text-gray-900" aria-hidden="true">
            %
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onChange(clamp(value + step, min, max))}
        disabled={!canIncrease}
        aria-label={`Aumentar ${label}`}
        className="flex items-center justify-center size-11 shrink-0 rounded-lg text-gray-700 active:bg-gray-200 disabled:text-gray-300 disabled:active:bg-transparent"
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
};
