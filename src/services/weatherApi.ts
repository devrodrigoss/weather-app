import axios from 'axios';
import {
  CurrentWeatherData,
  ForecastData,
  AirQualityData,
  UVIndexData,
  Coordinates,
} from '@/types/weather.types';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;

if (!API_KEY) {
  console.error('⚠️ API Key no configurada en .env.local');
}

// Interfaz para resultados de búsqueda de ciudades
interface CitySearchResult {
  name: string;
  local_names: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Cliente axios configurado
const weatherClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar API key
weatherClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    appid: API_KEY,
    units: 'metric',
    lang: 'es',
  }
  return config;
});

/**
 * Obtener clima actual por nombre de ciudad
 */
export const getCurrentWeatherByCity = async (
  cityName: string
): Promise<CurrentWeatherData> => {
  const response = await weatherClient.get('/weather', {
    params: { q: cityName },
  });
  return response.data;
};

/**
 * Obtener clima actual por coordenadas
 */
export const getCurrentWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<CurrentWeatherData> => {
  const response = await weatherClient.get('/weather', {
    params: { lat, lon },
  });
  return response.data;
};

/**
 * Obtener pronóstico de 5 días por ciudad
 */
export const getForecastByCity = async (
  cityName: string
): Promise<ForecastData> => {
  const response = await weatherClient.get('/forecast', {
    params: { q: cityName },
  });
  return response.data;
};

/**
 * Obtener pronóstico de 5 días por coordenadas
 */
export const getForecastByCoords = async (
  lat: number,
  lon: number
): Promise<ForecastData> => {
  const response = await weatherClient.get('/forecast', {
    params: { lat, lon },
  });
  return response.data;
};

/**
 * Obtener calidad del aire por coordenadas
 */
export const getAirQuality = async (
  lat: number,
  lon: number
): Promise<AirQualityData> => {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution`,
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality:', error);
    throw error;
  }
};

/**
 * Obtener índice UV por coordenadas
 */
export const getUVIndex = async (
  lat: number,
  lon: number
): Promise<UVIndexData> => {
  try {
    const response = await weatherClient.get('/uvi', {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching UV index:', error);
    throw error;
  }
};

/**
 * Buscar ciudades (autocomplete)
 */
export const searchCities = async (query: string): Promise<CitySearchResult[]> => {
  try {
    const response = await axios.get(
      'http://api.openweathermap.org/geo/1.0/direct',
      {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

/**
 * Obtener coordenadas de una ciudad
 */
export const getCityCoordinates = async (
  cityName: string
): Promise<Coordinates | null> => {
  try {
    const results = await searchCities(cityName);
    if (results.length > 0) {
      return {
        lat: results[0].lat,
        lon: results[0].lon,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
};

/**
 * Obtener todos los datos de clima para una ubicación
 */
export const getAllWeatherData = async (cityName: string) => {
  try {
    const [currentWeather, forecast] = await Promise.all([
      getCurrentWeatherByCity(cityName),
      getForecastByCity(cityName),
    ]);

    const { coord } = currentWeather;
    const [airQuality, uvIndex] = await Promise.all([
      getAirQuality(coord.lat, coord.lon),
      getUVIndex(coord.lat, coord.lon),
    ]);

    return {
      current: currentWeather,
      forecast,
      airQuality,
      uvIndex,
    };
  } catch (error) {
    console.error('Error fetching all weather data:', error);
    throw error;
  }
};

/**
 * Obtener URL de tile para mapa de clima
 */
export const getWeatherMapTileUrl = (
  layer: string,
  zoom: number,
  x: number,
  y: number
): string => {
  return `https://tile.openweathermap.org/map/${layer}/${zoom}/${x}/${y}.png?appid=${API_KEY}`;
};

// Solución para la exportación anónima
const weatherApi = {
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  getForecastByCity,
  getForecastByCoords,
  getAirQuality,
  getUVIndex,
  searchCities,
  getCityCoordinates,
  getAllWeatherData,
  getWeatherMapTileUrl,
};

export default weatherApi;