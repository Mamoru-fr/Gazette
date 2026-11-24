import type { InformateurModel } from "../lib/informateur";

/**
 * Gazette — la vue Informateur (tranche UI, rangée 27e).
 * « Informateur : le briefing du jour, en lettre » (maquette V3, gate 2).
 * Le modèle pur est la vérité : la vue habille, elle ne décide JAMAIS —
 * la lettre absente est dite absente, la dette de corps (ingestion s2)
 * est dite telle. Zéro script inline (CSP à nonce tenue), zéro émoji
 * (décret icônes du client — du texte et des filets, la lettre suffit).
 */

function VueInformateur({ informateur }: { informateur: InformateurModel }) {
  return (
    <div className="wrap lettre">
      <header>
        <h1 className="masthead-informateur">L&apos;Informateur</h1>
        <p className="date-lettre">{informateur.dateLettre}</p>
      </header>
      <hr className="filet" />
      <p className="accroche-lettre">{informateur.accroche}</p>
      {informateur.lettre ? (
        <article className="briefing">
          <h2>{informateur.lettre.titre}</h2>
          {informateur.lettre.paragraphes.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p className="quand-lettre">
            posée à {informateur.lettre.quand}
            {informateur.lettre.lectureEstimee > 0
              ? " · lecture estimée : " +
                informateur.lettre.lectureEstimee +
                (informateur.lettre.lectureEstimee === 1 ? " minute" : " minutes")
              : ""}
            {" · "}extrait, pas le corps entier — l&apos;ingestion de la
            saison 2 le portera
          </p>
          <p className="signature">{informateur.lettre.signature}</p>
        </article>
      ) : (
        <p className="lettre-absente">{informateur.lettreAbsente}</p>
      )}
      {informateur.pieces.length > 0 ? (
        <section>
          <h2 className="pieces-titre">En pièces jointes</h2>
          <ul className="pieces">
            {informateur.pieces.map((x) => (
              <li key={x.id}>
                <span className="titre-piece">{x.titre}</span>{" "}
                <span className="quand-piece">
                  {x.quand}
                  {x.lectureEstimee > 0
                    ? " · " + x.lectureEstimee +
                      (x.lectureEstimee === 1 ? " minute" : " minutes")
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="compteur-ligne">honnêteté du compte : {informateur.compteur}</p>
    </div>
  );
}

export default VueInformateur;
