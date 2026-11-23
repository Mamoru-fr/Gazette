import type { Metadata } from "next";
import "./globals.css";
import { lireNonce } from "../lib/nonce";
import { FournisseurNonce } from "./nonce-contexte";

export const metadata: Metadata = {
  title: "Gazette",
  description: "L'application du JT du Manoir Santos — agrégation RSS, lecture vocale, questionnement des articles.",
};

/**
 * Tranche UI 1 : le RootLayout passe serveur (async) pour lire le nonce
 * posé par le middleware (x-nonce) et le brancher aux scripts — tout
 * script inline futur prendra son nonce via useNonce(), jamais en dur.
 * Absent (prébuild) : nonce null, AUCUN script inline posé, la CSP barre.
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = await lireNonce();
  return (
    <html lang="fr">
      <body>
        <FournisseurNonce nonce={nonce}>{children}</FournisseurNonce>
      </body>
    </html>
  );
}
