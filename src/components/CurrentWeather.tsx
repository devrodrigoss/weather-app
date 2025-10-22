import React from 'react';
import { Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Heart } from 'lucide-react';
import { CurrentWeatherData } from '@/types/weather.types';
import { formatTemp, formatDate, formatTime, msToKmh, metersToKm, capitalize } from '@/utils/formatters';
import { WeatherIcon } from '@/utils/weatherIcons';
import { motion } from 'framer-motion';

interface CurrentWeatherProps {
  weather: CurrentWeatherData;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const weatherCondition = weather.weather[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {weather.name}, {weather.sys.country}
            </h2>
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart
                  size={24}
                  className={`transition-all ${
                    isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-white/60 hover:text-white'
                  }`}
                />
              </button>
            )}
          </div>
          <p className="text-blue-200 flex items-center gap-2 mt-1">
            {formatDate(weather.dt)}
          </p>
        </div>
        <div className="text-right">
          {weatherCondition && (
            <WeatherIcon code={weatherCondition.icon} size={80} className="text-yellow-400" />
          )}
        </div>
      </div>

      {/* Temperature */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-7xl md:text-8xl font-bold text-white mb-2"
          >
            {formatTemp(weather.main.temp)}
          </motion.div>
          <p className="text-xl text-blue-200 capitalize">
            {weatherCondition && capitalize(weatherCondition.description)}
          </p>
          <p className="text-blue-300 mt-1">
            Sensación térmica: {formatTemp(weather.main.feels_like)}
          </p>
        </div>
        <div className="text-right text-blue-300">
          <p className="text-sm">Máx: {formatTemp(weather.main.temp_max)}</p>
          <p className="text-sm">Mín: {formatTemp(weather.main.temp_min)}</p>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/20">
        {/* Wind */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Wind className="w-5 h-5" />
            <span className="text-sm">Viento</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {msToKmh(weather.wind.speed)} km/h
          </p>
          {weather.wind.deg !== undefined && (
            <p className="text-xs text-blue-300 mt-1">
              {weather.wind.deg}°
            </p>
          )}
        </motion.div>

        {/* Humidity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Droplets className="w-5 h-5" />
            <span className="text-sm">Humedad</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {weather.main.humidity}%
          </p>
        </motion.div>

        {/* Visibility */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Eye className="w-5 h-5" />
            <span className="text-sm">Visibilidad</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {metersToKm(weather.visibility)} km
          </p>
        </motion.div>

        {/* Pressure */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Gauge className="w-5 h-5" />
            <span className="text-sm">Presión</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {weather.main.pressure} hPa
          </p>
        </motion.div>
      </div>

      {/* Sunrise & Sunset */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20"
        >
          <div className="flex items-center gap-2 text-orange-300 mb-2">
            <Sunrise className="w-5 h-5" />
            <span className="text-sm">Amanecer</span>
          </div>
          <p className="text-xl font-bold text-white">
            {formatTime(weather.sys.sunrise)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20"
        >
          <div className="flex items-center gap-2 text-indigo-300 mb-2">
            <Sunset className="w-5 h-5" />
            <span className="text-sm">Atardecer</span>
          </div>
          <p className="text-xl font-bold text-white">
            {formatTime(weather.sys.sunset)}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};