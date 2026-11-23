import type { NextConfig } from "next";

/**
 * Gazette — fondations (tranche 1).
 * Engagement §2 bis (prérogative sécurité du client) : les en-têtes de transport
 * sont posés AU FRAMEWORK dès la première tranche de code.
 * La CSP stricte à nonce (aucun script inline) arrive à la tranche middleware —
 * dette dite, jamais cachée.
 */
const securiteHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: securiteHeaders }];
  },
};

export default nextConfig;
