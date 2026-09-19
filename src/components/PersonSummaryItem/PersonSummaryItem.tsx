import { getInitials, formatCurrency } from '@/utils';

interface PersonSummaryItemProps {
  name: string;
  color: string;
  total: number;
}

export const PersonSummaryItem = ({
  name,
  color,
  total,
}: PersonSummaryItemProps) => {
  const initials = getInitials(name);

  return (
    <div className="flex items-center gap-3 px-4 py-3 min-h-[64px]">
      <span
        className="inline-flex items-center justify-center size-10 rounded-full text-white text-sm font-semibold shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {initials}
      </span>

      <span className="flex-1 min-w-0 text-base font-medium text-gray-900 truncate">
        {name}
      </span>

      <span className="text-base font-extrabold tabular-nums text-gray-900 shrink-0">
        {formatCurrency(total)}
      </span>
    </div>
  );
};
