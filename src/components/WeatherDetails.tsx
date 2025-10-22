import React from 'react';
import { AirQualityData, UVIndexData } from '@/types/weather.types';
import { getAirQualityLabel, getUVIndexLabel } from '@/utils/formatters';
import { motion } from 'framer-motion';
import { Wind, Sun, AlertTriangle } from 'lucide-react';

interface WeatherDetailsProps {
  airQuality?: AirQualityData | null;
  uvIndex?: UVIndexData | null;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  airQuality,
  uvIndex,
}) => {
  if (!airQuality && !uvIndex) return null;

  const airData = airQuality?.list[0];
  const uvData = uvIndex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid md:grid-cols-2 gap-6"
    >
      {/* Air Quality */}
      {airData && (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-500/20 p-3 rounded-xl">
              <Wind className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Calidad del Aire
            </h3>
          </div>

          {/* AQI Level */}
          <div className="mb-6">
            <p className="text-blue-200 text-sm mb-2">Índice AQI</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-white">
                {airData.main.aqi}
              </span>
              <span className={`text-xl font-semibold ${getAirQualityLabel(airData.main.aqi).color}`}>
                {getAirQualityLabel(airData.main.aqi).label}
              </span>
            </div>
          </div>

          {/* Air Components */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-300 text-sm">PM2.5</span>
              <span className="text-white font-semibold">
                {airData.components.pm2_5.toFixed(1)} μg/m³
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-300 text-sm">PM10</span>
              <span className="text-white font-semibold">
                {airData.components.pm10.toFixed(1)} μg/m³
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-300 text-sm">O₃ (Ozono)</span>
              <span className="text-white font-semibold">
                {airData.components.o3.toFixed(1)} μg/m³
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-300 text-sm">NO₂</span>
              <span className="text-white font-semibold">
                {airData.components.no2.toFixed(1)} μg/m³
              </span>
            </div>
          </div>

          {/* AQI Scale */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex gap-2 h-2 rounded-full overflow-hidden">
              <div className="flex-1 bg-green-500" title="Buena"></div>
              <div className="flex-1 bg-yellow-500" title="Aceptable"></div>
              <div className="flex-1 bg-orange-500" title="Moderada"></div>
              <div className="flex-1 bg-red-500" title="Mala"></div>
              <div className="flex-1 bg-purple-500" title="Muy Mala"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-blue-300">
              <span>1</span>
              <span>5</span>
            </div>
          </div>
        </div>
      )}

      {/* UV Index */}
      {uvData && (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-500/20 p-3 rounded-xl">
              <Sun className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Índice UV
            </h3>
          </div>

          {/* UV Level */}
          <div className="mb-6">
            <p className="text-blue-200 text-sm mb-2">Nivel actual</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-white">
                {uvData.value}
              </span>
              <span className={`text-xl font-semibold ${getUVIndexLabel(uvData.value).color}`}>
                {getUVIndexLabel(uvData.value).label}
              </span>
            </div>
          </div>

          {/* UV Recommendations */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-200 text-sm font-medium mb-2">
                  Recomendaciones
                </p>
                {uvData.value <= 2 && (
                  <p className="text-blue-200 text-sm">
                    Puedes estar al aire libre sin protección solar.
                  </p>
                )}
                {uvData.value > 2 && uvData.value <= 5 && (
                  <p className="text-blue-200 text-sm">
                    Usa protector solar. Busca sombra durante el mediodía.
                  </p>
                )}
                {uvData.value > 5 && uvData.value <= 7 && (
                  <p className="text-blue-200 text-sm">
                    Protección necesaria. Usa protector solar, sombrero y lentes.
                  </p>
                )}
                {uvData.value > 7 && uvData.value <= 10 && (
                  <p className="text-blue-200 text-sm">
                    Protección extra necesaria. Evita el sol entre 10AM-4PM.
                  </p>
                )}
                {uvData.value > 10 && (
                  <p className="text-blue-200 text-sm">
                    ¡Precaución extrema! Evita exposición solar. Usa protección máxima.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* UV Scale */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex gap-1 h-2 rounded-full overflow-hidden">
              <div className="flex-[2] bg-green-500" title="Bajo"></div>
              <div className="flex-[3] bg-yellow-500" title="Moderado"></div>
              <div className="flex-[2] bg-orange-500" title="Alto"></div>
              <div className="flex-[3] bg-red-500" title="Muy Alto"></div>
              <div className="flex-1 bg-purple-500" title="Extremo"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-blue-300">
              <span>0</span>
              <span>2</span>
              <span>5</span>
              <span>7</span>
              <span>10</span>
              <span>11+</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};