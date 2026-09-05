import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MeteoPulse UCV — Aplicație Prognoză Meteo',
  description: 'Aplicație web modernă pentru prognoză meteo în timp real, telemetrie atmosferică și indice calitatea aerului. Proiect Practică UCV.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className="dark">
      <body className="bg-[#08090b] text-[#f3f4f6] antialiased selection:bg-slate-700/40 selection:text-white">
        {children}
      </body>
    </html>
  );
}
