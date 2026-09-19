import type { Person } from '@/types';
import { getInitials } from '@/utils';

interface TipParticipantToggleProps {
  person: Person;
  isParticipating: boolean;
  onChange: (personId: string) => void;
}

export const TipParticipantToggle = ({
  person,
  isParticipating,
  onChange,
}: TipParticipantToggleProps) => {
  const initials = getInitials(person.name);

  return (
    <label className="flex items-center gap-3 px-4 py-3 min-h-[64px] cursor-pointer active:bg-gray-50">
      <span
        className="inline-flex items-center justify-center size-10 rounded-full text-white text-sm font-semibold shrink-0"
        style={{ backgroundColor: person.color }}
        aria-hidden="true"
      >
        {initials}
      </span>

      <span className="flex-1 min-w-0 flex flex-col">
        <span className="text-base font-medium text-gray-900 truncate">
          {person.name}
        </span>
        <span
          className={`text-xs font-medium ${
            isParticipating ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          {isParticipating ? 'Participando' : 'Não participa'}
        </span>
      </span>

      <input
        type="checkbox"
        checked={isParticipating}
        onChange={() => onChange(person.id)}
        aria-label={`${person.name}: ${isParticipating ? 'participando da gorjeta' : 'não participa da gorjeta'}`}
        className="size-5 rounded border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-600 focus:ring-offset-0 cursor-pointer"
      />
    </label>
  );
};
