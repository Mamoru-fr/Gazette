import { headers } from "next/headers";
import { assainirNonce } from "./csp";

/**
 * Gazette — branchement du nonce aux scripts (tranche UI numéro 1, la dette
 * désignée de la rangée 18e : « branchement du nonce aux balises <Script> »).
 *
 * Loi gravée : ABSENCE n'est pas CORRUPTION.
 * - header absent (réponse rendue hors middleware, prébuild) -> null :
 *   pas d'attribut nonce, AUCUN script inline ne doit être posé —
 *   la CSP barre d'office, la page reste silencieuse ;
 * - header présent mais corrompu -> REFUS NET hérité d'assainirNonce,
 *   jamais de correction silencieuse : un nonce est une frontière,
 *   pas une suggestion.
 */

export interface EnTetes {
  /** Accès insensible-ish à la casse : on tente la variante canonique ET la capitale. */
  get(nom: string): string | null | undefined;
}

/** Modèle pur : rend le nonce de la requête, null si absent ; corrompu = jet. */
export function extraireNonce(entetes: EnTetes): string | null {
  const brut = entetes.get("x-nonce") ?? entetes.get("X-Nonce") ?? null;
  if (brut === null || brut === undefined) return null;
  return assainirNonce(brut);
}

/** Enrobage serveur : lit les entêtes réelles de la requête courante. */
export async function lireNonce(): Promise<string | null> {
  return extraireNonce(await headers());
}
