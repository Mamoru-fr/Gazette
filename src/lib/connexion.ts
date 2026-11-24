/**
 * Gazette — modèle pur de la page Connexion (rangée 26e, besoin 6 de
 * la spec : « Connexion », pas « audit » — le mot du client, §8).
 * Ajouter un flux RSS par simple copier-coller, plafond affiché
 * honnêtement, jamais une limite d'architecture.
 *
 * Lois gravées :
 * - L'ADRESSE EST HTTPS OU RIEN : le même pare-feu que la rangée 21e
 *   (hôte à point ou localhost, pas de blanc ni de @) ; l'invalide est
 *   refusé net, jamais corrigé en silence ;
 * - LA NORME EST LA CLÉ DU DOUBLON : hôte insensible à la casse, barre
 *   finale retirée — coller deux fois la même adresse ne connecte rien
 *   deux fois ;
 * - LE PLAFOND DIT SON NOM : à 50 flux connectés, le plafond V1 refuse
 *   en le disant (mou par nature, jamais une limite d'architecture) ;
 * - LE VERDICT EST UNE PAROLE, PAS UN BUG : chaque état porte son
 *   message entier, la vue n'invente rien.
 *
 * Modèle pur : aucune I/O, aucune écriture — l'ingestion (route API +
 * base, s2) est la tranche suivante, jamais enjambée ; le verdict
 * « prête » dit la vérité : la connexion attend son ingestion.
 */
import { PLAFOND_FLUX_V1 } from "./une";
/** Une seule vérité du plafond — réexportée depuis la Une, jamais recopiée. */
export { PLAFOND_FLUX_V1 };

/** Un flux déjà connecté, tel que la base le dira un jour (s2). */
export interface FluxConnecte {
  id: string;
  /** Nom affiché du flux (sa marque) ; null = l'hôte dira. */
  nom: string | null;
  url: string;
}

/** L'état du verdict — discriminateur honnête, jamais un code muet. */
export type EtatConnexion = "refuse" | "doublon" | "plafond" | "prete";

export interface VerdictConnexion {
  etat: EtatConnexion;
  message: string;
  /** L'adresse normalisée, quand elle existe ; null sinon. */
  url: string | null;
}

/**
 * Normalise une adresse de flux : https strict, hôte à point ou
 * localhost (le pare-feu de la rangée 21e), barre finale retirée.
 * Refus net (null) : jamais de correction en silence.
 */
export function normaliserUrlFlux(saisie: string): string | null {
  if (typeof saisie !== "string") return null;
  const u = saisie.trim();
  if (u === "" || /\s|@/.test(u)) return null;
  let x: URL;
  try {
    x = new URL(u);
  } catch {
    return null;
  }
  if (x.protocol !== "https:") return null;
  if (x.hostname !== "localhost" && !x.hostname.includes(".")) return null;
  let chemin = x.pathname;
  if (chemin.length > 1 && chemin.endsWith("/")) {
    chemin = chemin.slice(0, -1);
  }
  const requete = x.search || "";
  return `${x.protocol}//${x.host}${chemin}${requete}`;
}

/** Un doublon se juge sur l'adresse normalisée, jamais sur la colle brute. */
export function dejaConnecte(
  normalisee: string | null,
  existants: readonly FluxConnecte[],
): boolean {
  if (!normalisee) return false;
  return existants.some((f) => normaliserUrlFlux(f.url) === normalisee);
}

/**
 * Le verdict entier d'un copier-coller : refuse, doublon, plafond ou
 * prête — chaque état porte sa parole, la vue n'en ajoute pas.
 */
export function jugerConnexion(
  saisie: string,
  existants: readonly FluxConnecte[] = [],
  plafond: number = PLAFOND_FLUX_V1,
): VerdictConnexion {
  const normalisee = normaliserUrlFlux(saisie);
  if (!normalisee) {
    return {
      etat: "refuse",
      message:
        "Ce n'est pas une adresse de flux valide — collez-la en https, telle quelle.",
      url: null,
    };
  }
  if (dejaConnecte(normalisee, existants)) {
    return {
      etat: "doublon",
      message: "Ce flux est déjà connecté — jamais deux fois la même adresse.",
      url: normalisee,
    };
  }
  if (existants.length >= plafond) {
    return {
      etat: "plafond",
      message:
        `Le plafond V1 (${plafond} flux) est atteint — dit honnêtement, jamais une limite d'architecture.`,
      url: normalisee,
    };
  }
  return {
    etat: "prete",
    message:
      "Adresse valide — prête à connecter : l'écriture attend l'ingestion (s2), jamais simulée.",
    url: normalisee,
  };
}

export interface LigneFlux {
  id: string;
  /** La marque du flux, ou son hôte quand la base n'a pas de nom (dit honnêtement). */
  marque: string;
  url: string;
}

export interface ConnexionModel {
  titre: string;
  sousTitre: string;
  /** "7 / 50" — le compteur honnête, plafond dit avec lui. */
  compteur: string;
  offres: number;
  lignes: LigneFlux[];
  /** La vérité de la base vierge, dite telle quelle. */
  vide: string | null;
}

/** L'hôte d'une adresse déjà normalisée — pour la marque muette. */
function hoteDe(u: string): string {
  try {
    return new URL(u).hostname;
  } catch {
    return "source inconnue";
  }
}

/**
 * Compose la page Connexion : titre « Vos flux » de la maquette V3
 * validée, compteur honnête, une ligne par flux connecté, et la vérité
 * de la file VIDE quand la base est vierge — jamais un simulacre.
 */
export function composerConnexion(
  flux: readonly FluxConnecte[],
): ConnexionModel {
  const lignes = flux.map((f) => ({
    id: f.id,
    marque: f.nom ?? hoteDe(f.url),
    url: f.url,
  }));
  return {
    titre: "Vos flux",
    sousTitre: "Ajouter un flux RSS par simple copier-coller.",
    compteur: `${flux.length} / ${PLAFOND_FLUX_V1}`,
    offres: flux.length,
    lignes,
    vide:
      flux.length === 0
        ? "Aucun flux connecté à ce jour — la file est vide et dite telle quelle ; la sélection du JT viendra avec l'ingestion (s2)."
        : null,
  };
}
