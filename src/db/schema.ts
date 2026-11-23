/**
 * Gazette — schéma de données minimal (stack V1 §3).
 * Une seule vérité, rien de plus qu'exige la V1.
 * La DB n'est jamais modifiée à la main ; migrations Drizzle versionnées.
 * L'URL de connexion ne va JAMAIS au repo (secret d'hébergement).
 */
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const flux = pgTable("flux", {
  id: uuid("id").defaultRandom().primaryKey(),
  titre: text("titre").notNull(),
  url: text("url").notNull(),
  site: text("site"),
  actif: boolean("actif").notNull().default(true),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
  derniereRecupLe: timestamp("derniere_recup_le", { withTimezone: true }),
});

export const article = pgTable("article", {
  /** ID STABLE — il alimente le pré-message. */
  id: uuid("id").defaultRandom().primaryKey(),
  // flux_id NULL pour l'informateur : ses pages vivent dans la MÊME table.
  fluxId: uuid("flux_id").references(() => flux.id),
  guid: text("guid"),
  titre: text("titre").notNull(),
  auteur: text("auteur"),
  lien: text("lien"),
  extrait: text("extrait"),
  imageUrl: text("image_url"),
  publieLe: timestamp("publie_le", { withTimezone: true }),
  ingereLe: timestamp("ingere_le", { withTimezone: true }).notNull().defaultNow(),
  // a_lire / lu / dormant
  etat: text("etat").notNull().default("a_lire"),
});

export const parametres = pgTable("parametres", {
  cle: text("cle").primaryKey(),
  valeur: text("valeur").notNull(),
});
