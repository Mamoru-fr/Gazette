/**
 * Gazette — modèle pur de la CSP (engagement §2 bis n°2, la dette désignée
 * de la tranche fondations : « CSP stricte à nonce, aucun script inline »).
 *
 * Modèle pur : aucune I/O, testable au banc. Le middleware génère le nonce,
 * ce module construit la politique — jamais d'unsafe-inline nulle part,
 * jamais d'injection possible via le nonce (alphabet fermé, refus net).
 */

/** L'alphabet fermé d'un nonce CSP : base64url, rien d'autre. */
const ALPHABET_NONCE = /^[a-zA-Z0-9_-]+$/;

/**
 * Valide un nonce. REFUS NET, jamais de correction silencieuse :
 * vide, blanc, ou caractères hors alphabet — un nonce est une frontière
 * de sécurité, pas une suggestion.
 */
export function assainirNonce(nonce: string): string {
  if (typeof nonce !== "string" || nonce.trim() === "") {
    throw new Error("assainirNonce: nonce vide — REFUS");
  }
  if (!ALPHABET_NONCE.test(nonce)) {
    throw new Error("assainirNonce: caractères interdits dans le nonce — REFUS");
  }
  return nonce;
}

export interface OptionsCsp {
  /**
   * Next.js en dev exige 'unsafe-eval' (HMR).Jamais en production :
   * l'option ne peut être vraie que si l'appelant prouve NODE_ENV=development
   * (ce contrôle vit au middleware, jamais au modèle).
   */
  developpement?: boolean;
}

/**
 * Construit la Content-Security-Policy stricte de Gazette.
 * Le nonce est l'UNIQUE exception de script au côté de 'self' ;
 * les images vivent en https (vignettes RSS) ; le reste est fermé :
 * object-src/base-uri/frame-ancestors 'none'.
 */
export function construireCsp(nonce: string, options: OptionsCsp = {}): string {
  const n = assainirNonce(nonce);
  const scriptSrc = ["'self'", `'nonce-${n}'`];
  if (options.developpement) scriptSrc.push("'unsafe-eval'");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self'",
    "img-src 'self' https: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}
