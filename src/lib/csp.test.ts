import { describe, expect, it } from "vitest";
import { assainirNonce, construireCsp } from "./csp";

describe("assainirNonce — la frontière du nonce", () => {
  it("refuse le nonce vide ou blanc", () => {
    expect(() => assainirNonce("")).toThrow(/nonce vide/);
    expect(() => assainirNonce("   ")).toThrow(/nonce vide/);
  });
  it("refuse tout caractère hors alphabet (injection d'en-tête)", () => {
    expect(() => assainirNonce("abc 123")).toThrow(/caractères interdits/);
    expect(() => assainirNonce("abc'-x")).toThrow(/caractères interdits/);
    expect(() => assainirNonce("a\nb")).toThrow(/caractères interdits/);
  });
  it("accepte le base64url et le rend tel quel", () => {
    expect(assainirNonce("abcXYZ123_-")).toBe("abcXYZ123_-");
  });
});

describe("construireCsp — la politique stricte (§2 bis n°2)", () => {
  it("porte le nonce comme unique exception au script-src", () => {
    expect(construireCsp("abc123")).toContain(
      "script-src 'self' 'nonce-abc123'",
    );
  });
  it("ne contient JAMAIS unsafe-inline", () => {
    expect(construireCsp("abc123")).not.toContain("unsafe-inline");
  });
  it("production sans unsafe-eval ; dev l'ajoute (HMR), dit honnêtement", () => {
    expect(construireCsp("abc123")).not.toContain("unsafe-eval");
    expect(construireCsp("abc123", { developpement: true })).toContain(
      "unsafe-eval",
    );
  });
  it("ferme les trous OWASP : object, base, frame-ancestors", () => {
    const csp = construireCsp("abc123");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });
  it("propage le refus d'un nonce corrompu — jamais de CSP bricolée", () => {
    expect(() => construireCsp("abc'-x")).toThrow(/REFUS/);
  });
});
