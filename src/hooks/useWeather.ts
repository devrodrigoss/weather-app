import { useState, useCallback } from 'react';
import {
  CurrentWeatherData,
  ForecastData,
  AirQualityData,
  UVIndexData,
  UseWeatherReturn,
} from '@/types/weather.types';
import {
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  getForecastByCity,
  getForecastByCoords,
  getAirQuality,
  getUVIndex,
} from '@/services/weatherApi';

// Interfaz para errores de API
interface WeatherApiError {
  cod?: string | number;
  message: string;
  status?: number;
}

/**
 * Hook principal para manejar todos los datos del clima
 */
export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [uvIndex, setUVIndex] = useState<UVIndexData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  /**
   * Obtener datos del clima por nombre de ciudad
   */
  const fetchWeatherByCity = useCallback(async (cityName: string) => {
    if (!cityName.trim()) {
      setError('Nombre de ciudad requerido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Obtener clima actual y pronóstico en paralelo
      const [currentWeather, forecastData] = await Promise.all([
        getCurrentWeatherByCity(cityName),
        getForecastByCity(cityName),
      ]);

      setWeather(currentWeather);
      setForecast(forecastData);

      // 2. Con las coordenadas obtenidas, buscar calidad del aire y UV
      const { coord } = currentWeather;
      
      try {
        const [airQualityData, uvData] = await Promise.all([
          getAirQuality(coord.lat, coord.lon),
          getUVIndex(coord.lat, coord.lon),
        ]);
        
        setAirQuality(airQualityData);
        setUVIndex(uvData);
      } catch (secondaryError) {
        // Si falla la data secundaria, no es crítico
        console.warn('Error fetching secondary data:', secondaryError);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather:', err);
      
      // Manejo de errores específicos
      const weatherApiError = err as WeatherApiError;
      let errorMessage = weatherApiError?.message || 'Error al obtener datos del clima';
      
      if (weatherApiError.status === 404) {
        errorMessage = 'Ciudad no encontrada. Intenta con otro nombre.';
      } else if (weatherApiError.status === 401) {
        errorMessage = 'API Key inválida. Verifica tu configuración.';
      }
      
      setError(errorMessage);
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
      setUVIndex(null);
      setLoading(false);
    }
  }, []);

  /**
   * Obtener datos del clima por coordenadas
   */
  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError('');

    try {
      // 1. Obtener clima actual y pronóstico
      const [currentWeather, forecastData] = await Promise.all([
        getCurrentWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon),
      ]);

      setWeather(currentWeather);
      setForecast(forecastData);

      // 2. Obtener calidad del aire y UV
      try {
        const [airQualityData, uvData] = await Promise.all([
          getAirQuality(lat, lon),
          getUVIndex(lat, lon),
        ]);
        
        setAirQuality(airQualityData);
        setUVIndex(uvData);
      } catch (secondaryError) {
        console.warn('Error fetching secondary data:', secondaryError);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather by coords:', err);
      
      // Manejo de errores específicos
      const weatherApiError = err as WeatherApiError;
      let errorMessage = weatherApiError?.message || 'Error al obtener datos del clima';
      
      if (weatherApiError.status === 401) {
        errorMessage = 'API Key inválida. Verifica tu configuración.';
      }
      
      setError(errorMessage);
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
      setUVIndex(null);
      setLoading(false);
    }
  }, []);

  return {
    weather,
    forecast,
    airQuality,
    uvIndex,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByCoords,
  };
};