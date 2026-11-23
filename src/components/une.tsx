import { PLAFOND_FLUX_V1 } from "../lib/une";
import type { UneModel } from "../lib/une";

/**
 * Gazette — la vue Une (tranche UI 2, rangée 20e).
 * Fidèle à la maquette V3 validée en gate 2 : peau Crème, file douce,
 * hier plié derrière un geste volontaire (<details> : zéro script —
 * la maison n'achète pas du JavaScript pour un pli), tuile de secours
 * typographique, jamais d'émoi. Le clic d'entrée viendra avec la vue
 * article (tranche suivante) : ici l'entrée dit vrai, elle n'est pas
 * un bouton décoratif.
 */

function VueUne({ une }: { une: UneModel }) {
  return (
    <div className="wrap">
      <section className="greeting">
        <h1>{une.accroche}</h1>
        <p>{une.sousAccroche}</p>
      </section>
      <hr className="filet" />
      {une.entrees.map((e) => (
        <article key={e.id} className={e.grande ? "entree grande" : "entree"}>
          <div className="visuel nophoto-tuile" data-marque={e.marque}>
            {e.imageUrl ? (
              <img src={e.imageUrl} alt={"Illustration — " + e.marque} loading="lazy" />
            ) : (
              <span>{e.marque}</span>
            )}
          </div>
          <div className="entree-corps">
            {e.kicker ? <div className="kicker">{e.kicker}</div> : null}
            <h2>{e.titre}</h2>
            {e.extrait ? <p>{e.extrait}</p> : null}
            {e.note ? (
              <p className="note">
                <strong>L&apos;informateur</strong> {e.note}
              </p>
            ) : null}
            <p className="meta">
              {e.marque} · {e.quand}
            </p>
          </div>
        </article>
      ))}
      {une.entrees.length > 0 ? <p className="pause">{une.pause}</p> : null}
      {une.hier.length > 0 ? (
        <details className="plus">
          <summary>charger les textes d&apos;hier</summary>
          {une.hier.map((e) => (
            <article key={e.id} className="entree">
              <div className="visuel nophoto-tuile" data-marque={e.marque}>
                {e.imageUrl ? (
                  <img src={e.imageUrl} alt={"Illustration — " + e.marque} loading="lazy" />
                ) : (
                  <span>{e.marque}</span>
                )}
              </div>
              <div className="entree-corps">
                <h2>{e.titre}</h2>
                {e.extrait ? <p>{e.extrait}</p> : null}
                <p className="meta">
                  {e.marque} · {e.quand}
                </p>
              </div>
            </article>
          ))}
        </details>
      ) : null}
      <p className="compteur-ligne">
        compteur honnête : <strong>{une.compteur}</strong> — le plafond V1
        ({PLAFOND_FLUX_V1}) n&apos;est jamais une limite d&apos;architecture
      </p>
    </div>
  );
}

export default VueUne;
