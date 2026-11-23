import { describe, expect, it } from "vitest";
import {
  composerUne,
  minutesLecture,
  formerHeure,
  formerDate,
  PLAFOND_FLUX_V1,
  type ArticleUne,
} from "./une";

/**
 * Gazette — banc de la vue Une (tranche UI 2, rangée 20e).
 * Les lois testées vivent dans une.ts : fraîcheur d'abord, mur de la
 * journée calendaire, absence-de-date n'est pas vieillesse, tuile de
 * secours typographique, compteur honnête. Prouvé au banc jumeau
 * avant push.
 */

const MAINTENANT = new Date("2026-11-23T12:15:00");
const HIER_SOIR = new Date("2026-11-22T19:02:00");
const CE_MATIN = new Date("2026-11-23T09:30:00");

const art = (a: Partial<ArticleUne>): ArticleUne => ({
  id: "id-banc",
  titre: "titre du banc",
  extrait: "extrait de quatre mots",
  marque: "Le Monde",
  imageUrl: null,
  publieLe: CE_MATIN,
  noteInformateur: null,
  ...a,
});

describe("composerUne — la file", () => {
  it("fraîcheur d'abord : tri décroissant par publication", () => {
    const une = composerUne(
      [art({ id: "a", titre: "ancien", publieLe: CE_MATIN }), art({ id: "b", titre: "récent", publieLe: new Date("2026-11-23T11:00:00") })],
      { maintenant: MAINTENANT, fluxConnectes: 7 },
    );
    expect(une.entrees.map((e) => e.id)).toEqual(["b", "a"]);
  });

  it("hier = un autre jour calendaire, jamais « plus de 24h »", () => {
    const une = composerUne(
      [art({ id: "a", titre: "hier soir", publieLe: HIER_SOIR }), art({ id: "b", titre: "ce matin", publieLe: CE_MATIN })],
      { maintenant: MAINTENANT, fluxConnectes: 7 },
    );
    expect(une.entrees.map((e) => e.id)).toEqual(["b"]);
    expect(une.hier.map((e) => e.id)).toEqual(["a"]);
    expect(une.hier[0]!.quand).toBe("hier");
  });

  it("le mur de la journée est calendaire : minuit cinq d'aujourd'hui reste dedans", () => {
    const minuitCinq = new Date("2026-11-23T00:05:00");
    const une = composerUne([art({ id: "a", titre: "minuit", publieLe: minuitCinq })], {
      maintenant: new Date("2026-11-23T23:50:00"),
      fluxConnectes: 1,
    });
    expect(une.entrees).toHaveLength(1);
    expect(une.hier).toHaveLength(0);
  });

  it("absence de date n'est pas vieillesse : reste dans la file d'aujourd'hui, en fin de file", () => {
    const une = composerUne(
      [art({ id: "a", titre: "sans date", publieLe: null }), art({ id: "b", titre: "daté", publieLe: CE_MATIN })],
      { maintenant: MAINTENANT, fluxConnectes: 0 },
    );
    expect(une.entrees.map((e) => e.id)).toEqual(["b", "a"]);
    expect(une.entrees[1]!.quand).toBe("à l'instant");
  });

  it("la première d'aujourd'hui, SEULE, est grande et porte le kicker", () => {
    const une = composerUne(
      [art({ id: "a" }), art({ id: "b", titre: "deuxième" })],
      { maintenant: MAINTENANT, fluxConnectes: 3 },
    );
    expect(une.entrees[0]!.grande).toBe(true);
    expect(une.entrees[0]!.kicker).toBe("À la une, aujourd'hui");
    expect(une.entrees[1]!.grande).toBe(false);
    expect(une.entrees[1]!.kicker).toBeNull();
  });

  it("tuile de secours typographique : marque rendue, jamais d'image de remplacement", () => {
    const une = composerUne([art({ id: "a", marque: "CNRS Le Journal", imageUrl: null })], {
      maintenant: MAINTENANT,
      fluxConnectes: 1,
    });
    expect(une.entrees[0]!.imageUrl).toBeNull();
    expect(une.entrees[0]!.marque).toBe("CNRS Le Journal");
  });

  it("marque absente -> « source inconnue », dit tel quel", () => {
    const une = composerUne([art({ id: "a", marque: null })], {
      maintenant: MAINTENANT,
      fluxConnectes: 1,
    });
    expect(une.entrees[0]!.marque).toBe("source inconnue");
  });

  it("note de l'informateur conservée, absence -> null", () => {
    const une = composerUne(
      [art({ id: "a", noteInformateur: "retenu pour sa méthode." }), art({ id: "b", titre: "sans note" })],
      { maintenant: MAINTENANT, fluxConnectes: 2 },
    );
    expect(une.entrees[0]!.note).toBe("retenu pour sa méthode.");
    expect(une.entrees[1]!.note).toBeNull();
  });
});

describe("composerUne — l'accroche honnête", () => {
  it("compte les textes d'aujourd'hui, pluriel tenu", () => {
    const une = composerUne([art({ id: "a" }), art({ id: "b", titre: "2" })], {
      maintenant: MAINTENANT,
      fluxConnectes: 7,
    });
    expect(une.accroche).toBe("Bonjour. Il y a 2 textes qui vous attendent.");
  });

  it("UN texte d'aujourd'hui : singulier tenu", () => {
    const une = composerUne([art({ id: "a" })], { maintenant: MAINTENANT, fluxConnectes: 1 });
    expect(une.accroche).toBe("Bonjour. Il y a un texte qui vous attend.");
  });

  it("file vide : calme, jamais un simulacre", () => {
    const une = composerUne([], { maintenant: MAINTENANT, fluxConnectes: 0 });
    expect(une.accroche).toBe("Bonjour. La file est calme — rien n'arrive que ce qui est vrai.");
    expect(une.pause).toBeNull();
    expect(une.entrees).toHaveLength(0);
  });

  it("compteur honnête au plafond V1, jamais une limite d'architecture", () => {
    const une = composerUne([], { maintenant: MAINTENANT, fluxConnectes: 7 });
    expect(une.compteur).toBe(`7 / ${PLAFOND_FLUX_V1}`);
    expect(une.sousAccroche).toContain("plafond V1 : 50, jamais une limite d'architecture");
  });
});

describe("les formateurs", () => {
  it("heure du journal, jamais un ISO", () => {
    expect(formerHeure(new Date("2026-11-23T15:48:00"))).toBe("15h48");
  });

  it("date en français", () => {
    expect(formerDate(new Date("2026-11-23T12:00:00"))).toBe("lundi 23 novembre");
  });

  it("minutesLecture : ~200 mots/min, jamais ZÉRO pour un texte", () => {
    expect(minutesLecture(null)).toBe(0);
    expect(minutesLecture("un deux trois")).toBe(1);
    expect(minutesLecture(Array(401).fill("mot").join(" "))).toBe(3);
  });
});
