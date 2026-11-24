/**
 * Gazette — modèle pur de la section Informateur (tranche UI, rangée 27e).
 * Fidèle à la maquette V3 validée en gate 2 : « Informateur : le briefing
 * du jour, en lettre » — une lettre unique, le reste en pièces.
 *
 * Lois gravées :
 * - UNE SEULE VÉRITÉ DE SIGNATURE : les pages de l'informateur sont les
 *   mêmes que la table article (stack §3, flux_id NULL) — jamais un type
 *   parallèle qui mentirait sur la base ;
 * - LA LETTRE EST LA PLUS FRAÎCHE : tri décroissant par publication, la
 *   lettre est la première de file, le reste en pièces ;
 * - ABSENCE DE DATE n'est pas VIEILLESSE : une page sans publieLe reste
 *   en fin de file, « à l'instant » (loi héritée de la Une) ;
 * - LA FILE VIDE EST DITE TELLELE : quand rien n'est signé, l'accroche
 *   dit l'absence — jamais une lettre de démonstration, jamais un
 *   simulacre (décret du client) ;
 * - LE CORPS EST L'EXTRAIT ASSAINI : découpé aux frontières de phrases
 *   (CIBLE 280, jamais coupé dans un mot), et la dette est dite —
 *   corpsComplet: false, le corps complet vient avec l'ingestion s2.
 */
import { decouperParagraphes } from "./article";
import { formerDate, formerHeure, minutesLecture } from "./une";

export interface PageInformateur {
  id: string;
  titre: string;
  extrait?: string | null;
  publieLe?: Date | null;
}

export interface PieceInformateur {
  id: string;
  titre: string;
  quand: string;
  lectureEstimee: number;
}

export interface LettreInformateur {
  id: string;
  titre: string;
  paragraphes: string[];
  quand: string;
  lectureEstimee: number;
  signature: string;
}

export interface InformateurModel {
  lettre: LettreInformateur | null;
  /** Dite seulement quand la file est vide — l'absence honnête. */
  lettreAbsente: string | null;
  accroche: string;
  pieces: PieceInformateur[];
  compteur: string;
  /** Le jour de la requête, en français — jamais le jour du build. */
  dateLettre: string;
  /** Toujours false en V1 — dette ingestion s2, jamais cachée. */
  corpsComplet: false;
}

export interface OptionsInformateur {
  maintenant: Date;
}

export const ACCROCHE_ABSENCE = "L'informateur n'a pas encore posé sa lettre.";
export const SIGNATURE_INFORMATEUR = "— L'informateur du Manoir";

export function composerInformateur(
  pages: PageInformateur[],
  options: OptionsInformateur,
): InformateurModel {
  const avecDate = pages.filter((x) => x.publieLe instanceof Date);
  const sansDate = pages.filter((x) => !(x.publieLe instanceof Date));

  // Tri : fraîcheur d'abord ; même instant = ordre d'arrivée stable.
  avecDate.sort((a, b) => b.publieLe!.getTime() - a.publieLe!.getTime());
  const file = [...avecDate, ...sansDate];

  const premiere = file[0] ?? null;
  const nbSignees = pages.length;

  const accroche =
    nbSignees === 0
      ? ACCROCHE_ABSENCE
      : nbSignees === 1
        ? "Il y a une page signée."
        : nbSignees + " pages signées.";

  const lettre: LettreInformateur | null = premiere
    ? {
        id: premiere.id,
        titre: premiere.titre,
        paragraphes: decouperParagraphes(premiere.extrait),
        quand: premiere.publieLe instanceof Date ? formerHeure(premiere.publieLe) : "à l'instant",
        lectureEstimee: minutesLecture(premiere.extrait),
        signature: SIGNATURE_INFORMATEUR,
      }
    : null;

  const pieces: PieceInformateur[] = file.slice(1).map((x) => ({
    id: x.id,
    titre: x.titre,
    quand: x.publieLe instanceof Date ? formerHeure(x.publieLe) : "à l'instant",
    lectureEstimee: minutesLecture(x.extrait),
  }));

  const compteur =
    nbSignees === 0 ? "aucune page signée" : nbSignees === 1 ? "une page signée" : nbSignees + " pages signées";

  return {
    lettre,
    lettreAbsente: lettre === null ? ACCROCHE_ABSENCE : null,
    accroche,
    pieces,
    compteur,
    dateLettre: formerDate(options.maintenant),
    corpsComplet: false,
  };
}
