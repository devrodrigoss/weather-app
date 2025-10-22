import React from 'react';

/**
 * Skeleton genérico
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * Loading para el clima actual
 */
export const CurrentWeatherSkeleton: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>

      {/* Temperature */}
      <div className="mb-6">
        <Skeleton className="h-24 w-40 mb-4" />
        <Skeleton className="h-6 w-56 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4">
            <Skeleton className="h-4 w-16 mb-3" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Loading para el pronóstico
 */
export const ForecastSkeleton: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 text-center">
            <Skeleton className="h-4 w-12 mx-auto mb-3" />
            <Skeleton className="w-12 h-12 mx-auto mb-3 rounded-full" />
            <Skeleton className="h-3 w-20 mx-auto mb-3" />
            <Skeleton className="h-6 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Loading para búsqueda
 */
export const SearchSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/5 hover:bg-white/10 rounded-xl p-3 cursor-pointer transition-all"
        >
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
};

/**
 * Loading completo de página
 */
export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <Skeleton className="h-16 w-full rounded-full" />

      {/* Current Weather Skeleton */}
      <CurrentWeatherSkeleton />

      {/* Forecast Skeleton */}
      <ForecastSkeleton />
    </div>
  );
};