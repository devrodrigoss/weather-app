import { useState, useEffect } from 'react';
import { Coordinates, UseGeolocationReturn } from '@/types/weather.types';

/**
 * Hook para obtener la geolocalización del usuario
 */
export const useGeolocation = (
  autoFetch: boolean = false
): UseGeolocationReturn => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por tu navegador');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Error al obtener ubicación';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible';
            break;
          case err.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (autoFetch) {
      getCurrentLocation();
    }
  }, [autoFetch]);

  return {
    coords,
    loading,
    error,
    getCurrentLocation,
  };
};