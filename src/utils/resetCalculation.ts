import { ROUTES, STORAGE_KEYS } from '@/constants';

/**
 * Clears all Dividi localStorage keys and navigates to the home screen
 * with a full reload so every hook remounts with empty state.
 */
export function resetCalculation(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore storage errors
    }
  }

  window.location.assign(ROUTES.HOME);
}
