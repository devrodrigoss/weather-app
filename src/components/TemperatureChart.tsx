import React from 'react';
import { ForecastData } from '@/types/weather.types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line } from 'recharts';
import { formatTime } from '@/utils/formatters';
import { motion } from 'framer-motion';

interface TemperatureChartProps {
  forecast: ForecastData;
}

interface ChartDataPoint {
  time: string;
  temperatura: number;
  sensacion: number;
  humedad: number;
}

interface TooltipPayload {
  value: number;
  payload: ChartDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ forecast }) => {
  // Preparar datos para el gráfico (primeras 24 horas = 8 registros de 3h)
  const chartData: ChartDataPoint[] = forecast.list.slice(0, 8).map((item) => ({
    time: formatTime(item.dt),
    temperatura: Math.round(item.main.temp),
    sensacion: Math.round(item.main.feels_like),
    humedad: item.main.humidity,
  }));

  // Custom tooltip
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{payload[0].payload.time}</p>
          <p className="text-blue-300 text-sm">
            Temperatura: <span className="font-bold">{payload[0].value}°C</span>
          </p>
          <p className="text-purple-300 text-sm">
            Sensación: <span className="font-bold">{payload[1].value}°C</span>
          </p>
          <p className="text-cyan-300 text-sm">
            Humedad: <span className="font-bold">{payload[0].payload.humedad}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-6">
        Evolución de Temperatura (24h)
      </h3>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorFeels" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            
            <XAxis 
              dataKey="time" 
              stroke="#93c5fd"
              style={{ fontSize: '12px' }}
            />
            
            <YAxis 
              stroke="#93c5fd"
              style={{ fontSize: '12px' }}
              tickFormatter={(value: number) => `${value}°`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Área de temperatura real */}
            <Area
              type="monotone"
              dataKey="temperatura"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorTemp)"
              name="Temperatura"
            />
            
            {/* Línea de sensación térmica */}
            <Line
              type="monotone"
              dataKey="sensacion"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#a855f7', r: 4 }}
              name="Sensación"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-blue-200">Temperatura</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-purple-500 rounded"></div>
          <span className="text-sm text-purple-200">Sensación térmica</span>
        </div>
      </div>
    </motion.div>
  );
};