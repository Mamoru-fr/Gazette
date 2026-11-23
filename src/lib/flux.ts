/**
 * Gazette — modèle pur du branchement data, session 1 : le parsing RSS/Atom
 * (rangée 21e, la désignée du témoin de la rangée 20e).
 *
 * Choix d'implémentation consigné honnêtement : ZÉRO nouvelle dépendance au
 * banc. La stack validée nomme fast-xml-parser en route API — la maison ne
 * code JAMAIS sur une API non vérifiée (leçon gravée, Plume 70815b7), et npm
 * est muet au banc ; le connecteur viendra derrière la gate de dépendances
 * (Brunel, lockfile) et remplacera les intestins, JAMAIS ce contrat.
 *
 * Lois gravées (engagements §2 bis, la prérogative sécurité du client) :
 * - ASSAINIR AVANT TOUT : le titre, l'extrait et l'auteur d'un flux tiers ne
 *   portent JAMAIS de balise ni d'entité — on DÉCODE les entités d'abord,
 *   puis on jette les balises révélées (l'ordre inverse laisserait vivre
 *   un <script> encodé) ; texte nu, nu ;
 * - URL VALIDÉES : seuls http et https avec un hôte sans blanc ni @ passent —
 *   javascript:, data:, les enveloppes vides et les neutralisations d'hôte
 *   sont refusées NETES (l'item garde la vie, l'URL parasite la perd) ;
 * - TITRE OBLIGATOIRE : le schéma exige un titre — un item muet est IGNORÉ
 *   ET COMPTÉ, jamais une perte silencieuse ;
 * - GUID DE SECOURS : guid/id, à défaut le lien — le pré-message réclame
 *   une identité stable ;
 * - ABSENCE DE DATE n'est pas un crash : null, la file douce sait déjà
 *   l'accueillir (loi de la Une) ;
 * - L'ORDRE DU DOCUMENT EST SACRÉ : la file du flux est lue dans l'ordre
 *   où le flux la donne — le tri appartient à la Une, pas au parsing.
 */

export interface ItemFlux {
  guid: string | null;
  titre: string;
  auteur: string | null;
  lien: string | null;
  extrait: string | null;
  imageUrl: string | null;
  publieLe: Date | null;
}

export type FormatFlux = "rss" | "atom" | null;

export interface ResultatAnalyse {
  ok: boolean;
  /** Erreur lisible, dite honnêtement — jamais un verdict muet. */
  erreur: string | null;
  format: FormatFlux;
  items: ItemFlux[];
  /** Items sans titre exploitable — ignorés ET comptés, jamais une perte silencieuse. */
  ignores: number;
}

/** L'extrait servi par la file : assez pour questionner, jamais assez pour remplacer l'article. */
export const LIMITE_EXTRAIT = 800;

const decoderEntites = (s: string): string =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_t: string, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_t: string, d: string) => {
      const n = parseInt(d, 10);
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
    })
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

/**
 * ASSAINIR AVANT TOUT : CDATA déshabordée, entités décodées, balises
 * révélées jetées, blancs pliés. Limite dite honnêtement : deux mots que
 * le flux sépare par une balise sans espace se retrouvent collés — on
 * préfère un texte sobre à un HTML qui traîne.
 */
export function assainirTexte(brut: string): string {
  let s = brut;
  const cdata = s.indexOf("<![CDATA[");
  if (cdata !== -1) {
    const fin = s.indexOf("]]>", cdata);
    s = fin !== -1 ? s.slice(cdata + 9, fin) : s.slice(cdata + 9);
  }
  s = decoderEntites(s);
  s = s.replace(/<[^>]*>/g, "");
  return s.replace(/\s+/g, " ").trim();
}

/**
 * http/https avec un hôte sans blanc ni @, sinon REFUS NET (null) —
 * jamais de javascript:, jamais de data:, jamais d'hôte vide.
 * Un hôte sans point reste légitime (localhost, LAN privée).
 */
