import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchCities } from '@/services/weatherApi';
import { SearchSkeleton } from './LoadingSkeleton';

interface SearchBarProps {
  onSearch: (cityName: string) => void;
  onLocationClick: () => void;
  loading?: boolean;
  geoLoading?: boolean;
}

interface CityResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onLocationClick,
  loading = false,
  geoLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar ciudades con debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        setSearchLoading(true);
        try {
          const results = await searchCities(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error searching cities:', error);
          setSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: CityResult) => {
    const cityName = city.state 
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;
    
    setQuery(cityName);
    onSearch(cityName);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ciudad... (ej: Santiago, London, Tokyo)"
            className="w-full px-6 py-4 pr-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            disabled={loading}
          />
          
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-28 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}

          {/* Location button */}
          <button
            type="button"
            onClick={onLocationClick}
            disabled={geoLoading}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors disabled:opacity-50"
            title="Usar mi ubicación"
          >
            <MapPin size={20} className={geoLoading ? 'animate-pulse' : ''} />
          </button>

          {/* Search button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed p-3 rounded-full transition-all"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-50">
          {searchLoading ? (
            <div className="p-4">
              <SearchSkeleton />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {suggestions.map((city, index) => (
                <button
                  key={`${city.name}-${city.country}-${index}`}
                  onClick={() => handleSuggestionClick(city)}
                  className="w-full text-left px-6 py-3 hover:bg-white/10 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <p className="font-medium text-white group-hover:text-blue-300 transition-colors">
                      {city.name}
                      {city.state && `, ${city.state}`}
                    </p>
                    <p className="text-sm text-blue-300">
                      {city.country}
                    </p>
                  </div>
                  <MapPin size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          ) : query.length >= 3 ? (
            <div className="px-6 py-4 text-center text-blue-300">
              No se encontraron ciudades
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};