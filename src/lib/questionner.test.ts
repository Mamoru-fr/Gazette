/**
 * Gazette — banc vitest du modèle questionner (tranche rangée 25e).
 * La logique fut d'abord prouvée au banc jumeau JS AVANT push (17
 * assertions, rouge vu d'abord sur la garde d'URL, passe de sabotage :
 * la recherche sensible à la casse rate « chatgpt ») — ce fichier en
 * est la transcription vitest, le jumeau ne remplace jamais le banc.
 */
import { describe, expect, it } from "vitest";
import { buildPreMessage } from "./pre-message";
import {
  APPLICATIONS,
  CLE_MEMOIRE_APP,
  SEUIL_REPLI_DEFAUT,
  construireLien,
  doitReplier,
  retrouverApplication,
  versPreMessageArticle,
  type ApplicationQuestionnement,
} from "./questionner";

const chatgpt = retrouverApplication("ChatGPT");
if (!chatgpt) throw new Error("banc questionner : ChatGPT introuvable — REFUS");

const ARTICLE = {
  id: "guid-42",
  titre: "Titre de l'article",
  marque: "Le Flux du Jour",
  dateAffichee: "lundi 23 novembre · 15h48",
  lien: "https://exemple.fr/article",
  paragraphes: ["Premier paragraphe.", "Second paragraphe."],
};

describe("retrouverApplication", () => {
  it("retrouve au nom exact", () => {
    expect(retrouverApplication("ChatGPT")?.nom).toBe("ChatGPT");
  });

  it("est insensible à la casse et aux blancs", () => {
    expect(retrouverApplication("  chatgpt ")?.nom).toBe("ChatGPT");
  });

  it("refuse net l'inconnue", () => {
    expect(retrouverApplication("Skype")).toBeNull();
  });

  it("refuse net le vide et le blanc", () => {
    expect(retrouverApplication("   ")).toBeNull();
  });

  it("refuse net le non-chaîne", () => {
    expect(retrouverApplication(null)).toBeNull();
    expect(retrouverApplication(undefined)).toBeNull();
  });
});

describe("construireLien", () => {
  it("pré-remplit là où l'app offre un paramètre", () => {
    const message = "titre\nligne2 ?&=";
    expect(construireLien(chatgpt, message)).toBe(
      "https://chatgpt.com/?q=" + encodeURIComponent(message),
    );
  });

  it("donne l'URL nue quand le message est vide", () => {
    expect(construireLien(chatgpt, "  ")).toBe("https://chatgpt.com/");
  });

  it("donne l'URL nue quand l'app n'offre pas de paramètre", () => {
    const leChat = retrouverApplication("Le Chat — Mistral");
    if (!leChat) throw new Error("banc questionner : Le Chat introuvable — REFUS");
    expect(construireLien(leChat, "bonjour")).toBe("https://chat.mistral.ai/chat");
  });

  it("refuse net l'URL non https", () => {
    const app: ApplicationQuestionnement = {
      nom: "X",
      url: "http://x.example",
      parametre: "q",
    };
    expect(construireLien(app, "m")).toBeNull();
  });

  it("refuse net l'app nulle", () => {
    expect(construireLien(null, "m")).toBeNull();
  });

  it("scelle le bon séparateur quand l'URL porte déjà une requête", () => {
    const app: ApplicationQuestionnement = {
      nom: "X",
      url: "https://x.example/?a=1",
      parametre: "q",
    };
    expect(construireLien(app, "m")).toBe("https://x.example/?a=1&q=m");
  });
});

describe("registre des apps", () => {
  it("ne porte que des URLs https ouvertes", () => {
    expect(
      APPLICATIONS.every((a) => {
        const lien = construireLien(a, "m");
        return lien !== null && lien.startsWith("https://");
      }),
    ).toBe(true);
  });

  it("porte la clé de mémorisation préfixée maison", () => {
    expect(CLE_MEMOIRE_APP.startsWith("gazette:")).toBe(true);
  });
});

describe("versPreMessageArticle + buildPreMessage", () => {
  it("traverse le pont sans perte : marque → source, paragraphes → extrait", () => {
    const message = buildPreMessage(versPreMessageArticle(ARTICLE));
    expect(message).toContain("Titre de l'article");
    expect(message).toContain("ID : guid-42");
    expect(message).toContain("Source : Le Flux du Jour");
    expect(message).toContain("Premier paragraphe. Second paragraphe.");
  });

  it("dit l'absence de lien sans inventer", () => {
    const message = buildPreMessage(
      versPreMessageArticle({ ...ARTICLE, lien: null }),
    );
    expect(message).toContain("Lien :");
  });
});

describe("doitReplier — le repli partagé des coins", () => {
  it("ne replie pas sous le seuil", () => {
    expect(doitReplier(0)).toBe(false);
  });

  it("replie à la frontière du seuil", () => {
    expect(doitReplier(SEUIL_REPLI_DEFAUT)).toBe(true);
  });

  it("garde l'ingérable à false, jamais d'exception", () => {
    expect(doitReplier("abc")).toBe(false);
    expect(doitReplier(Number.NaN)).toBe(false);
    expect(doitReplier(undefined)).toBe(false);
  });

  it("respecte un seuil porté par l'appelant", () => {
    expect(doitReplier(10, 10)).toBe(true);
    expect(doitReplier(9, 10)).toBe(false);
  });
});
