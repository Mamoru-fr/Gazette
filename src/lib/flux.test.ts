import { describe, expect, it } from "vitest";
import {
  analyserFlux,
  assainirTexte,
  validerUrl,
  bornerExtrait,
  LIMITE_EXTRAIT,
  type ResultatAnalyse,
} from "./flux";

/**
 * Gazette — banc du branchement data, session 1 (rangée 21e).
 * Les lois testées vivent dans flux.ts : assainir avant tout (entités
 * décodées PUIS balises jetées), URL validées (jamais javascript:, jamais
 * data:), titre obligatoire (l'ignoré est compté), guid de secours,
 * absence de date sans crash, ordre du document sacré. Prouvé au banc
 * jumeau avant push, rouge vu d'abord, passe de sabotage vue.
 */

const RSS_UN = '<?xml version="1.0"?><rss version="2.0"><channel><title>Journal</title><item><title>Le titre</title><link>https://exemple.fr/article</link><guid>urn:uuid:1234</guid><pubDate>Mon, 23 Nov 2026 08:00:00 GMT</pubDate><description><![CDATA[Un <b>extrait</b> propre.]]></description><enclosure url="https://exemple.fr/img.jpg" type="image/jpeg" length="12"/></item></channel></rss>';

const result = (xml: string): ResultatAnalyse => analyserFlux(xml);

describe("analyserFlux — RSS 2.0", () => {
  it("flux minimal complet : items, titre, lien, guid, date, extrait, image", () => {
    const r = result(RSS_UN);
    expect(r.ok).toBe(true);
    expect(r.format).toBe("rss");
    expect(r.items).toHaveLength(1);
    expect(r.items[0]?.titre).toBe("Le titre");
    expect(r.items[0]?.lien).toBe("https://exemple.fr/article");
    expect(r.items[0]?.guid).toBe("urn:uuid:1234");
    expect(r.items[0]?.publieLe?.getTime()).toBe(new Date("Mon, 23 Nov 2026 08:00:00 GMT").getTime());
    expect(r.items[0]?.extrait).toBe("Un extrait propre.");
    expect(r.items[0]?.imageUrl).toBe("https://exemple.fr/img.jpg");
  });

  it("guid de secours : sans guid, l'identité devient le lien", () => {
    const r = result('<rss version="2.0"><channel><item><title>Sans guid</title><link>https://exemple.fr/a</link></item></channel></rss>');
    expect(r.items[0]?.guid).toBe("https://exemple.fr/a");
  });

  it("titre obligatoire : l'item muet est IGNORÉ et COMPTÉ, jamais une perte silencieuse", () => {
    const r = result('<rss version="2.0"><channel><item><title>Muets</title><link>https://exemple.fr/1</link></item><item><link>https://exemple.fr/2</link></item></channel></rss>');
    expect(r.ok).toBe(true);
    expect(r.ignores).toBe(1);
    expect(r.items).toHaveLength(1);
  });

  it("assainir avant tout : entités décodées PUIS balises jetées (un <script> encodé ne survit pas)", () => {
    const r = result('<rss version="2.0"><channel><item><title>L&apos;événement &amp; le reste &#233;</title><description>&lt;script&gt;x()&lt;/script&gt; dit &#x27;vrai&#x27;</description></item></channel></rss>');
    expect(r.items[0]?.titre).toBe("L'événement & le reste é");
    expect(r.items[0]?.extrait).toBe("x() dit 'vrai'");
  });

  it("image javascript: refusée NETE — l'item garde la vie", () => {
    const r = result('<rss version="2.0"><channel><item><title>Vivant</title><enclosure url="javascript:alert(1)" type="image/jpeg"/></item></channel></rss>');
    expect(r.items).toHaveLength(1);
    expect(r.items[0]?.imageUrl).toBeNull();
  });

  it("enclosure audio n'est pas une image ; media:content sert de vignette", () => {
    const r = result('<rss version="2.0"><channel><item><title>Pod</title><enclosure url="https://x/p.mp3" type="audio/mpeg"/><media:content url="https://x/vignette.jpg"/></item></channel></rss>');
    expect(r.items[0]?.imageUrl).toBe("https://x/vignette.jpg");
  });

  it("media:thumbnail en secours de vignette", () => {
    const r = result('<rss version="2.0"><channel><item><title>Vignette</title><media:thumbnail url="https://x/thumb.png"/></item></channel></rss>');
    expect(r.items[0]?.imageUrl).toBe("https://x/thumb.png");
  });

  it("lien hostile : null (et guid null par ricochet), l'item vit quand même", () => {
    const r = result('<rss version="2.0"><channel><item><title>Sans rien</title><link>javascript:void(0)</link></item></channel></rss>');
    expect(r.items).toHaveLength(1);
    expect(r.items[0]?.lien).toBeNull();
    expect(r.items[0]?.guid).toBeNull();
  });

  it("absence de date n'est pas un crash — ni une date absurde", () => {
    const r = result('<rss version="2.0"><channel><item><title>A</title><pubDate>pas une date</pubDate></item><item><title>B</title></item></channel></rss>');
    expect(r.items[0]?.publieLe).toBeNull();
    expect(r.items[1]?.publieLe).toBeNull();
  });

  it("l'ordre du document est sacré : le tri appartient à la Une", () => {
    const r = result('<rss version="2.0"><channel><item><title>Premier</title></item><item><title>Deuxième</title></item><item><title>Troisième</title></item></channel></rss>');
    expect(r.items.map((x) => x.titre)).toEqual(["Premier", "Deuxième", "Troisième"]);
  });

  it("content:encoded sert de repli quand description est muet", () => {
    const r = result('<rss version="2.0"><channel><item><title>Long</title><content:encoded><![CDATA[Contenu <a href="https://x">riche</a> du corps.]]></content:encoded></item></channel></rss>');
    expect(r.items[0]?.extrait).toBe("Contenu riche du corps.");
  });

  it("dc:creator lu comme auteur", () => {
    const r = result('<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><item><title>A</title><dc:creator>Orion</dc:creator></item></channel></rss>');
    expect(r.items[0]?.auteur).toBe("Orion");
  });

  it("flux sans item : ok, file vide dite telle quelle", () => {
    const r = result('<rss version="2.0"><channel><title>Vide</title></channel></rss>');
    expect(r.ok).toBe(true);
    expect(r.items).toHaveLength(0);
    expect(r.ignores).toBe(0);
  });
});