export function validerUrl(u: string | null | undefined): string | null {
  if (!u) return null;
  const t = u.trim();
  if (!/^https?:\/\//i.test(t)) return null;
  const apresProtocole = t.slice(t.indexOf("://") + 3);
  const finHote = apresProtocole.search(/[\/?#]/);
  const hote = finHote === -1 ? apresProtocole : apresProtocole.slice(0, finHote);
  if (!hote || /\s/.test(hote) || hote.includes("@")) return null;
  return t;
}

/** Absence ou illisibilité n'est pas un crash : null, la file douce sait l'accueillir. */
export function lireDate(brut: string | null | undefined): Date | null {
  if (!brut) return null;
  const t = assainirTexte(brut);
  if (!t) return null;
  const d = new Date(t);
  return isNaN(d.getTime()) ? null : d;
}

/** Coupe au mot entier, ellipses honnêtes, la limite jamais dépassée. */
export function bornerExtrait(t: string | null): string | null {
  if (!t) return null;
  if (t.length <= LIMITE_EXTRAIT) return t;
  const coupe = t.slice(0, LIMITE_EXTRAIT);
  const espace = coupe.lastIndexOf(" ");
  const base = espace > LIMITE_EXTRAIT * 0.6 ? coupe.slice(0, espace) : coupe;
  return base.trimEnd() + "…";
}

const champTexte = (bloc: string, tag: string): string | null => {
  const re = new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + tag + "\\s*>", "i");
  const m = re.exec(bloc);
  return m ? (m[1] ?? null) : null;
};

const attribut = (bloc: string, tag: string, attr: string): string | null => {
  const re = new RegExp("<" + tag + "\\b[^>]*\\b" + attr + "\\s*=\\s*[\"']([^\"']*)[\"'][^>]*>", "i");
  const m = re.exec(bloc);
  return m ? (m[1] ?? null) : null;
};

const lienAtom = (bloc: string): string | null => {
  const re = /<link\b[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi;
  let premier: string | null = null;
  let alterne: string | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(bloc)) !== null) {
    const balise = m[0];
    if (alterne === null && /rel\s*=\s*["']alternate["']/i.test(balise)) alterne = m[1] ?? null;
    if (premier === null && !/rel\s*=\s*["']/i.test(balise)) premier = m[1] ?? null;
  }
  return alterne ?? premier;
};

const imageDe = (bloc: string): string | null => {
  const reEnc = /<enclosure\b[^>]*url\s*=\s*["']([^"']*)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = reEnc.exec(bloc)) !== null) {
    if (/type\s*=\s*["']image\//i.test(m[0])) return m[1] ?? null;
  }
  for (const tag of ["media:content", "media:thumbnail"]) {
    const u = attribut(bloc, tag, "url");
    if (u) return u;
  }
  const reLien = /<link\b[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi;
  while ((m = reLien.exec(bloc)) !== null) {
    if (/rel\s*=\s*["']enclosure["']/i.test(m[0]) && /type\s*=\s*["']image\//i.test(m[0])) return m[1] ?? null;
  }
  return null;
};

const auteurAtom = (bloc: string): string | null => {
  const b = /<author\b[^>]*>([\s\S]*?)<\/author\s*>/i.exec(bloc);
  if (!b) return null;
  return champTexte(b[1] ?? "", "name");
};

/**
 * Le parsing d'un corps de flux entier, RSS 2.0 ou Atom — lecture lexicale
 * en ordre de document, sans DOM (le contenu tiers ne devient JAMAIS une
 * structure de code : il devient du texte assaini, point).
 */
export function analyserFlux(xml: string): ResultatAnalyse {
  if (!xml || !xml.trim()) {
    return { ok: false, erreur: "corps de flux vide", format: null, items: [], ignores: 0 };
  }
  const estRss = /<rss\b/i.test(xml);
  const estAtom = /<feed\b/i.test(xml);
  if (!estRss && !estAtom) {
    return { ok: false, erreur: "format de flux inconnu (RSS 2.0 ou Atom attendus)", format: null, items: [], ignores: 0 };
  }
  const format: "rss" | "atom" = estRss ? "rss" : "atom";
  const tagItem = estRss ? "item" : "entry";

  const debuts: number[] = [];
  const reDebut = new RegExp("<" + tagItem + "\\b[^>]*>", "gi");
  let m: RegExpExecArray | null;
  while ((m = reDebut.exec(xml)) !== null) debuts.push(m.index + m[0].length);

  const fins: number[] = [];
  const reFin = new RegExp("</" + tagItem + "\\s*>", "gi");
  while ((m = reFin.exec(xml)) !== null) fins.push(m.index);

  const items: ItemFlux[] = [];
  let ignores = 0;
  let j = 0;
  for (const debut of debuts) {
    while (j < fins.length && (fins[j] ?? 0) < debut) j++;
    const fin = j < fins.length ? (fins[j] ?? xml.length) : xml.length;
    const bloc = xml.slice(debut, fin);

    const titre = assainirTexte(champTexte(bloc, "title") ?? "");
    if (!titre) { ignores++; continue; }

    const lienBrut = estRss ? champTexte(bloc, "link") : lienAtom(bloc);
    const lien = validerUrl(lienBrut);
    const guid = assainirTexte(champTexte(bloc, estRss ? "guid" : "id") ?? "") || lien;
    const auteur = assainirTexte(estRss ? (champTexte(bloc, "dc:creator") ?? champTexte(bloc, "author") ?? "") : (auteurAtom(bloc) ?? "")) || null;
    const dateBrut = estRss ? champTexte(bloc, "pubDate") : (champTexte(bloc, "published") ?? champTexte(bloc, "updated"));
    const extraitBrut = estRss
      ? (champTexte(bloc, "description") ?? champTexte(bloc, "content:encoded"))
      : (champTexte(bloc, "summary") ?? champTexte(bloc, "content"));

    items.push({
      guid,
      titre,
      auteur,
      lien,
      extrait: bornerExtrait(assainirTexte(extraitBrut ?? "")),
      imageUrl: validerUrl(imageDe(bloc)),
      publieLe: lireDate(dateBrut),
    });
  }

  return { ok: true, erreur: null, format, items, ignores };
}
