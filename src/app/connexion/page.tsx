/**
 * Gazette — la page Connexion, route /connexion (rangée 26e, besoin 6 :
 * « Connexion », pas « audit » — le mot du client, §8).
 * La vérité de la V1 : la base est vierge, aucun flux n'est connecté —
 * la page rend la file VIDE honnête (composerConnexion([])), jamais un
 * flux de démonstration, jamais un simulacre. Dès l'ingestion (s2 :
 * route API + base derrière les secrets du maître), la page lira les
 * flux réels et l'écriture vivra.
 */
import VueConnexion from "../../components/connexion";
import { composerConnexion } from "../../lib/connexion";

export const dynamic = "force-dynamic";

export default function PageConnexion() {
  const model = composerConnexion([]);
  return (
    <main>
      <VueConnexion model={model} />
    </main>
  );
}
