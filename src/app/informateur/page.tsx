/**
 * Gazette — la page Informateur (tranche UI, rangée 27e).
 * « Informateur : le briefing du jour, en lettre » (maquette V3, gate 2).
 * Le modèle pur est la vérité ; la page ne rend JAMAIS un simulacre :
 * la base est vierge, la file est donc VIDE et dite telle — jamais une
 * lettre de démonstration. L'ingestion s2 (derrière les secrets, chez le
 * maître) branchera les vraies pages signées (flux_id NULL, stack §3).
 * Rangée 28e : cette page déclare sa vue « informateur » au rail de la
 * nav V3 — la marque vit à la source, zéro script.
 */
import VueInformateur from "../../components/informateur";
import VueNav from "../../components/nav";
import { composerInformateur } from "../../lib/informateur";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Rendue à la requête : la date de la lettre porte le jour réel, jamais le jour du build.
  const informateur = composerInformateur([], { maintenant: new Date() });
  return (
    <main>
      <VueNav courante="informateur" />
      <VueInformateur informateur={informateur} />
    </main>
  );
}
