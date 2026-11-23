import type { ArticleModel } from "../lib/article";
import VueEcouter from "./ecouter";

/**
 * Gazette — la vue article (tranche UI 3, rangée 22e).
 * Une colonne, du texte, le contenant jamais mangeur du contenu (maquette
 * V3 validée). Les coins sticky Écouter/Questionner de la maquette ne
 * sont PAS posés : non branchés ils seraient décoratifs (rejet gravé) —
 * ils reviendront avec la voix speechSynthesis et le pré-message branchés.
 * Zéro script inline : la CSP barre, la page n'en demande pas.
 */
function VueArticle({ article }: { article: ArticleModel }) {
  return (
    <div className="wrap article">
      <a className="retour" href="/">← la file</a>
      <article>
        <h1>{article.titre}</h1>
        <p className="meta">
          {article.marque}
          {article.auteur ? " · " + article.auteur : ""} · {article.dateAffichee}
        </p>
        <hr className="filet" />
        {article.imageUrl ? (
          <img
            className="article-image"
            src={article.imageUrl}
            alt={"Illustration — " + article.titre}
            loading="lazy"
          />
        ) : null}
        {article.paragraphes.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {article.paragraphes.length === 0 ? (
          <p className="note">Le flux n&apos;a pas donné de corps à ce texte.</p>
        ) : null}
        <p className="note">
          Corps V1 : l&apos;extrait assaini du flux — assez pour questionner,
          jamais assez pour remplacer l&apos;article.
        </p>
        {article.lien ? (
          <p>
            <a href={article.lien} target="_blank" rel="noopener noreferrer">
              Lire chez la source →
            </a>
          </p>
        ) : null}
        <p className="meta">
          lecture estimée : {article.lectureEstimee}{" "}
          {article.lectureEstimee === 1 ? "minute" : "minutes"}
        </p>
      </article>
      <VueEcouter article={article} />
    </div>
  );
}

export default VueArticle;
