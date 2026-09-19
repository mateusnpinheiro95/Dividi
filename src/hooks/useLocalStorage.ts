import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar estado no localStorage
 * Exemplo de uso: const [name, setName] = useLocalStorage('userName', 'Default');
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado inicial vem do localStorage ou valor padrão
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Sincroniza com localStorage quando o valor muda
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
