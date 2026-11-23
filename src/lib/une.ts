/**
 * Gazette — modèle pur de la vue Une (tranche UI 2, rangée 20e).
 * Fidèle à la maquette V3 validée (gate 2) : file douce d'aujourd'hui,
 * hier plié derrière un geste volontaire, tuile de secours typographique
 * quand le flux est muet, compteur honnête, jamais d'émoji.
 *
 * Lois gravées :
 * - LA FILE EST UNE FRAÎCHEUR : tri décroissant par publication ;
 * - ABSENCE DE DATE n'est pas VIEILLESSE : un article sans publieLe
 *   reste dans la file d'aujourd'hui (remisé en hier = mentir sur lui) ;
 * - LE MUR DE LA JOURNÉE EST CALENDAIRE ET LOCAL : hier = un autre
 *   jour que celui de « maintenant », jamais « plus de 24h » ;
 * - LA TUILE DE SECOURS EST TYPOGRAPHIQUE : marque du flux, jamais
 *   d'image de remplacement, jamais d'émoji (décret icônes du client).
 */

export interface ArticleUne {
  id: string;
  titre: string;
  extrait?: string | null;
  /** Le nom du flux (source) : méta et tuile de secours. */
  marque?: string | null;
  /** null/absent = tuile de secours typographique (flux muet). */
  imageUrl?: string | null;
  publieLe?: Date | null;
  /** Note de l'informateur (« retenu parce que… ») — affichée si présente. */
  noteInformateur?: string | null;
}

export interface EntreeUne {
  id: string;
  titre: string;
  extrait: string | null;
  marque: string;
  imageUrl: string | null;
  note: string | null;
  /** "15h48" pour aujourd'hui, "hier" pour la file d'hier. */
  quand: string;
  /** La première d'aujourd'hui, seule, est grande. */
  grande: boolean;
  /** Kicker réservé à l'entrée grande. */
  kicker: string | null;
}

export interface UneModel {
  accroche: string;
  sousAccroche: string;
  entrees: EntreeUne[];
  hier: EntreeUne[];
  compteur: string;
  lectureEstimee: number;
  /** Le repos de la file d'aujourd'hui, après la dernière entrée. */
  pause: string | null;
}

export interface OptionsUne {
  maintenant: Date;
  /** Flux actifs, pour le compteur honnête X / 50. */
  fluxConnectes: number;
}

/** Plafond V1 : affiché honnêtement, jamais une limite d'architecture. */
export const PLAFOND_FLUX_V1 = 50;

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"] as const;
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"] as const;

const jourCalendaire = (d: Date): string =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** "15h48" — l'heure du journal, jamais un ISO. */
export function formerHeure(d: Date): string {
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}h${m}`;
}

/** "lundi 23 novembre" — la langue de la maison. */
export function formerDate(d: Date): string {
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

/** Estimation de lecture : ~200 mots à la minute, arrondie au-dessus. */
export function minutesLecture(extrait: string | null | undefined): number {
  if (!extrait) return 0;
  const mots = extrait.trim().split(/\s+/).filter(Boolean).length;
  return mots === 0 ? 0 : Math.max(1, Math.ceil(mots / 200));
}

function enEntree(a: ArticleUne, grande: boolean, hier: boolean): EntreeUne {
  return {
    id: a.id,
    titre: a.titre,
    extrait: a.extrait ?? null,
    marque: a.marque ?? "source inconnue",
    imageUrl: a.imageUrl ?? null,
    note: a.noteInformateur ?? null,
    quand: hier ? "hier" : a.publieLe ? formerHeure(a.publieLe) : "à l'instant",
    grande,
    kicker: grande ? "À la une, aujourd'hui" : null,
  };
}

export function composerUne(articles: ArticleUne[], options: OptionsUne): UneModel {
  const jourDeReference = jourCalendaire(options.maintenant);

  const avecDate = articles.filter((a) => a.publieLe instanceof Date);
  const sansDate = articles.filter((a) => !(a.publieLe instanceof Date));

  // Tri : fraîcheur d'abord, les plus récents en tête ; même instant = ordre d'arrivée stable.
  avecDate.sort((a, b) => b.publieLe!.getTime() - a.publieLe!.getTime());

  const aujourdhui: ArticleUne[] = [];
  const hier: ArticleUne[] = [];
  for (const a of avecDate) {
    (jourCalendaire(a.publieLe!) === jourDeReference ? aujourdhui : hier).push(a);
  }
  // Absence de date n'est pas vieillesse : la file d'aujourd'hui les garde, en fin de file.
  aujourdhui.push(...sansDate);

  const premiere = aujourdhui[0];
  const entrees = aujourdhui.map((a, i) => enEntree(a, i === 0 && !!premiere, false));
  const entreesHier = hier.map((a) => enEntree(a, false, true));

  const texteAujourdhui = entrees.length - sansDate.length;
  const attente =
    texteAujourdhui === 1
      ? "un texte qui vous attend"
      : `${texteAujourdhui} textes qui vous attendent`;
  const accroche =
    texteAujourdhui === 0
      ? aujourdhui.length === 0
        ? "Bonjour. La file est calme — rien n'arrive que ce qui est vrai."
        : "Bonjour. Des textes sans horodatage vous attendent."
      : `Bonjour. Il y a ${attente}.`;

  const lectureEstimee = aujourdhui.reduce(
    (total, a) => total + minutesLecture(a.extrait),
    0,
  );

  const minute = lectureEstimee === 1 ? "minute" : "minutes";
  const fluxNomme = options.fluxConnectes === 1 ? "flux connecté" : "flux connectés";

  return {
    accroche,
    sousAccroche: `${formerDate(options.maintenant)} · ${options.fluxConnectes} ${fluxNomme} (plafond V1 : ${PLAFOND_FLUX_V1}, jamais une limite d'architecture) · lecture estimée : ${lectureEstimee} ${minute}`,
    entrees,
    hier: entreesHier,
    compteur: `${options.fluxConnectes} / ${PLAFOND_FLUX_V1}`,
    lectureEstimee,
    pause: texteAujourdhui > 0 || sansDate.length > 0
      ? "— c'est tout pour aujourd'hui. Le reste dort sans honte —"
      : null,
  };
}
