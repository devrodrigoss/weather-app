# ☁️ Weather Forecast App

Aplicación del clima moderna y responsive que permite consultar el clima actual y pronóstico de 5 días para cualquier ciudad del mundo.

## 🌐 Demo en Vivo
[Ver demo](https://weather-app-mu-eight-41.vercel.app/)

## ✨ Características

- 🔍 Búsqueda de ciudades en tiempo real
- 🌡️ Temperatura actual y sensación térmica
- 💨 Información detallada: viento, humedad, visibilidad, presión
- 📅 Pronóstico extendido de 5 días
- 🎨 Diseño moderno con glassmorphism
- 📱 Completamente responsive
- 🌍 Soporte multiidioma (español)
- ⚡ Datos en tiempo real de OpenWeather API

## 🚀 Tecnologías

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **HTTP Client:** Axios
- **Fechas:** date-fns
- **API:** OpenWeather API
- **Deploy:** Vercel

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ instalado
- Cuenta en [OpenWeather](https://openweathermap.org/api) (gratuita)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/devrodrigoss/weather-app.git
cd weather-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_WEATHER_API_KEY=tu_api_key_de_openweather
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

4. **Obtener API Key de OpenWeather**

- Regístrate en [OpenWeather](https://openweathermap.org/api)
- Ve a tu perfil → API keys
- Copia tu API key
- Pégala en `.env.local`

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
weather-app/
├── src/
│   └── app/
│       ├── page.tsx          # Componente principal
│       ├── layout.tsx        # Layout global
│       └── globals.css       # Estilos globales
├── public/                   # Assets estáticos
├── .env.local               # Variables de entorno (no se sube a Git)
├── .gitignore
├── package.json
└── README.md
```

## 🎯 Funcionalidades

### Búsqueda de Ciudades
- Escribe el nombre de cualquier ciudad
- Formato: "Santiago", "London", "New York"
- Presiona Enter o click en el botón de búsqueda

### Información Mostrada

**Clima Actual:**
- Temperatura en °C
- Sensación térmica
- Descripción del clima
- Icono animado según condición

**Detalles Meteorológicos:**
- Velocidad del viento (km/h)
- Humedad relativa (%)
- Visibilidad (km)
- Presión atmosférica (hPa)

**Pronóstico 5 Días:**
- Temperaturas máximas y mínimas
- Condición del clima por día
- Iconos representativos

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm start        # Servidor de producción
npm run lint     # Linter de código
```

## 🌍 API Utilizada

Este proyecto consume la [OpenWeather API](https://openweathermap.org/api):

- **Current Weather Data:** Clima actual de ciudades
- **5 Day Forecast:** Pronóstico de 5 días cada 3 horas
- **Límite gratuito:** 1,000 llamadas/día

## 🎨 Diseño

- Glassmorphism effects
- Gradientes dinámicos
- Animaciones suaves
- Dark theme nativo
- Responsive design mobile-first

## 📈 Mejoras Futuras

- [ ] Geolocalización automática del usuario
- [ ] Búsqueda por coordenadas GPS
- [ ] Gráficos de temperatura con Chart.js
- [ ] Modo claro/oscuro toggle
- [ ] Historial de ciudades buscadas
- [ ] Comparación entre ciudades
- [ ] Alertas meteorológicas
- [ ] Compartir en redes sociales

## 🐛 Solución de Problemas

### Error: "API Key no configurada"
- Verifica que `.env.local` existe
- Confirma que la variable se llama `NEXT_PUBLIC_WEATHER_API_KEY`
- Reinicia el servidor (`Ctrl + C` y `npm run dev`)

### Error: "Ciudad no encontrada"
- Verifica la ortografía
- Intenta con el nombre en inglés
- Ejemplo: "Nueva York" → "New York"

### Error: "API Key inválida"
- Espera 10 minutos después de crear la key
- Verifica que copiaste la key completa
- Revisa en OpenWeather que la key esté activa

## 📧 Contacto

**Rodrigo Santibáñez**
- Email: rosantibanezs@gmail.com
- LinkedIn: [linkedin.com/in/rodrigo-santibanez](https://linkedin.com/in/rodrigo-santibanez)
- GitHub: [github.com/devrodrigoss](https://github.com/devrodrigoss)
- Portafolio: [portafolio-rss.vercel.app](https://portafolio-rss.vercel.app)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
