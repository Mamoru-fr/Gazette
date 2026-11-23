"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

/**
 * Gazette — le contexte du nonce (tranche UI 1) : tout composant qui veut
 * poser un <Script> inline le demande ICI (useNonce), jamais en dur —
 * le nonce est le secret de la requête, pas une constante de module.
 * Null = pas de nonce pour cette réponse (hors middleware) : le composant
 * ne pose alors AUCUN script inline, la CSP fait barrière toute seule.
 */
export const ContexteNonce = createContext<string | null>(null);

export function useNonce(): string | null {
  return useContext(ContexteNonce);
}

export function FournisseurNonce({
  nonce,
  children,
}: {
  nonce: string | null;
  children: ReactNode;
}) {
  return <ContexteNonce.Provider value={nonce}>{children}</ContexteNonce.Provider>;
}
