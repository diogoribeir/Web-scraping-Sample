import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bagagem — Tutor de Idiomas para Viagem",
  description:
    "Tutor de IA que ensina a entender e construir um idioma para uma viagem específica.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1f6feb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
