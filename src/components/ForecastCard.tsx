import React from 'react';
import { ForecastData } from '@/types/weather.types';
import { formatTemp, getShortDay, capitalize } from '@/utils/formatters';
import { WeatherIcon } from '@/utils/weatherIcons';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

// Interfaz para los datos diarios del pronóstico
interface DailyForecastItem {
  dt: number;
  temps: number[];
  tempMin: number;
  tempMax: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  pop: number; // Probability of precipitation
  humidity: number;
  wind: number;
}

interface ForecastCardProps {
  forecast: ForecastData;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  // Agrupar pronósticos por día con tipos específicos
  const getDailyForecasts = () => {
    // ✅ Usar tipos específicos en lugar de any
    const dailyData: Record<string, DailyForecastItem> = {};
    
    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          dt: item.dt,
          temps: [item.main.temp],
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          weather: item.weather[0],
          pop: item.pop,
          humidity: item.main.humidity,
          wind: item.wind.speed,
        };
      } else {
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].tempMin = Math.min(dailyData[date].tempMin, item.main.temp_min);
        dailyData[date].tempMax = Math.max(dailyData[date].tempMax, item.main.temp_max);
        dailyData[date].pop = Math.max(dailyData[date].pop, item.pop);
      }
    });

    // Convertir a array y tomar solo 5 días
    return Object.values(dailyData).slice(0, 5);
  };

  const dailyForecasts = getDailyForecasts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-6">
        Pronóstico de 5 días
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {dailyForecasts.map((day, index) => (
          <motion.div
            key={day.dt}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all hover:transform hover:scale-105"
          >
            {/* Day */}
            <p className="text-blue-200 text-sm mb-3 font-medium">
              {index === 0 ? 'Hoy' : getShortDay(day.dt)}
            </p>
            
            {/* Weather Icon */}
            <div className="flex justify-center mb-3">
              <WeatherIcon 
                code={day.weather.icon} 
                size={48}
              />
            </div>
            
            {/* Weather Description */}
            <p className="text-xs text-blue-300 mb-3 capitalize h-8">
              {capitalize(day.weather.description)}
            </p>
            
            {/* Temperature */}
            <div className="flex justify-center gap-2 text-white font-semibold mb-3">
              <span className="text-lg">{formatTemp(day.tempMax)}</span>
              <span className="text-blue-300 text-lg">
                {formatTemp(day.tempMin)}
              </span>
            </div>

            {/* Probability of Precipitation */}
            {day.pop > 0 && (
              <div className="flex items-center justify-center gap-1 text-xs text-blue-300">
                <Droplets size={12} />
                <span>{Math.round(day.pop * 100)}%</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};