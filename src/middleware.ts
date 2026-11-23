import { NextRequest, NextResponse } from "next/server";
import { construireCsp } from "./lib/csp";

/**
 * Gazette — middleware sécurité (§2 bis n°2, la dette de la tranche fondations).
 * Un nonce CSP par requête (crypto, jamais Math.random) ; l'unsafe-eval de dev
 * n'est ajouté que sur preuve NODE_ENV=development — le modèle ne décide jamais
 * seul ; le nonce est transmis aux layouts via x-nonce pour le branchement aux
 * balises <Script> (première tranche UI, dette dite au registre).
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const estDev = process.env.NODE_ENV === "development";

  const csp = construireCsp(nonce, { developpement: estDev });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
