import { describe, expect, it } from "vitest";
import {
  CIBLE_PARAGRAPHE,
  composerArticle,
  decouperParagraphes,
  idStable,
} from "./article";
import type { ItemFlux } from "./flux";

/**
 * Gazette — banc de la vue article (tranche UI 3, rangée 22e).
 * Les lois testées vivent dans article.ts : identité stable jamais bâtie,
 * paragraphes aux frontières de phrases, corps V1 dit tel quel, parasites
 * perdus nets. Prouvé au banc jumeau avant push (21/21, rouge vu d'abord).
 */

const PHRASES = Array(9).fill("Une phrase de vingt-sept caractères.").join(" ");
const CORPS_LONG = Array(120)
  .fill("Phrase de longueur tout à fait raisonnable pour le banc. ")
  .join("");
const fold = (s: string) => s.replace(/\s+/g, " ").trim();

const item = (o: Partial<ItemFlux>): ItemFlux => ({
  guid: "g-1",
  titre: "titre du banc",
  auteur: null,
  lien: null,
  extrait: null,
  imageUrl: null,
  publieLe: null,
  ...o,
});

describe("decouperParagraphes — aux frontières de phrases", () => {
  it("texte nul ou blanc : aucun paragraphe, jamais trois erreurs", () => {
    expect(decouperParagraphes(null)).toEqual([]);
    expect(decouperParagraphes("   ")).toEqual([]);
  });

  it("texte court : UN paragraphe identique", () => {
    expect(decouperParagraphes("Un texte court. Voilà.")).toEqual(["Un texte court. Voilà."]);
  });

  it("texte sans ponctuation : UN paragraphe entier, jamais perdu", () => {
    expect(decouperParagraphes("texte sans phrase nette")).toEqual(["texte sans phrase nette"]);
  });

  it("l'extrait complet donne plusieurs paragraphes à la cible maison, jamais coupé dans un mot", () => {
    const ps = decouperParagraphes(PHRASES);
    expect(ps.length).toBeGreaterThanOrEqual(2);
    for (const p of ps) expect(/[.!?…]$/.test(p)).toBe(true);
  });

  it("la réunion des paragraphes rejoint le texte (aux blancs pliés près)", () => {
    expect(fold(decouperParagraphes(PHRASES).join(" "))).toBe(fold(PHRASES));
    expect(fold(decouperParagraphes(CORPS_LONG).join(" "))).toBe(fold(CORPS_LONG));
  });

  it("corps long : paragraphes à la cible, honnête à l'échelle de l'extrait borné", () => {
    expect(decouperParagraphes(CORPS_LONG).length).toBeGreaterThanOrEqual(20);
    expect(CIBLE_PARAGRAPHE).toBe(280);
  });
});

describe("idStable — l'identité jamais bâtie", () => {
  it("guid d'abord, même quand un lien existe", () => {
    expect(idStable(item({ guid: "g-1", lien: "https://x.example/a" }))).toBe("g-1");
  });

  it("guid vide : le lien VALIDÉ sert d'identité", () => {
    expect(idStable(item({ guid: "", lien: "https://x.example/a" }))).toBe("https://x.example/a");
  });

  it("guid absent ET lien parasite : pas d'identité (null), jamais un id bâti", () => {
    expect(idStable(item({ guid: null, lien: "javascript:alert(1)" }))).toBeNull();
  });
});

describe("composerArticle — la composition honnête", () => {
  const art = composerArticle(
    item({
      publieLe: new Date("2026-11-23T15:48:00"),
      extrait: PHRASES,
      auteur: "Une plume",
      lien: "https://x.example/a",
      imageUrl: "http://h.example/i.png",
    }),
    "Le Monde",
  )!;

  it("date affichée en langue maison", () => {
    expect(art.dateAffichee).toBe("lundi 23 novembre · 15h48");
  });

  it("auteur conservé ; absent : null dit null", () => {
    expect(art.auteur).toBe("Une plume");
    expect(composerArticle(item({ titre: "T" }), "M")!.auteur).toBeNull();
  });

  it("corps V1 : l'extrait découpé, jamais complet — dit tel quel", () => {
    expect(art.corpsComplet).toBe(false);
    expect(art.paragraphes.length).toBeGreaterThanOrEqual(2);
  });

  it("lien parasite PERDU, l'article garde la vie (guid présent)", () => {
    expect(composerArticle(item({ guid: "g-x", lien: "javascript:x" }), "M")!.lien).toBeNull();
  });

  it("sans identité validée : null, jamais un simulacre", () => {
    expect(composerArticle(item({ guid: "", lien: null }), "M")).toBeNull();
    expect(composerArticle(item({ guid: "", lien: "javascript:x" }), "M")).toBeNull();
  });

  it("imageUrl validée http garde la vie, javascript: la perd", () => {
    expect(art.imageUrl).toBe("http://h.example/i.png");
    expect(composerArticle(item({ imageUrl: "javascript:x" }), "M")!.imageUrl).toBeNull();
  });

  it("sans titre : null", () => {
    expect(composerArticle({ guid: "g", titre: "", lien: null, auteur: null, extrait: null, imageUrl: null, publieLe: null }, "M")).toBeNull();
  });

  it("marque absente : « source inconnue »", () => {
    expect(composerArticle(item({ titre: "T" }), "")!.marque).toBe("source inconnue");
  });

  it("date absente : dite honnêtement, jamais inventée", () => {
    expect(composerArticle(item({ titre: "T" }), "M")!.dateAffichee).toBe("date inconnue — le flux n'a rien dit");
  });

  it("lecture estimée : ceil(mots/200), jamais zéro pour un texte", () => {
    expect(composerArticle(item({ titre: "T", extrait: "un deux trois" }), "M")!.lectureEstimee).toBe(1);
    expect(composerArticle(item({ titre: "T" }), "M")!.lectureEstimee).toBe(0);
  });

  it("corps nul : aucun paragraphe — la page le dira", () => {
    expect(composerArticle(item({ titre: "T" }), "M")!.paragraphes).toEqual([]);
  });
});
