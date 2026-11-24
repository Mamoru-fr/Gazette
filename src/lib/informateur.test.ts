/**
 * Gazette — tests du modèle Informateur (tranche UI, rangée 27e).
 * Miroir exact du banc jumeau (joué AVANT push, 15/15 verts, rouge vu
 * d'abord sur module absent) : les mêmes épreuves vivent ici dans la
 * gate — jamais une assertion qui ne tourne qu'ailleurs.
 */
import { describe, expect, it } from "vitest";
import { composerInformateur, ACCROCHE_ABSENCE, SIGNATURE_INFORMATEUR } from "./informateur";

const maintenant = new Date(2026, 10, 24, 18, 5); // mardi 24 novembre 2026
const options = { maintenant };
const p = (id: string, titre: string, extrait: string | undefined, publieLe?: Date) =>
  ({ id, titre, extrait, publieLe }) as const;

describe("composerInformateur", () => {
  it("la lettre est la page la plus récente", () => {
    const m = composerInformateur([
      p("a", "Vieux texte", "Il fut un temps.", new Date(2026, 10, 20, 9, 0)),
      p("b", "Texte du jour", "Voici le briefing.", new Date(2026, 10, 24, 15, 48)),
      p("c", "Avant-hier", "Encore ceci.", new Date(2026, 10, 22, 11, 0)),
    ], options);
    expect(m.lettre).not.toBeNull();
    expect(m.lettre!.id).toBe("b");
  });

  it("les pièces sont triées en ordre décroissant, sans la lettre", () => {
    const m = composerInformateur([
      p("a", "Vieux texte", "Il fut un temps.", new Date(2026, 10, 20, 9, 0)),
      p("b", "Texte du jour", "Voici le briefing.", new Date(2026, 10, 24, 15, 48)),
      p("c", "Avant-hier", "Encore ceci.", new Date(2026, 10, 22, 11, 0)),
    ], options);
    expect(m.pieces.map((x) => x.id)).toEqual(["c", "a"]);
  });

  it("une page sans date reste en fin de file, quand = à l'instant", () => {
    const m = composerInformateur([
      p("a", "Datée", "Datée.", new Date(2026, 10, 24, 12, 0)),
      p("b", "Adate", "Adate."),
    ], options);
    expect(m.lettre!.id).toBe("a");
    expect(m.pieces.map((x) => x.id)).toEqual(["b"]);
    expect(m.pieces[0]!.quand).toBe("à l'instant");
  });

  it("même instant, ordre d'arrivée stable", () => {
    const meme = new Date(2026, 10, 24, 14, 0);
    const m = composerInformateur([
      p("a", "Premier", "Un.", meme),
      p("b", "Second", "Deux.", new Date(meme.getTime())),
    ], options);
    expect(m.lettre!.id).toBe("a");
    expect(m.pieces.map((x) => x.id)).toEqual(["b"]);
  });

  it("file vide : accroche d'absence, aucune lettre, aucune pièce", () => {
    const m = composerInformateur([], options);
    expect(m.lettre).toBeNull();
    expect(m.lettreAbsente).toBe(ACCROCHE_ABSENCE);
    expect(m.pieces).toEqual([]);
    expect(m.compteur).toBe("aucune page signée");
  });

  it("accroche honnête au singulier puis au pluriel", () => {
    const une = composerInformateur([p("a", "Seule", "Une.", new Date(2026, 10, 24, 9, 0))], options);
    const deux = composerInformateur([
      p("a", "Seule", "Une.", new Date(2026, 10, 24, 9, 0)),
      p("b", "Seconde", "Deux.", new Date(2026, 10, 24, 10, 0)),
    ], options);
    expect(une.accroche).toContain("une page signée");
    expect(deux.accroche).toContain("2 pages signées");
  });

  it("corps de la lettre découpé aux frontières de phrases", () => {
    const longTexte = Array.from({ length: 12 }, (_, i) =>
      "Phrase numéro " + i + " assez longue pour traverser la cible du paragraphe sans jamais être coupée à mi-mot.").join(" ");
    const m = composerInformateur([p("a", "Long", longTexte, new Date(2026, 10, 24, 8, 0))], options);
    expect(m.lettre!.paragraphes.length).toBeGreaterThan(1);
    const reunion = m.lettre!.paragraphes.join(" ").replace(/\s+/g, " ").trim();
    expect(reunion).toBe(longTexte.replace(/\s+/g, " ").trim());
    for (const para of m.lettre!.paragraphes) {
      expect(para.length).toBeGreaterThanOrEqual(60);
    }
  });

  it("quand de la lettre : l'heure de la maison", () => {
    const m = composerInformateur([p("a", "T", "x.", new Date(2026, 10, 24, 15, 48))], options);
    expect(m.lettre!.quand).toBe("15h48");
  });

  it("lecture estimée héritée de la Une", () => {
    const mots = Array.from({ length: 210 }, (_, i) => "mot" + i).join(" ");
    const m = composerInformateur([p("a", "T", mots, new Date(2026, 10, 24, 8, 0))], options);
    expect(m.lettre!.lectureEstimee).toBe(2);
  });

  it("dateLettre = jour de la requête en français", () => {
    const m = composerInformateur([p("a", "T", "x.", new Date(2026, 10, 24, 8, 0))], options);
    expect(m.dateLettre).toBe("mardi 24 novembre");
  });

  it("corpsComplet: false, dette ingestion s2 dite", () => {
    const m = composerInformateur([p("a", "T", "x.", new Date(2026, 10, 24, 8, 0))], options);
    expect(m.corpsComplet).toBe(false);
  });

  it("compteur honnête au pluriel", () => {
    const m = composerInformateur([
      p("a", "A", "x.", new Date(2026, 10, 24, 8, 0)),
      p("b", "B", "y.", new Date(2026, 10, 24, 9, 0)),
      p("c", "C", "z.", new Date(2026, 10, 24, 10, 0)),
    ], options);
    expect(m.compteur).toBe("3 pages signées");
  });

  it("lettre sans extrait : zéro paragraphe, jamais un texte bât", () => {
    const m = composerInformateur([p("a", "T", undefined, new Date(2026, 10, 24, 8, 0))], options);
    expect(m.lettre!.paragraphes).toEqual([]);
    expect(m.lettre!.lectureEstimee).toBe(0);
  });

  it("une seule page sans date devient la lettre à l'instant", () => {
    const m = composerInformateur([p("a", "Seule sans date", "Texte.")], options);
    expect(m.lettre!.id).toBe("a");
    expect(m.lettre!.quand).toBe("à l'instant");
    expect(m.pieces).toEqual([]);
  });

  it("la lettre porte la signature de l'informateur", () => {
    const m = composerInformateur([p("a", "T", "x.", new Date(2026, 10, 24, 8, 0))], options);
    expect(m.lettre!.signature).toBe(SIGNATURE_INFORMATEUR);
  });
});
