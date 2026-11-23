/**
 * Gazette — modèle pur de la voix (tranche Écouter, rangée 23e).
 * L'article s'écoute plus que ça se lit : le coin sticky Écouter de la
 * maquette V3 devient réel — non branché, il aurait été décoratif
 * (rejet gravé, rangée 22e).
 *
 * Lois gravées :
 * - SEGMENTS AUX FRONTIÈRES DE PHRASES : le texte est découpé à la cible,
 *   jamais au milieu d'un mot — chaque segment se termine sur une
 *   ponctuation qui se respire, la réunion rejoint le texte ;
 * - LA LEÇON EST TITRE, SOURCE, CORPS : chaque phrase GARANTIT sa
 *   ponctuation finale (la jonction est un espace, jamais un point collé
 *   à un point) ; la note machine « corps V1 » n'y entre jamais — elle
 *   regarde l'œil, pas l'oreille ;
 * - LA VITESSE EST BORNÉE : 0,5 à 2 ; l'ingérable (NaN, texte, vide)
 *   retourne le DÉFAUT, jamais une exception en pleine lecture ;
 * - LA VOIX EST LOCALE ET CHOISIE : exacte de langue d'abord, puis la
 *   même langue à l'accent près, sinon RIEN (null) — jamais une voix au
 *   hasard qui lirait le français avec l'accent d'ailleurs ;
 * - L'ÉTAT AVANCE PAS À PAS : un segment lu, on passe au suivant ; la
 *   position négative est bornée à zéro, la file vide sait finir.
 */
export const CIBLE_SEGMENT = 200;
export const VITESSE_MIN = 0.5;
export const VITESSE_MAX = 2;
export const VITESSE_DEFAUT = 1;

/** Voix candidate du moteur du navigateur (nom + langue BCP-47). */
export interface VoixCandidate {
  nom: string;
  langue: string;
}

/**
 * Segments de lecture aux frontières de phrases, jamais coupé dans un
 * mot. Texte nu → un seul segment ; texte muet → aucun.
 */
export function decouperSegments(
  texte: string | null | undefined,
  cible: number = CIBLE_SEGMENT,
): string[] {
  if (!texte || !texte.trim()) return [];
  const phrases = texte.split(/(?<=[.!?:…])\s+/).filter((p) => p.trim());
  if (phrases.length === 0) return [texte.trim()];
  const segments: string[] = [];
  let courant: string[] = [];
  let longueur = 0;
  for (const p of phrases) {
    courant.push(p);
    longueur += p.length + 1;
    if (longueur >= cible) {
      segments.push(courant.join(" "));
      courant = [];
      longueur = 0;
    }
  }
  if (courant.length > 0) segments.push(courant.join(" "));
  return segments;
}

/** La vitesse bornée — l'ingérable rend le DÉFAUT, jamais une exception. */
export function bornerVitesse(valeur: unknown): number {
  const n = typeof valeur === "number" ? valeur : Number(valeur);
  if (!Number.isFinite(n)) return VITESSE_DEFAUT;
  return Math.min(VITESSE_MAX, Math.max(VITESSE_MIN, n));
}

/**
 * La voix locale de la langue préférée : exacte d'abord, puis même
 * langue à l'accent près (fr-FR prend fr_CA comme fr_FR), sinon RIEN —
 * jamais une voix au hasard.
 */
export function choisirVoix(
  voix: VoixCandidate[] | null | undefined,
  languePreferee: string = "fr-FR",
): VoixCandidate | null {
  if (!Array.isArray(voix) || voix.length === 0) return null;
  const propres = voix.filter(
    (x) => x && typeof x.nom === "string" && typeof x.langue === "string",
  );
  const exacte = propres.find((x) => x.langue === languePreferee);
  if (exacte) return exacte;
  const base = languePreferee.split("-")[0];
  const prefixee = propres.find(
    (x) => (x.langue.split("_")[0] ?? "").split("-")[0] === base,
  );
  return prefixee ?? null;
}

/** L'article réduit à ce que l'oreille demande au compositeur. */
export interface LeconArticle {
  titre: string;
  marque: string;
  dateAffichee: string;
  paragraphes: string[];
}

/**
 * La leçon : titre, source et date, corps — chaque phrase GARANTIT sa
 * ponctuation finale, la jonction est un espace.
 */
export function composerLecon(a: LeconArticle): string {
  const brutes = [
    a.titre,
    [a.marque, a.dateAffichee].filter((x) => x && x.trim()).join(" · "),
    ...a.paragraphes.map((p) => p.trim()),
  ];
  return brutes
    .filter((s) => s && s.trim())
    .map((s) => (/[.!?:…]$/.test(s) ? s : s + "."))
    .join(" ");
}

/** État de lecture pur — le composant garde la main, le modèle avance. */
export interface EtatLecture {
  position: number;
  total: number;
}

export interface EtatLectureSuivant {
  position: number;
  fini: boolean;
}

/** Un segment lu, on avance — borné, honnête, la file vide sait finir. */
export function etatSuivant(e: EtatLecture): EtatLectureSuivant {
  const pos = Math.max(0, Math.floor(e.position)) + 1;
  return { position: pos, fini: pos >= Math.max(0, Math.floor(e.total)) };
}