describe("analyserFlux — Atom", () => {
  const ATOM = '<feed xmlns="http://www.w3.org/2005/Atom"><title>Flux</title><entry><id>tag:exemple.fr,2026:1</id><title>Titre atom</title><link rel="self" href="https://exemple.fr/atom.xml"/><link rel="alternate" href="https://exemple.fr/article-atom"/><summary><![CDATA[Résumé <i>doux</i>.]]></summary><published>2026-11-23T09:30:00Z</published><author><name>Ada</name></author></entry></feed>';

  it("entrée complète : id, titre, lien alternate (self ignoré), résumé, date, auteur", () => {
    const r = result(ATOM);
    expect(r.ok).toBe(true);
    expect(r.format).toBe("atom");
    expect(r.items[0]?.titre).toBe("Titre atom");
    expect(r.items[0]?.lien).toBe("https://exemple.fr/article-atom");
    expect(r.items[0]?.guid).toBe("tag:exemple.fr,2026:1");
    expect(r.items[0]?.extrait).toBe("Résumé doux.");
    expect(r.items[0]?.publieLe?.getTime()).toBe(new Date("2026-11-23T09:30:00Z").getTime());
    expect(r.items[0]?.auteur).toBe("Ada");
  });

  it("updated en secours quand published manque", () => {
    const r = result('<feed><entry><title>U</title><updated>2026-11-22T18:00:00Z</updated></entry></feed>');
    expect(r.items[0]?.publieLe?.getTime()).toBe(new Date("2026-11-22T18:00:00Z").getTime());
  });
});

describe("analyserFlux — les gardes", () => {
  it("format inconnu : refus net, erreur dite honnêtement", () => {
    const r = result('<html><body>pas un flux</body></html>');
    expect(r.ok).toBe(false);
    expect((r.erreur ?? "").length).toBeGreaterThan(0);
    expect(r.items).toHaveLength(0);
  });

  it("corps vide : refus net", () => {
    expect(analyserFlux("").ok).toBe(false);
  });
});

describe("validerUrl — les URL tierces ne passent QUE validées", () => {
  it("http et https avec hôte : passent", () => {
    expect(validerUrl("http://exemple.fr/x")).toBe("http://exemple.fr/x");
    expect(validerUrl("https://exemple.fr/a/b?x=1")).toBe("https://exemple.fr/a/b?x=1");
    expect(validerUrl("http://localhost:3000/img.jpg")).toBe("http://localhost:3000/img.jpg");
    expect(validerUrl("https://x/vignette.jpg")).toBe("https://x/vignette.jpg"); // hôte sans point légitime (LAN)
  });

  it("javascript:, data:, ftp, hôte vide ou neutralisé : refusés NETS", () => {
    expect(validerUrl("javascript:alert(1)")).toBeNull();
    expect(validerUrl("data:text/html;base64,x")).toBeNull();
    expect(validerUrl("ftp://exemple.fr/x")).toBeNull();
    expect(validerUrl("https://")).toBeNull();
    expect(validerUrl("http:///x")).toBeNull();
    expect(validerUrl("http://exoemple .fr/x")).toBeNull();
    expect(validerUrl("http://user@exemple.fr/x")).toBeNull();
    expect(validerUrl(null)).toBeNull();
  });
});

describe("bornerExtrait et assainirTexte", () => {
  it("coupe au mot entier, ellipses honnêtes, limite tenue", () => {
    const longTexte = Array(220).fill("motcomplet").join(" ");
    const borne = bornerExtrait(longTexte);
    expect((borne ?? "").length).toBeLessThanOrEqual(LIMITE_EXTRAIT + 1);
    expect(borne?.endsWith("…")).toBe(true);
    expect(/(^|\s)motcomplet…$/.test(borne ?? "")).toBe(true);
  });

  it("extrait court : jamais touché", () => {
    expect(bornerExtrait("court")).toBe("court");
    expect(bornerExtrait(null)).toBeNull();
  });

  it("assainirTexte plie les blancs, garde les accents", () => {
    expect(assainirTexte("  trop&nbsp;  de blancs ")).toBe("trop de blancs");
  });

  it("la limite est le contrat : 800", () => {
    expect(LIMITE_EXTRAIT).toBe(800);
  });
});
