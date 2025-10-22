// Types para la Weather App

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  '1h'?: number;
  '3h'?: number;
}

export interface Snow {
  '1h'?: number;
  '3h'?: number;
}

export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeatherData {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  snow?: Snow;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: Rain;
  snow?: Snow;
  sys: {
    pod: string; // Part of day (d/n)
  };
  dt_txt: string;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface AirQualityData {
  coord: Coordinates;
  list: Array<{
    main: {
      aqi: number; // Air Quality Index: 1-5
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }>;
}

export interface UVIndexData {
  lat: number;
  lon: number;
  date_iso: string;
  date: number;
  value: number;
}

export interface SavedCity {
  id: string;
  name: string;
  country: string;
  coord: Coordinates;
  addedAt: number;
}

export interface SearchHistoryItem {
  id: string;
  cityName: string;
  searchedAt: number;
}

export interface WeatherMapLayer {
  name: string;
  layer: string;
  opacity: number;
}

// Enums
export enum WeatherMapLayers {
  TEMP = 'temp_new',
  PRECIPITATION = 'precipitation_new',
  WIND = 'wind_new',
  CLOUDS = 'clouds_new',
  PRESSURE = 'pressure_new',
}

export enum AirQualityLevel {
  GOOD = 1,
  FAIR = 2,
  MODERATE = 3,
  POOR = 4,
  VERY_POOR = 5,
}

// API Response types
export interface ApiError {
  cod: string;
  message: string;
}

export interface WeatherApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Hook return types
export interface UseWeatherReturn {
  weather: CurrentWeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  uvIndex: UVIndexData | null;
  loading: boolean;
  error: string;
  fetchWeatherByCity: (cityName: string) => Promise<void>;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
}

export interface UseGeolocationReturn {
  coords: Coordinates | null;
  loading: boolean;
  error: string;
  getCurrentLocation: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}