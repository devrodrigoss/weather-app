import { useState, useEffect } from 'react';
import { UseLocalStorageReturn } from '@/types/weather.types';

/**
 * Hook para manejar localStorage con TypeScript y SSR
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar desde localStorage solo en el cliente
  useEffect(() => {
    try {
      // Verificar si estamos en el navegador
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
        setIsInitialized(true);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setIsInitialized(true);
    }
  }, [key]);

  // Función para actualizar el valor
  const setValue = (value: T) => {
    try {
      // Permitir que value sea una función como en useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Función para eliminar el valor
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return {
    value: isInitialized ? storedValue : initialValue,
    setValue,
    removeValue,
  };
}

/**
 * Hook específico para el historial de búsquedas
 */
export function useSearchHistory() {
  const { value, setValue, removeValue } = useLocalStorage<string[]>(
    'weather-search-history',
    []
  );

  const addSearch = (cityName: string) => {
    // Agregar al inicio, eliminar duplicados, mantener solo últimos 10
    const updated = [
      cityName,
      ...value.filter((city) => city.toLowerCase() !== cityName.toLowerCase()),
    ].slice(0, 10);
    setValue(updated);
  };

  const removeSearch = (cityName: string) => {
    setValue(value.filter((city) => city !== cityName));
  };

  const clearHistory = () => {
    removeValue();
  };

  return {
    history: value,
    addSearch,
    removeSearch,
    clearHistory,
  };
}

/**
 * Hook específico para ciudades favoritas
 */
export function useFavoriteCities() {
  const { value, setValue, removeValue } = useLocalStorage<
    Array<{
      name: string;
      country: string;
      lat: number;
      lon: number;
    }>
  >('weather-favorite-cities', []);

  const addFavorite = (city: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }) => {
    // Verificar que no exista ya
    const exists = value.some(
      (fav) =>
        fav.name.toLowerCase() === city.name.toLowerCase() &&
        fav.country === city.country
    );

    if (!exists) {
      setValue([...value, city]);
    }
  };

  const removeFavorite = (cityName: string) => {
    setValue(value.filter((city) => city.name !== cityName));
  };

  const isFavorite = (cityName: string): boolean => {
    return value.some(
      (city) => city.name.toLowerCase() === cityName.toLowerCase()
    );
  };

  const clearFavorites = () => {
    removeValue();
  };

  return {
    favorites: value,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  };
}