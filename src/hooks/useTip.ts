import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  DEFAULT_TIP_FIXED,
  DEFAULT_TIP_PERCENTAGE,
  MAX_TIP_FIXED,
  MAX_TIP_PERCENTAGE,
  MIN_TIP_FIXED,
  MIN_TIP_PERCENTAGE,
  STORAGE_KEYS,
} from '@/constants';
import type { Person, TipConfig, TipType } from '@/types';

const DEFAULT_CONFIG: TipConfig = {
  active: true,
  type: 'percentage',
  percentage: DEFAULT_TIP_PERCENTAGE,
  fixedAmount: DEFAULT_TIP_FIXED,
  participants: [],
  initialized: false,
  knownPersonIds: [],
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sameIdList(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

interface UseTipReturn {
  config: TipConfig;
  setType: (type: TipType) => void;
  setPercentage: (value: number) => void;
  setFixedAmount: (value: number) => void;
  toggleParticipant: (personId: string) => void;
  syncParticipants: (people: Person[]) => void;
  canProceed: boolean;
}

export function useTip(): UseTipReturn {
  const [config, setConfig] = useLocalStorage<TipConfig>(
    STORAGE_KEYS.TIP_CONFIG,
    DEFAULT_CONFIG
  );

  const setType = useCallback(
    (type: TipType) => {
      setConfig((prev) => ({ ...prev, type, active: true }));
    },
    [setConfig]
  );

  const setPercentage = useCallback(
    (value: number) => {
      const percentage = clamp(
        Number.isFinite(value) ? value : DEFAULT_TIP_PERCENTAGE,
        MIN_TIP_PERCENTAGE,
        MAX_TIP_PERCENTAGE
      );
      setConfig((prev) => ({ ...prev, percentage }));
    },
    [setConfig]
  );

  const setFixedAmount = useCallback(
    (value: number) => {
      const fixedAmount = clamp(
        Number.isFinite(value) ? value : DEFAULT_TIP_FIXED,
        MIN_TIP_FIXED,
        MAX_TIP_FIXED
      );
      setConfig((prev) => ({ ...prev, fixedAmount }));
    },
    [setConfig]
  );

  const toggleParticipant = useCallback(
    (personId: string) => {
      setConfig((prev) => {
        const isParticipating = prev.participants.includes(personId);
        return {
          ...prev,
          initialized: true,
          participants: isParticipating
            ? prev.participants.filter((id) => id !== personId)
            : [...prev.participants, personId],
        };
      });
    },
    [setConfig]
  );

  const syncParticipants = useCallback(
    (people: Person[]) => {
      const personIds = people.map((person) => person.id);

      setConfig((prev) => {
        const known = prev.knownPersonIds ?? [];

        if (!prev.initialized) {
          if (personIds.length === 0) return prev;
          return {
            ...prev,
            initialized: true,
            participants: personIds,
            knownPersonIds: personIds,
          };
        }

        const stillValid = prev.participants.filter((id) => personIds.includes(id));
        const newcomers = personIds.filter((id) => !known.includes(id));
        const nextParticipants = [...stillValid, ...newcomers];
        const nextKnown = personIds;

        if (
          sameIdList(nextParticipants, prev.participants) &&
          sameIdList(nextKnown, known)
        ) {
          return prev;
        }

        return {
          ...prev,
          participants: nextParticipants,
          knownPersonIds: nextKnown,
        };
      });
    },
    [setConfig]
  );

  const canProceed = !config.active || config.participants.length > 0;

  return {
    config,
    setType,
    setPercentage,
    setFixedAmount,
    toggleParticipant,
    syncParticipants,
    canProceed,
  };
}
