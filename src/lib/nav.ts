/**
 * Gazette — le modèle pur de la navigation (rangée 28e, maquette V3 :
 * quatre vues, rail desktop / barre basse mobile).
 * Une seule vérité : cette table. Les pages déclarent leur vue
 * courante ; l'inconnue est REFUSÉE net (null), jamais devinée.
 * Le lien « Article » est MUET tant que la base est vierge : un article
 * s'ouvre depuis la file, jamais un lien mort qui mentirait sur un 404.
 */
export type EntreeNav = { id: string; label: string; href: string | null };

export const VUES_NAV: EntreeNav[] = [
  { id: "aujourdhui", label: "Aujourd'hui", href: "/" },
  { id: "article",   label: "Article",      href: null },
  { id: "informateur", label: "Informateur", href: "/informateur" },
  { id: "flux",      label: "Vos flux",     href: "/connexion" },
];

export const MESSAGE_ARTICLE_MUET =
  "un article s'ouvre depuis la file : la base est encore vierge, ce lien ne mentirait pas";

export function retrouverVue(id: string): EntreeNav | null {
  const v = VUES_NAV.find((x) => x.id === id.trim());
  return v ?? null;
}

export function estActive(vue: EntreeNav, courante: string | null): boolean {
  return courante !== null && vue.id === courante;
}
