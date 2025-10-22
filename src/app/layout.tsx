import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Forecast Pro | Clima en Tiempo Real",
  description: "Consulta el clima con datos en tiempo real, mapas meteorológicos, pronósticos extendidos, calidad del aire y más.",
  keywords: "clima, weather, pronóstico, temperatura, lluvia, viento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}