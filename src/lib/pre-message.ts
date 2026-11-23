/**
 * Gazette — modèle pur du pré-message (spec §6).
 *
 * Le pré-message porte : titre, ID en base, source et date, lien, les premiers
 * caractères de l'extrait — et se clôt par « L'utilisateur veut questionner
 * cet article ». Modèle pur : aucune I/O, testable au banc.
 *
 * Motif Hopper « l'entrée crue » : le contenu RSS est un INTRANT NON FIABLE.
 * Tout champ passe par `assainir` avant d'entrer dans le message — le pré-message
 * copié au presse-papier est du TEXTE, jamais du HTML, donc rien n'y est rendu
 * en brut (engagement §2 bis n°3).
 */

export const CLOTURE_PRE_MESSAGE = "L'utilisateur veut questionner cet article.";
export const EXTRAIT_MAX_DEFAUT = 200;

/** Un article tel qu'il vit en base — les champs requis du pré-message. */
export interface PreMessageArticle {
  /** ID stable en base (il alimente le pré-message). */
  id: string;
  titre: string;
  /** Source = titre du flux ; auteur « Informateur » pour les pages maison. */
  source: string;
  /** ISO 8601. */
  publieLe: string;
  lien: string;
  extrait: string;
}

/** Assainit un champ tiers : NUL et zéros impossibles, blancs rabotés. */
export function assainir(texte: string): string {
  // eslint-disable-next-line no-control-regex
  return texte.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Construit le pré-message. Jette sur un titre ou une source vide :
 * mieux vaut un refus net qu'un pré-message muet sur son article.
 */
export function buildPreMessage(
  article: PreMessageArticle,
  extraitMax: number = EXTRAIT_MAX_DEFAUT,
): string {
  const titre = assainir(article.titre);
  const source = assainir(article.source);
  const lien = assainir(article.lien);
  const extrait = assainir(article.extrait);
  const id = assainir(article.id);

  if (titre === "") throw new Error("buildPreMessage: titre vide — REFUS");
  if (source === "") throw new Error("buildPreMessage: source vide — REFUS");
  if (id === "") throw new Error("buildPreMessage: id vide — REFUS");

  const extraitTronque =
    extrait.length > extraitMax
      ? `${extrait.slice(0, extraitMax).trimEnd()}…`
      : extrait;

  return [
    `${titre}`,
    `ID : ${id}`,
    `Source : ${source} — publié le ${article.publieLe}`,
    `Lien : ${lien}`,
    extraitTronque === "" ? "" : extraitTronque,
    CLOTURE_PRE_MESSAGE,
  ]
    .filter((ligne) => ligne !== "")
    .join("\n");
}
