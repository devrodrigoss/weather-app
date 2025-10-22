'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Coordinates } from '@/types/weather.types';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  center: Coordinates;
  cityName: string;
  country: string;
  selectedLayer: 'temp' | 'precipitation' | 'wind' | 'none';
  opacity: number;
}

// Componente para actualizar el centro del mapa
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, 10, {
      duration: 1.5,
    });
  }, [center, map]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  cityName,
  country,
  selectedLayer,
  opacity,
}) => {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const position: [number, number] = [center.lat, center.lon];

  // URLs de las capas de OpenWeather
  const weatherLayers = {
    temp: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    precipitation: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    wind: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/20 h-96">
      <MapContainer
        center={position}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* Base Map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Weather Layer */}
        {selectedLayer !== 'none' && (
          <TileLayer
            url={weatherLayers[selectedLayer]}
            opacity={opacity}
          />
        )}

        {/* Marker */}
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-lg">{cityName}</p>
              <p className="text-sm text-gray-600">{country}</p>
            </div>
          </Popup>
        </Marker>

        {/* Update center when coordinates change */}
        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;