'use client';

import { useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFavoriteCities } from '@/hooks/useLocalStorage';
import { SearchBar } from '@/components/SearchBar';
import { CurrentWeather } from '@/components/CurrentWeather';
import { ForecastCard } from '@/components/ForecastCard';
import { TemperatureChart } from '@/components/TemperatureChart';
import { WeatherDetails } from '@/components/WeatherDetails';
import { WeatherMap } from '@/components/WeatherMap';
import { CurrentWeatherSkeleton, ForecastSkeleton } from '@/components/LoadingSkeleton';

export default function WeatherApp() {
  const { 
    weather, 
    forecast, 
    airQuality, 
    uvIndex, 
    loading, 
    error, 
    fetchWeatherByCity, 
    fetchWeatherByCoords 
  } = useWeather();
  
  const { coords, loading: geoLoading, getCurrentLocation } = useGeolocation();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteCities();

  // Cargar Santiago por defecto
  useEffect(() => {
    fetchWeatherByCity('Santiago');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando obtengamos coords, buscar clima
  useEffect(() => {
    if (coords) {
      fetchWeatherByCoords(coords.lat, coords.lon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  const handleSearch = (cityName: string) => {
    fetchWeatherByCity(cityName);
  };

  const handleToggleFavorite = () => {
    if (weather) {
      if (isFavorite(weather.name)) {
        removeFavorite(weather.name);
      } else {
        addFavorite({
          name: weather.name,
          country: weather.sys.country,
          lat: weather.coord.lat,
          lon: weather.coord.lon,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            ☁️ Weather Forecast Pro
          </h1>
          <p className="text-blue-200">
            Consulta el clima con datos en tiempo real y pronósticos detallados
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onLocationClick={getCurrentLocation}
            loading={loading}
            geoLoading={geoLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* Current Weather */}
          {loading ? (
            <CurrentWeatherSkeleton />
          ) : weather ? (
            <CurrentWeather
              weather={weather}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite(weather.name)}
            />
          ) : null}

          {/* Forecast */}
          {loading ? (
            <ForecastSkeleton />
          ) : forecast ? (
            <>
              <ForecastCard forecast={forecast} />
              <TemperatureChart forecast={forecast} />
            </>
          ) : null}

          {/* Weather Details (Air Quality & UV) */}
          {!loading && (airQuality || uvIndex) && (
            <WeatherDetails airQuality={airQuality} uvIndex={uvIndex} />
          )}

          {/* Weather Map */}
          {!loading && weather && (
            <WeatherMap
              center={weather.coord}
              cityName={weather.name}
              country={weather.sys.country}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-blue-200 text-sm">
          <p>
            Desarrollado por Rodrigo Santibáñez • Datos de{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              OpenWeather API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}