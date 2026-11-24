import { describe, expect, it } from "vitest";
import {
  PLAFOND_FLUX_V1,
  composerConnexion,
  dejaConnecte,
  jugerConnexion,
  normaliserUrlFlux,
  type FluxConnecte,
} from "./connexion";
import { PLAFOND_FLUX_V1 as PLAFOND_UNE } from "./une";

/**
 * Gazette — banc de la page Connexion (rangée 26e).
 * Les lois testées vivent dans connexion.ts : https ou rien, la norme
 * clé du doublon, le plafond qui dit son nom, le verdict-parole.
 * Prouvé au banc jumeau avant push : rouge vu d'abord, passe de
 * sabotage vue.
 */

const flux = (id: string, url: string, nom: string | null = null): FluxConnecte => ({
  id,
  nom,
  url,
});

describe("normaliserUrlFlux — https ou rien", () => {
  it("accepte une adresse https nue et la garde telle quelle", () => {
    expect(normaliserUrlFlux("https://lemonde.fr/rss/une")).toBe(
      "https://lemonde.fr/rss/une",
    );
  });
  it("retire la barre finale du chemin, pas celle de la racine", () => {
    expect(normaliserUrlFlux("https://lemonde.fr/rss/une/")).toBe(
      "https://lemonde.fr/rss/une",
    );
    expect(normaliserUrlFlux("https://lemonde.fr/")).toBe("https://lemonde.fr/");
  });
  it("tolère les blancs de colle autour, pas dedans", () => {
    expect(normaliserUrlFlux("  https://afp.com/feed  ")).toBe(
      "https://afp.com/feed",
    );
    expect(normaliserUrlFlux("https://ex emploi.fr/feed")).toBeNull();
  });
  it("refuse net : http, ftp, hôte sans point, @, vide, non-chaîne", () => {
    expect(normaliserUrlFlux("http://lemonde.fr/rss")).toBeNull();
    expect(normaliserUrlFlux("ftp://lemonde.fr/rss")).toBeNull();
    expect(normaliserUrlFlux("https://localhost/feed")).toBe("https://localhost/feed"); // hôte local autorisé, pare-feu 21e
    expect(normaliserUrlFlux("https://flux/feed")).toBeNull();
    expect(normaliserUrlFlux("https://user@lemonde.fr/feed")).toBeNull();
    expect(normaliserUrlFlux("")).toBeNull();
  });
  it("normalise la casse de l'hôte, pas du chemin", () => {
    expect(normaliserUrlFlux("https://LEMONDE.fr/RSS/une")).toBe(
      "https://lemonde.fr/RSS/une",
    );
  });
});

describe("jugerConnexion — le verdict-parole", () => {
  const existants: FluxConnecte[] = [
    flux("f1", "https://lemonde.fr/rss/une", "Le Monde"),
    flux("f2", "https://afp.com/feed", "AFP"),
  ];

  it("refuse l'invalide avec sa parole entière, jamais corrigé en silence", () => {
    const v = jugerConnexion("lemonde.fr/rss/une", existants);
    expect(v.etat).toBe("refuse");
    expect(v.url).toBeNull();
    expect(v.message).toContain("https");
  });
  it("cale le doublon sur la forme normalisée, pas sur la colle brute", () => {
    const v = jugerConnexion("https://Lemonde.fr/rss/une/", existants);
    expect(v.etat).toBe("doublon");
    expect(v.url).toBe("https://lemonde.fr/rss/une");
  });
  it("un vide saisi est refusé, jamais « prêt »", () => {
    expect(jugerConnexion("   ", existants).etat).toBe("refuse");
  });
  it("une adresse neuve valide est prête, avec sa vérité s2 dite", () => {
    const v = jugerConnexion("https://reuters.com/rss", existants);
    expect(v.etat).toBe("prete");
    expect(v.url).toBe("https://reuters.com/rss");
    expect(v.message).toContain("s2");
  });
  it("le plafond atteint refuse en disant son nom (mou, jamais architecture)", () => {
    const pleins: FluxConnecte[] = Array.from({ length: PLAFOND_FLUX_V1 }, (_, i) =>
      flux(`f${i}`, `https://flux${i}.fr/feed`, `flux ${i}`),
    );
    const v = jugerConnexion("https://jeuneafrique.com/rss", pleins);
    expect(v.etat).toBe("plafond");
    expect(v.message).toContain("50");
  });
  it("le plafond mou laisse entrer le 50e, refuse le 51e", () => {
    const quaranteNeuf: FluxConnecte[] = Array.from(
      { length: PLAFOND_FLUX_V1 - 1 },
      (_, i) => flux(`f${i}`, `https://flux${i}.fr/feed`, `flux ${i}`),
    );
    expect(jugerConnexion("https://jeuneafrique.com/rss", quaranteNeuf).etat).toBe(
      "prete",
    );
    const cinquante = [
      ...quaranteNeuf,
      flux("f50", "https://jeuneafrique.com/rss", "Jeune Afrique"),
    ];
    expect(jugerConnexion("https://techcrunch.com/feed", cinquante).etat).toBe(
      "plafond",
    );
  });
  it("le plafond par défaut est celui de la Une — une seule vérité", () => {
    expect(PLAFOND_UNE).toBe(50);
  });
});

describe("dejaConnecte — la norme est la clé", () => {
  it("voit le doublon à travers barre finale et casse", () => {
    expect(
      dejaConnecte("https://afp.com/feed", [flux("f2", "https://AFP.com/feed/")]),
    ).toBe(true);
  });
  it("null ne connecte rien", () => {
    expect(dejaConnecte(null, [flux("f2", "https://afp.com/feed")])).toBe(false);
  });
});

describe("composerConnexion — la page dit la vérité", () => {
  it("base vierge : file vide dite telle quelle, compteur 0 / 50", () => {
    const m = composerConnexion([]);
    expect(m.titre).toBe("Vos flux");
    expect(m.compteur).toBe(`0 / ${PLAFOND_FLUX_V1}`);
    expect(m.lignes).toEqual([]);
    expect(m.vide).toContain("vide");
    expect(m.vide).toContain("s2");
  });
  it("la marque manque parfois : l'hôte dit, jamais une invention", () => {
    const m = composerConnexion([flux("f1", "https://jdd.fr/rss", null)]);
    expect(m.lignes[0]?.marque).toBe("jdd.fr");
  });
  it("la marque présente garde la vedette", () => {
    const m = composerConnexion([flux("f1", "https://jdd.fr/rss", "Journal du Dimanche")]);
    expect(m.lignes[0]?.marque).toBe("Journal du Dimanche");
  });
  it("compteur honnête sur une file réelle", () => {
    const m = composerConnexion([
      flux("f1", "https://lemonde.fr/rss/une", "Le Monde"),
      flux("f2", "https://afp.com/feed", "AFP"),
    ]);
    expect(m.compteur).toBe(`2 / ${PLAFOND_FLUX_V1}`);
    expect(m.offres).toBe(2);
    expect(m.vide).toBeNull();
  });
});
