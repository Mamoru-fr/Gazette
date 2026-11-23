import { describe, expect, it } from "vitest";
import { extraireNonce } from "./nonce";

/**
 * Gazette — banc du branchement du nonce (tranche UI 1, rangée 19e).
 * Loi testée : ABSENCE != CORRUPTION. Absent -> null (pas d'attribut,
 * aucun script inline à poser) ; présent mais corrompu -> REFUS NET,
 * jamais de correction silencieuse. Prouvé au banc jumeau avant push.
 */
describe("extraireNonce", () => {
  it("absent -> null (pas d'attribut, scripts inline interdits)", () => {
    expect(extraireNonce(new Map())).toBeNull();
  });

  it("absent, d'autres entêtes présentes -> null quand même", () => {
    expect(extraireNonce(new Map([["content-type", "text/html"]]))).toBeNull();
  });

  it("get undefined-tolérant -> null", () => {
    expect(extraireNonce({ get: () => undefined })).toBeNull();
  });

  it("présent et valide -> rendu identique", () => {
    expect(extraireNonce(new Map([["x-nonce", "abcXYZ123_-"]]))).toBe("abcXYZ123_-");
  });

  it("insensible à la casse (X-Nonce)", () => {
    expect(extraireNonce(new Map([["X-Nonce", "nOnCe42_"]]))).toBe("nOnCe42_");
  });

  it("corrompu (espace) -> REFUS NET", () => {
    expect(() => extraireNonce(new Map([["x-nonce", "a b c d"]]))).toThrow();
  });

  it("corrompu (quote/injection) -> REFUS NET", () => {
    expect(() => extraireNonce(new Map([["x-nonce", "a';drop"]]))).toThrow();
  });

  it("corrompu (<script>) -> REFUS NET", () => {
    expect(() => extraireNonce(new Map([["x-nonce", "<script>"]]))).toThrow();
  });

  it("présent mais vide -> REFUS NET (présent, pas absent)", () => {
    expect(() => extraireNonce(new Map([["x-nonce", ""]]))).toThrow();
  });

  it("présent mais blanc -> REFUS NET", () => {
    expect(() => extraireNonce(new Map([["x-nonce", "   "]]))).toThrow();
  });
});
