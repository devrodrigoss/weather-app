import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  Wind,
  type LucideIcon,
} from 'lucide-react';

interface WeatherIconProps {
  code: string;
  size?: number;
  className?: string;
}

/**
 * Mapeo de códigos de OpenWeather a iconos
 */
const weatherIconMap: { [key: string]: LucideIcon } = {
  // Clear
  '01d': Sun,
  '01n': Sun,
  
  // Few clouds
  '02d': Cloud,
  '02n': Cloud,
  
  // Scattered clouds
  '03d': Cloud,
  '03n': Cloud,
  
  // Broken clouds
  '04d': Cloud,
  '04n': Cloud,
  
  // Shower rain
  '09d': CloudDrizzle,
  '09n': CloudDrizzle,
  
  // Rain
  '10d': CloudRain,
  '10n': CloudRain,
  
  // Thunderstorm
  '11d': CloudLightning,
  '11n': CloudLightning,
  
  // Snow
  '13d': CloudSnow,
  '13n': CloudSnow,
  
  // Mist
  '50d': CloudFog,
  '50n': CloudFog,
};

/**
 * Componente para renderizar icono del clima
 */
export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  size = 48,
  className = '',
}) => {
  const IconComponent = weatherIconMap[code] || Cloud;
  
  return <IconComponent size={size} className={className} />;
};

/**
 * Obtener icono por condición climática (main)
 */
export const getWeatherIconByCondition = (
  condition: string
): LucideIcon => {
  const conditionMap: { [key: string]: LucideIcon } = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Drizzle: CloudDrizzle,
    Snow: CloudSnow,
    Thunderstorm: CloudLightning,
    Mist: CloudFog,
    Fog: CloudFog,
    Haze: CloudFog,
    Smoke: CloudFog,
    Dust: Wind,
    Sand: Wind,
    Ash: Wind,
    Squall: Wind,
    Tornado: Wind,
  };

  return conditionMap[condition] || Cloud;
};

/**
 * Obtener color del icono según condición
 */
export const getWeatherIconColor = (condition: string): string => {
  const colorMap: { [key: string]: string } = {
    Clear: 'text-yellow-400',
    Clouds: 'text-gray-400',
    Rain: 'text-blue-400',
    Drizzle: 'text-blue-300',
    Snow: 'text-blue-200',
    Thunderstorm: 'text-yellow-500',
    Mist: 'text-gray-300',
    Fog: 'text-gray-300',
    Haze: 'text-gray-300',
    Smoke: 'text-gray-400',
    Dust: 'text-orange-300',
    Sand: 'text-orange-300',
    Ash: 'text-gray-500',
    Squall: 'text-slate-400',
    Tornado: 'text-slate-500',
  };

  return colorMap[condition] || 'text-gray-400';
};

export default WeatherIcon;