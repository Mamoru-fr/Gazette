/**
 * Gazette — modèle pur de la vue article (tranche UI 3, rangée 22e).
 * Fidèle à la maquette V3 validée en gate 2 : une colonne, du texte, le
 * contenant jamais mangeur du contenu.
 *
 * Lois gravées :
 * - IDENTITÉ STABLE : guid, à défaut le lien VALIDÉ — sans les deux, pas
 *   d'article (null) : la route ne bâtit jamais un id pour paraître riche ;
 * - LE CORPS V1 EST L'EXTRAIT ASSAINI : assez pour questionner, jamais
 *   assez pour remplacer l'article — dit tel quel (corpsComplet: false),
 *   le corps complet vient avec l'ingestion s2, dette jamais cachée ;
 * - PARAGRAPHES AUX FRONTIÈRES DE PHRASES : jamais coupé dans un mot, la
 *   réunion des paragraphes rejoint le texte (aux blancs pliés près) ;
 * - LE PARASITE EST PERDU, PAS L'ARTICLE : lien et image invalidés
 *   (javascript:, enveloppes vides, hôte bâté) tombent NET — l'article
 *   garde la vie, le parasite la perd ; la date absente est dite absente.
 */
import { validerUrl, type ItemFlux } from "./flux";
import { formerDate, formerHeure, minutesLecture } from "./une";

export interface ArticleModel {
  /** guid du flux, à défaut son lien validé — jamais un id bâti. */
  id: string;
  titre: string;
  marque: string;
  auteur: string | null;
  /** « lundi 23 novembre · 15h48 », ou l'absence dite honnêtement. */
  dateAffichee: string;
  lien: string | null;
  imageUrl: string | null;
  /** Le corps V1 : l'extrait assaini, découpé en paragraphes lisibles. */
  paragraphes: string[];
  lectureEstimee: number;
  /** Toujours false en V1 — la page le dit, jamais une dette cachée. */
  corpsComplet: false;
}

/** Longueur visée par paragraphe — assez pour respirer, jamais une brique. */
export const CIBLE_PARAGRAPHE = 280;

/** guid d'abord ; à défaut le lien VALIDÉ ; sinon pas d'identité (null). */
export function idStable(item: ItemFlux): string | null {
  if (item.guid && item.guid.trim()) return item.guid.trim();
  return item.lien ? validerUrl(item.lien) : null;
}

/**
 * Phrases groupées en paragraphes à la cible, jamais coupé dans un mot :
 * on coupe AUX frontières de phrases, la réunion rejoint le texte (aux
 * blancs pliés près). Texte nu → un seul paragraphe, jamais perdu.
 */
export function decouperParagraphes(
  texte: string | null | undefined,
  cible: number = CIBLE_PARAGRAPHE,
): string[] {
  if (!texte || !texte.trim()) return [];
  const phrases = texte.split(/(?<=[.!?…])\s+/).filter((p) => p.trim());
  if (phrases.length === 0) return [texte.trim()];
  const paragraphes: string[] = [];
  let courant: string[] = [];
  let longueur = 0;
  for (const p of phrases) {
    courant.push(p);
    longueur += p.length + 1;
    if (longueur >= cible) {
      paragraphes.push(courant.join(" "));
      courant = [];
      longueur = 0;
    }
  }
  if (courant.length > 0) paragraphes.push(courant.join(" "));
  return paragraphes;
}

/**
 * L'article affichable — ou null : sans identité stable, la route refuse
 * de mentir avec un id bâti. Le marque absent devient « source inconnue ».
 */
export function composerArticle(item: ItemFlux, marque?: string | null): ArticleModel | null {
  if (!item || !item.titre) return null;
  const id = idStable(item);
  if (!id) return null;
  return {
    id,
    titre: item.titre,
    marque: marque || "source inconnue",
    auteur: item.auteur ?? null,
    dateAffichee:
      item.publieLe instanceof Date
        ? `${formerDate(item.publieLe)} · ${formerHeure(item.publieLe)}`
        : "date inconnue — le flux n'a rien dit",
    lien: validerUrl(item.lien),
    imageUrl: validerUrl(item.imageUrl),
    paragraphes: decouperParagraphes(item.extrait),
    lectureEstimee: minutesLecture(item.extrait),
    corpsComplet: false,
  };
}
