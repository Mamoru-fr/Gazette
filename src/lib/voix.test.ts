import { describe, expect, it } from "vitest";
import {
  CIBLE_SEGMENT,
  bornerVitesse,
  choisirVoix,
  composerLecon,
  decouperSegments,
  etatSuivant,
} from "./voix";
import type { LeconArticle } from "./voix";

/**
 * Gazette — banc de la voix (tranche Écouter, rangée 23e). Prouvé au
 * banc jumeau AVANT push : rouge vu d'abord (la jonction tête/corps
 * cassait l'écoute — loi corrigée : chaque phrase GARANTIT sa
 * ponctuation), passe de sabotage vue (la découpe naïve coupe dans les
 * mots = rouge).
 */

const PHRASES = Array(9).fill("Une phrase de vingt-sept caractères.").join(" ");
const LONG = Array(300).fill("Phrase de longueur tout à fait raisonnable. ").join("");
const fold = (s: string) => s.replace(/\s+/g, " ").trim();

const lecon = (o: Partial<LeconArticle>): LeconArticle => ({
  titre: "Un titre",
  marque: "Le Monde",
  dateAffichee: "lundi 23 novembre · 15h48",
  paragraphes: ["Corps un.", "Corps deux."],
  ...o,
});

describe("decouperSegments — aux frontières de phrases", () => {
  it("texte nul ou blanc : aucun segment, jamais trois erreurs", () => {
    expect(decouperSegments(null)).toEqual([]);
    expect(decouperSegments("   ")).toEqual([]);
  });

  it("texte court : UN segment identique", () => {
    expect(decouperSegments("Un texte court. Voilà.")).toEqual(["Un texte court. Voilà."]);
  });

  it("texte sans ponctuation : UN segment entier, jamais perdu", () => {
    expect(decouperSegments("texte sans phrase nette")).toEqual(["texte sans phrase nette"]);
  });

  it("texte long : plusieurs segments, jamais coupé dans un mot", () => {
    const segs = decouperSegments(PHRASES);
    expect(segs.length).toBeGreaterThanOrEqual(2);
    for (const s of segs) expect(/[.!?:…]$/.test(s)).toBe(true);
  });

  it("la réunion des segments rejoint le texte (aux blancs pliés près)", () => {
    expect(fold(decouperSegments(PHRASES).join(" "))).toBe(fold(PHRASES));
  });

  it("corps très long : segmentation honnête à la cible maison", () => {
    expect(decouperSegments(LONG).length).toBeGreaterThanOrEqual(20);
    expect(CIBLE_SEGMENT).toBe(200);
  });
});

describe("bornerVitesse — bornée, jamais d'exception en pleine lecture", () => {
  it("NaN, undefined, texte : le DÉFAUT, pas un crash", () => {
    expect(bornerVitesse(Number.NaN)).toBe(1);
    expect(bornerVitesse(undefined)).toBe(1);
    expect(bornerVitesse("vite s'il te plaît")).toBe(1);
  });

  it("hors bornes : bornée aux deux bouts, pas rejetée", () => {
    expect(bornerVitesse(0.1)).toBe(0.5);
    expect(bornerVitesse(9)).toBe(2);
  });

  it("dans les bornes : la vitesse du lecteur reste la sienne", () => {
    expect(bornerVitesse(1.25)).toBe(1.25);
  });
});

describe("choisirVoix — locale, choisie, jamais au hasard", () => {
  it("la voix exacte de la langue gagne", () => {
    const v = choisirVoix([{ nom: "X", langue: "fr-FR" }, { nom: "Y", langue: "en-US" }], "fr-FR");
    expect(v!.nom).toBe("X");
  });

  it("à défaut : même langue à l'accent près — souligné ou tiret", () => {
    expect(choisirVoix(
      [{ nom: "Amelie", langue: "de-DE" }, { nom: "Audrey", langue: "fr_FR" }, { nom: "Thomas", langue: "fr-CA" }],
      "fr-FR",
    )!.nom).toBe("Audrey");
    expect(choisirVoix([{ nom: "T", langue: "fr-CA" }], "fr-FR")!.nom).toBe("T");
  });

  it("aucune voix de la langue : RIEN (null), jamais une voix au hasard", () => {
    expect(choisirVoix([{ nom: "Z", langue: "en-US" }], "fr-FR")).toBeNull();
    expect(choisirVoix([], "fr-FR")).toBeNull();
  });
});

describe("composerLecon — ce que l'oreille demande", () => {
  it("titre, source et date, corps — la ponctuation de phrase à chaque jonction", () => {
    expect(composerLecon(lecon({}))).toBe(
      "Un titre. Le Monde · lundi 23 novembre · 15h48. Corps un. Corps deux.",
    );
  });

  it("sans source ni corps : le titre seul, ponctué comme une phrase", () => {
    expect(composerLecon(lecon({ marque: "", dateAffichee: "", paragraphes: [] }))).toBe("Un titre.");
  });

  it("la date inconnue se dit comme elle s'écrit", () => {
    expect(composerLecon(lecon({ marque: "M", dateAffichee: "date inconnue — le flux n'a rien dit", paragraphes: [] })))
      .toBe("Un titre. M · date inconnue — le flux n'a rien dit.");
  });

  it("la phrase interrogative garde sa marque, jamais un point collé", () => {
    expect(composerLecon(lecon({ titre: "T ?", marque: "", dateAffichee: "", paragraphes: ["Pourquoi ?"] })))
      .toBe("T ? Pourquoi ?");
  });
});

describe("etatSuivant — l'état avance pas à pas", () => {
  it("un segment lu, on avance ; au dernier, c'est fini", () => {
    expect(etatSuivant({ position: 0, total: 3 })).toEqual({ position: 1, fini: false });
    expect(etatSuivant({ position: 2, total: 3 })).toEqual({ position: 3, fini: true });
  });

  it("position négative bornée à zéro ; file vide : fin honnête", () => {
    expect(etatSuivant({ position: -7, total: 2 })).toEqual({ position: 1, fini: false });
    expect(etatSuivant({ position: 4, total: 0 })).toEqual({ position: 5, fini: true });
  });
});
