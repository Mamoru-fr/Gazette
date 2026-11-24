/**
 * Gazette — modèle pur du questionnement (tranche rangée 25e).
 * Derrière ça se lit, ça se débat : le coin sticky Questionner de la
 * maquette V3 devient réel, branché sur le pré-message (rangée 17e).
 * Non branché, il aurait été décoratif — rejet gravé (rangée 22e).
 *
 * Lois gravées :
 * - LE PRÉ-MESSAGE EST LA PART DU CLIENT : composé du modèle pur
 *   pré-message (titre, ID, source, date, lien, extrait, clôture), il
 *   est MONTRÉ et copié au presse-papier AVANT toute ouverture d'app —
 *   l'IA reçoit tout, le repo ne retient rien ;
 * - L'APP INCONNUE EST REFUSÉE NET : le choix du client est mémorisé
 *   (localStorage, clé dédiée), jamais imposé ; un nom absent du
 *   registre des apps ne lance rien ;
 * - LE LIEN EST HTTPS OU RIEN : jamais d'ouverture surprise ; le
 *   pré-remplissage n'est proposé QUE là où l'app l'offre (paramètre
 *   documenté dans le registre) — sinon l'app s'ouvre nue et le
 *   pré-message déjà copié fait le travail ;
 * - LE REPLI D'ÉTIQUETTE EST PARTAGÉ : une seule passe de JS décide
 *   pour les DEUX coins (rangée 23e : jamais deux parchemins), le CSS
 *   habille ce qui existe.
 *
 * Modèle pur : aucune I/O, testable au banc. Le pré-remplissage par
 * paramètre d'URL est un EXCÉDENT, jamais une promesse : certaines apps
 * n'y répondent pas, le pré-message copié reste la voie sûre.
 */
import type { PreMessageArticle } from "./pre-message";

/** Une IA de questionnement inscrite au registre de la maison. */
export interface ApplicationQuestionnement {
  /** Nom affiché — la clé de mémorisation du choix du client. */
  nom: string;
  /** URL d'ouverture, https strict. */
  url: string;
  /** Paramètre de pré-remplissage, uniquement si l'app l'offre. */
  parametre?: string;
}

/**
 * Le registre des apps de questionnement — V1. Le Chat (Mistral) y
 * figure sans paramètre : rien n'est affirmé qui ne soit garanti.
 * L'ajout d'une app est un geste du registre, jamais silencieux.
 */
export const APPLICATIONS: readonly ApplicationQuestionnement[] = [
  { nom: "ChatGPT", url: "https://chatgpt.com/", parametre: "q" },
  { nom: "Claude", url: "https://claude.ai/new/", parametre: "q" },
  { nom: "Copilot", url: "https://copilot.microsoft.com/", parametre: "q" },
  { nom: "Le Chat — Mistral", url: "https://chat.mistral.ai/chat" },
  { nom: "Gemini", url: "https://gemini.google.com/app" },
];

/** Où vit le choix mémorisé du client — préfixe maison, jamais nu. */
export const CLE_MEMOIRE_APP = "gazette:app";

/** Au-delà de ce défilement (px), les étiquettes des coins se replient. */
export const SEUIL_REPLI_DEFAUT = 48;

/**
 * Retrouve une application par son nom — insensible à la casse et aux
 * blancs, REFUS NET sinon (null) : jamais de première correspondance
 * approximative qui ouvrirait la mauvaise porte.
 */
export function retrouverApplication(
  nom: string | null | undefined,
  apps: readonly ApplicationQuestionnement[] = APPLICATIONS,
): ApplicationQuestionnement | null {
  if (typeof nom !== "string") return null;
  const cible = nom.trim().toLowerCase();
  if (cible === "") return null;
  return (
    apps.find(
      (a) =>
        a && typeof a.nom === "string" && a.nom.trim().toLowerCase() === cible,
    ) ?? null
  );
}

/** https strict, hôte non vide sans blanc ni @ (le pare-feu de la rangée 21e). */
function estUrlHttpsOuverte(u: string): boolean {
  try {
    const x = new URL(u.trim());
    return (
      x.protocol === "https:" &&
      (x.hostname === "localhost" || x.hostname.includes("."))
    );
  } catch {
    return false;
  }
}

/**
 * Le lien d'ouverture de l'app : pré-rempli si l'app offre un paramètre
 * documenté, nu sinon — l'invalide est refusé net (null), jamais
 * corrigé en silence.
 */
export function construireLien(
  app: ApplicationQuestionnement | null,
  message: string,
): string | null {
  if (!app || typeof app.url !== "string" || !estUrlHttpsOuverte(app.url)) {
    return null;
  }
  const msge = (message ?? "").trim();
  if (msge === "" || !app.parametre) return app.url;
  const sep = app.url.includes("?") ? "&" : "?";
  return `${app.url}${sep}${app.parametre}=${encodeURIComponent(msge)}`;
}

/** L'article réduit à ce que le pré-message demande. */
export interface ArticleQuestionnable {
  id: string;
  titre: string;
  marque: string;
  dateAffichee: string;
  lien: string | null;
  paragraphes: string[];
}

/**
 * Le pont vers le modèle du pré-message : marque devient la source,
 * dateAffichee la date telle que dite à l'écran (langue maison, absence
 * dite honnêtement — jamais une date inventée), les paragraphes V1
 * rejoignent l'extrait. Aucune I/O, aucune perte.
 */
export function versPreMessageArticle(
  a: ArticleQuestionnable,
): PreMessageArticle {
  return {
    id: a.id,
    titre: a.titre,
    source: a.marque,
    publieLe: a.dateAffichee,
    lien: a.lien ?? "",
    extrait: a.paragraphes.join(" "),
  };
}

/**
 * Le repli d'étiquette des coins (maquette V3 : au défilement, les
 * textes s'enlèvent) — une seule passe de JS pour les deux coins.
 * L'ingérable n'est pas replié : false, jamais une exception.
 */
export function doitReplier(
  positionY: unknown,
  seuil: number = SEUIL_REPLI_DEFAUT,
): boolean {
  const n = typeof positionY === "number" ? positionY : Number(positionY);
  return Number.isFinite(n) && n >= seuil;
}
