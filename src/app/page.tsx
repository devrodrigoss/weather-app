'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge, Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, Zap, CloudFog } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    dt_txt: string;
  }>;
}

export default function WeatherApp() {
  const [city, setCity] = useState('Santiago');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;

  useEffect(() => {
    fetchWeather('Santiago');
  }, []);

  const fetchWeather = async (cityName: string) => {
    if (!API_KEY) {
      setError('API Key no configurada. Por favor agrega tu API key de OpenWeather en .env.local');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Obtener clima actual
      const weatherResponse = await axios.get(
        `${API_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
      );

      // Obtener pronóstico de 5 días
      const forecastResponse = await axios.get(
        `${API_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
      );

      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data);
      setCity(cityName);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Ciudad no encontrada. Intenta con otro nombre.');
      } else if (err.response?.status === 401) {
        setError('API Key inválida. Verifica tu configuración.');
      } else {
        setError('Error al obtener datos del clima. Intenta nuevamente.');
      }
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  const getWeatherIcon = (weatherMain: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Clear: <Sun className="w-20 h-20 text-yellow-400" />,
      Clouds: <Cloud className="w-20 h-20 text-gray-400" />,
      Rain: <CloudRain className="w-20 h-20 text-blue-400" />,
      Drizzle: <CloudDrizzle className="w-20 h-20 text-blue-300" />,
      Snow: <CloudSnow className="w-20 h-20 text-blue-200" />,
      Thunderstorm: <Zap className="w-20 h-20 text-yellow-500" />,
      Mist: <CloudFog className="w-20 h-20 text-gray-300" />,
      Fog: <CloudFog className="w-20 h-20 text-gray-300" />,
    };
    return icons[weatherMain] || <Cloud className="w-20 h-20 text-gray-400" />;
  };

  const getDailyForecasts = () => {
    if (!forecast) return [];
    
    const dailyData: { [key: string]: any } = {};
    
    forecast.list.forEach((item) => {
      const date = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: item.dt,
          temps: [item.main.temp],
          weather: item.weather[0].main,
          description: item.weather[0].description,
        };
      } else {
        dailyData[date].temps.push(item.main.temp);
      }
    });

    return Object.values(dailyData).slice(0, 5).map((day: any) => ({
      ...day,
      temp_min: Math.min(...day.temps),
      temp_max: Math.max(...day.temps),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            ☁️ Weather Forecast
          </h1>
          <p className="text-blue-200">Consulta el clima de cualquier ciudad del mundo</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar ciudad... (ej: London, Tokyo, New York)"
              className="w-full px-6 py-4 pr-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 p-3 rounded-full transition-all"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
            <p className="text-white mt-4">Cargando datos del clima...</p>
          </div>
        )}

        {/* Weather Data */}
        {weather && !loading && (
          <div className="space-y-6">
            {/* Current Weather Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p className="text-blue-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                </div>
                <div className="text-right">
                  {getWeatherIcon(weather.weather[0].main)}
                </div>
              </div>

              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="text-7xl md:text-8xl font-bold text-white mb-2">
                    {Math.round(weather.main.temp)}°
                  </div>
                  <p className="text-xl text-blue-200 capitalize">
                    {weather.weather[0].description}
                  </p>
                  <p className="text-blue-300 mt-1">
                    Sensación térmica: {Math.round(weather.main.feels_like)}°C
                  </p>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/20">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Wind className="w-5 h-5" />
                    <span className="text-sm">Viento</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(weather.wind.speed * 3.6)} km/h
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Droplets className="w-5 h-5" />
                    <span className="text-sm">Humedad</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {weather.main.humidity}%
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Eye className="w-5 h-5" />
                    <span className="text-sm">Visibilidad</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {(weather.visibility / 1000).toFixed(1)} km
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Gauge className="w-5 h-5" />
                    <span className="text-sm">Presión</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {weather.main.pressure} hPa
                  </p>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            {forecast && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Pronóstico de 5 días
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {getDailyForecasts().map((day, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all"
                    >
                      <p className="text-blue-200 text-sm mb-3">
                        {index === 0
                          ? 'Hoy'
                          : format(new Date(day.date * 1000), 'EEE', { locale: es })}
                      </p>
                      <div className="flex justify-center mb-3">
                        {getWeatherIcon(day.weather)}
                      </div>
                      <p className="text-xs text-blue-300 mb-3 capitalize">
                        {day.description}
                      </p>
                      <div className="flex justify-center gap-2 text-white font-semibold">
                        <span>{Math.round(day.temp_max)}°</span>
                        <span className="text-blue-300">
                          {Math.round(day.temp_min)}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-blue-200 text-sm">
          <p>
            Desarrollado por Rodrigo Santibáñez • Datos de{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              OpenWeather API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}