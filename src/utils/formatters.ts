import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatear temperatura
 */
export const formatTemp = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

/**
 * Formatear fecha
 */
export const formatDate = (timestamp: number, formatStr: string = 'EEEE, d MMMM'): string => {
  return format(new Date(timestamp * 1000), formatStr, { locale: es });
};

/**
 * Formatear hora
 */
export const formatTime = (timestamp: number): string => {
  return format(new Date(timestamp * 1000), 'HH:mm', { locale: es });
};

/**
 * Obtener día de la semana corto
 */
export const getShortDay = (timestamp: number): string => {
  return format(new Date(timestamp * 1000), 'EEE', { locale: es });
};

/**
 * Convertir velocidad de viento m/s a km/h
 */
export const msToKmh = (ms: number): number => {
  return Math.round(ms * 3.6);
};

/**
 * Convertir visibilidad de metros a kilómetros
 */
export const metersToKm = (meters: number): string => {
  return (meters / 1000).toFixed(1);
};

/**
 * Obtener descripción de calidad del aire
 */
export const getAirQualityLabel = (aqi: number): { label: string; color: string } => {
  switch (aqi) {
    case 1:
      return { label: 'Buena', color: 'text-green-400' };
    case 2:
      return { label: 'Aceptable', color: 'text-yellow-400' };
    case 3:
      return { label: 'Moderada', color: 'text-orange-400' };
    case 4:
      return { label: 'Mala', color: 'text-red-400' };
    case 5:
      return { label: 'Muy Mala', color: 'text-purple-400' };
    default:
      return { label: 'Desconocida', color: 'text-gray-400' };
  }
};

/**
 * Obtener descripción de índice UV
 */
export const getUVIndexLabel = (uv: number): { label: string; color: string } => {
  if (uv <= 2) {
    return { label: 'Bajo', color: 'text-green-400' };
  } else if (uv <= 5) {
    return { label: 'Moderado', color: 'text-yellow-400' };
  } else if (uv <= 7) {
    return { label: 'Alto', color: 'text-orange-400' };
  } else if (uv <= 10) {
    return { label: 'Muy Alto', color: 'text-red-400' };
  } else {
    return { label: 'Extremo', color: 'text-purple-400' };
  }
};

/**
 * Obtener dirección cardinal del viento
 */
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
};

/**
 * Capitalizar primera letra
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};