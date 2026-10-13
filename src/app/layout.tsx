import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "TP Auth — Espace personnel", description: "Authentification Next.js, Prisma et SQLite." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}