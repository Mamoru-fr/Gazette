/**
 * Gazette — la vue Une, tranche UI 2 (rangée 20e).
 * Le modèle pur est la vérité ; la page ne rend JAMAIS un simulacre :
 * aucun flux n'est encore ingéré (base vierge), la file est donc VIDE
 * et dite telle quelle. Le branchement data (route API parsing RSS)
 * est la tranche suivante — jamais enjambée.
 */
import VueUne from "../components/une";
import { composerUne } from "../lib/une";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Rendue à la requête : l'accroche porte le jour réel, jamais le jour du build.
  const une = composerUne([], { maintenant: new Date(), fluxConnectes: 0 });
  return (
    <main>
      <VueUne une={une} />
    </main>
  );
}
