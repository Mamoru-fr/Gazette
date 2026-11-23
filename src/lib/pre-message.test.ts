import { describe, expect, it } from "vitest";
import { buildPreMessage, assainir } from "./pre-message";

describe("assainir — l'entrée crue", () => {
  it("rabote le blanc de fabrication RSS", () => {
    expect(assainir("  Le \n JT  du\tmanoir ")).toBe("Le JT du manoir");
  });
  it("éjecte les NUL d'un contenu tiers", () => {
    expect(assainir("ti\u0000tre")).toBe("titre");
  });
});

describe("buildPreMessage — le pré-message (spec §6)", () => {
  const article = {
    id: "art_000001",
    titre: "La veille du manoir",
    source: "JT du Manoir Santos",
    publieLe: "2026-11-23",
    lien: "https://example.com/jt",
    extrait: "Le réveil de la maison, lisible au doigt.",
  };

  it("porte les six morceaux dans l'ordre", () => {
    expect(buildPreMessage(article)).toBe(
      [
        "La veille du manoir",
        "ID : art_000001",
        "Source : JT du Manoir Santos — publié le 2026-11-23",
        "Lien : https://example.com/jt",
        "Le réveil de la maison, lisible au doigt.",
        "L'utilisateur veut questionner cet article.",
      ].join("\n"),
    );
  });

  it("tronque l'extrait au plafond, avec l'ellipse", () => {
    const long = "a".repeat(300);
    const attendu = `${"a".repeat(200)}…`;
    expect(buildPreMessage({ ...article, extrait: long })).toContain(attendu);
  });

  it("REFUSE le titre vide (jamais de pré-message muet)", () => {
    expect(() => buildPreMessage({ ...article, titre: "   " })).toThrow(/titre vide/);
  });

  it("REFUSE l'id vide — l'ID stable est la raison d'être du pré-message", () => {
    expect(() => buildPreMessage({ ...article, id: "" })).toThrow(/id vide/);
  });

  it("omet la ligne d'extrait quand l'extrait est vide", () => {
    const lignes = buildPreMessage({ ...article, extrait: "" }).split("\n");
    expect(lignes.filter((l) => l === "Lien : https://example.com/jt")).toHaveLength(1);
    expect(lignes[lignes.length - 1]).toBe("L'utilisateur veut questionner cet article.");
  });
});
