import { defineConfig } from "drizzle-kit";

/**
 * L'URL de connexion vit dans DATABASE_URL (secret d'hébergement), jamais au repo.
 * Le client a créé la base lui-même et remis les clés hors repo (rangée 16e).
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
