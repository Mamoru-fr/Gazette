import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gazette",
  description: "L'application du JT du Manoir Santos — agrégation RSS, lecture vocale, questionnement des articles.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
