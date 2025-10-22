'use client';

import React, { useState, useEffect } from 'react';
import { Coordinates } from '@/types/weather.types';
import { motion } from 'framer-motion';
import { Layers, Thermometer, CloudRain, Wind as WindIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

// Importar el mapa solo en el cliente (sin SSR)
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl overflow-hidden border border-white/20 h-96 flex items-center justify-center bg-white/5">
      <p className="text-blue-200">Cargando mapa...</p>
    </div>
  ),
});

interface WeatherMapProps {
  center: Coordinates;
  cityName: string;
  country: string;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({
  center,
  cityName,
  country,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<'temp' | 'precipitation' | 'wind' | 'none'>('temp');
  const [opacity, setOpacity] = useState(0.6);

  const layerInfo = {
    temp: { name: 'Temperatura', icon: Thermometer, color: 'bg-orange-500' },
    precipitation: { name: 'Precipitación', icon: CloudRain, color: 'bg-blue-500' },
    wind: { name: 'Viento', icon: WindIcon, color: 'bg-cyan-500' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 p-3 rounded-xl">
            <Layers className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            Mapa Meteorológico
          </h3>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedLayer('none')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedLayer === 'none'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-blue-300 hover:bg-white/10'
            }`}
          >
            Mapa Base
          </button>
          {(Object.keys(layerInfo) as Array<keyof typeof layerInfo>).map((layer) => {
            const LayerIcon = layerInfo[layer].icon;
            return (
              <button
                key={layer}
                onClick={() => setSelectedLayer(layer)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedLayer === layer
                    ? `${layerInfo[layer].color} text-white`
                    : 'bg-white/5 text-blue-300 hover:bg-white/10'
                }`}
                title={layerInfo[layer].name}
              >
                <LayerIcon size={16} />
                <span className="hidden md:inline">{layerInfo[layer].name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opacity Control */}
      {selectedLayer !== 'none' && (
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm text-blue-200">Opacidad:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity * 100}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-white font-medium w-12">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      )}

      {/* Map Container */}
      <MapComponent
        center={center}
        cityName={cityName}
        country={country}
        selectedLayer={selectedLayer}
        opacity={opacity}
      />

      {/* Legend */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-sm text-blue-200 mb-2">
          <strong>Leyenda:</strong>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-orange-300 font-medium">🌡️ Temperatura</p>
            <p className="text-blue-200">Colores cálidos = Mayor temperatura</p>
          </div>
          <div>
            <p className="text-blue-300 font-medium">🌧️ Precipitación</p>
            <p className="text-blue-200">Azul intenso = Mayor precipitación</p>
          </div>
          <div>
            <p className="text-cyan-300 font-medium">💨 Viento</p>
            <p className="text-blue-200">Flechas indican dirección y velocidad</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};