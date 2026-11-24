import { MESSAGE_ARTICLE_MUET, VUES_NAV, estActive } from "../lib/nav";

/**
 * Gazette — la navigation de la maquette V3 (rangée 28e) : le même
 * rail rendu par le média — barre de vues sous le masthead en
 * desktop, barre basse fixe en mobile, UNE SEULE table pour les
 * deux. Composant serveur, zéro script inline : la page déclare sa
 * vue courante, le lien actif est marqué dans le HTML (aria-current),
 * jamais deviné au clic — la CSP à nonce reste inutilisée, le
 * navigateur n'a rien à calculer.
 */
function VueNav({ courante }: { courante: string }) {
  return (
    <nav className="nav-rail" aria-label="Gazette — principale">
      {VUES_NAV.map((v) =>
        v.href ? (
          <a
            key={v.id}
            href={v.href}
            className={estActive(v, courante) ? "nav-lien actif" : "nav-lien"}
            aria-current={estActive(v, courante) ? "page" : undefined}
          >
            {v.label}
          </a>
        ) : (
          <span
            key={v.id}
            className="nav-lien nav-muette"
            title={MESSAGE_ARTICLE_MUET}
          >
            {v.label}
          </span>
        ),
      )}
    </nav>
  );
}

export default VueNav;
