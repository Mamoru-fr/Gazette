/**
 * Gazette — la vue article, route /article/[id] (tranche UI 3, rangée 22e).
 * La vérité de la V1 : la base est vierge, aucun article n'est ingéré (le
 * branchement data s2 est la tranche suivante, jamais enjambée) — la route
 * dit donc la vérité : 404, jamais un article de démonstration, jamais un
 * simulacre. Dès l'ingestion, la page cherchera l'article par son identité
 * stable (guid, à défaut lien validé — jamais un id bâti) et le rendra par
 * composerArticle.
 */
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function PageArticle() {
  notFound();
}
