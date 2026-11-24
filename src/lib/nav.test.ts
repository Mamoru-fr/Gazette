import { describe, expect, it } from "vitest";
import {
  MESSAGE_ARTICLE_MUET,
  VUES_NAV,
  estActive,
  retrouverVue,
} from "./nav";

/**
 * Gazette — banc de la navigation (rangée 28e).
 * Les lois testées vivent dans nav.ts : une seule table, l'inconnue
 * refusée net, la marque vit à la source, l'article muet tant que la
 * base est vierge. Prouvé au banc jumeau avant push : rouge vu
 * d'abord (module absent), passe de sabotage vue (estActive inversé).
 */

describe("VUES_NAV — une seule table pour les deux médias", () => {
  it("porte les quatre vues de la maquette V3, aux ids uniques", () => {
    expect(VUES_NAV.map((v) => v.id)).toEqual([
      "aujourdhui",
      "article",
      "informateur",
      "flux",
    ]);
  });
  it("dit ses labels mot pour mot — la maquette ne se réécrit pas", () => {
    expect(VUES_NAV.map((v) => v.label)).toEqual([
      "Aujourd'hui",
      "Article",
      "Informateur",
      "Vos flux",
    ]);
  });
});

describe("retrouverVue — l'inconnue est refusée net, jamais devinée", () => {
  it("trouve les vues par leur id", () => {
    expect(retrouverVue("aujourdhui")?.href).toBe("/");
    expect(retrouverVue("informateur")?.href).toBe("/informateur");
    expect(retrouverVue("flux")?.href).toBe("/connexion");
  });
  it("tolère les blancs autour de l'id", () => {
    expect(retrouverVue("  flux ")?.id).toBe("flux");
  });
  it("refuse l'inconnue, le vide, les blancs : null, jamais un choix par défaut", () => {
    expect(retrouverVue("presse")).toBeNull();
    expect(retrouverVue("")).toBeNull();
    expect(retrouverVue("   ")).toBeNull();
  });
});

describe("la vue Article — muette tant que la base est vierge", () => {
  it("href null : jamais un lien mort vers un 404", () => {
    expect(retrouverVue("article")?.href).toBeNull();
  });
  it("le message de mutisme est dit, pas caché", () => {
    expect(MESSAGE_ARTICLE_MUET).toContain("file");
    expect(MESSAGE_ARTICLE_MUET).toContain("vierge");
  });
});

describe("estActive — la marque vit à la source", () => {
  it("marque la vue courante, jamais une autre", () => {
    const flux = retrouverVue("flux");
    if (!flux) throw new Error("vue flux absente");
    expect(estActive(flux, "flux")).toBe(true);
    expect(estActive(flux, "informateur")).toBe(false);
  });
  it("courante absente = AUCUNE marque, jamais un défaut deviné", () => {
    const aujourdhui = retrouverVue("aujourdhui");
    if (!aujourdhui) throw new Error("vue aujourdhui absente");
    expect(estActive(aujourdhui, null)).toBe(false);
  });
  it("la Une est marquée depuis sa page", () => {
    const aujourdhui = retrouverVue("aujourdhui");
    if (!aujourdhui) throw new Error("vue aujourdhui absente");
    expect(estActive(aujourdhui, "aujourdhui")).toBe(true);
  });
});
