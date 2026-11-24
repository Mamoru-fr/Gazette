"use client";
import { useEffect, useMemo, useState } from "react";
import type { ArticleModel } from "../lib/article";
import { buildPreMessage } from "../lib/pre-message";
import {
  APPLICATIONS,
  CLE_MEMOIRE_APP,
  construireLien,
  doitReplier,
  retrouverApplication,
  versPreMessageArticle,
} from "../lib/questionner";

/**
 * Gazette — le coin sticky Questionner (tranche rangée 25e), en bas à
 * droite de la page article (maquette V3 validée). BRANCHÉ au modèle
 * pur questionner sur le pré-message (rangée 17e) : jamais un bouton
 * décoratif (rejet gravé). Le pré-message est MONTRÉ et COPIÉ avant
 * toute ouverture d'app — le client questionne l'IA de SON choix,
 * mémorisé jamais imposé. Zéro script inline : les événements vivent
 * dans le composant, la CSP garde la barre. Le repli d'étiquette au
 * défilement vit ICI, en une seule passe de JS pour les DEUX coins
 * (rangée 23e : jamais deux parchemins) — la classe porte sur
 * l'élément racine, le CSS replie les étiquettes des deux coins.
 */
export default function VueQuestionner({ article }: { article: ArticleModel }) {
  const [ouvert, setOuvert] = useState(false);
  const [appNom, setAppNom] = useState(APPLICATIONS[0]?.nom ?? "");
  const [copie, setCopie] = useState(false);

  // Le pré-message est composé du modèle pur ; s'il refuse, le coin ne
  // se pose pas — pas de promesse qu'on ne tient pas (rejet gravé).
  const message = useMemo(() => {
    try {
      return buildPreMessage(versPreMessageArticle(article));
    } catch {
      return null;
    }
  }, [article]);

  // Le choix mémorisé du client, s'il en a un — sinon le premier du
  // registre, jamais un choix caché.
  useEffect(() => {
    const m = retrouverApplication(window.localStorage.getItem(CLE_MEMOIRE_APP));
    if (m) setAppNom(m.nom);
  }, []);

  // LE REPLI : une seule passe de JS pour les deux coins. La classe
  // coins-replie vit sur la racine, le CSS replie les étiquettes.
  useEffect(() => {
    const onScroll = () => {
      document.documentElement.classList.toggle(
        "coins-replie",
        doitReplier(window.scrollY),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!message) return null;
  const app = retrouverApplication(appNom);

  const copier = async () => {
    try {
      await navigator.clipboard?.writeText(message);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2000);
    } catch {
      /* le presse-papier a dit non — le panneau reste ouvert, le pré-message reste sélectionnable */
    }
  };

  const questionner = () => {
    if (!app) return;
    const lien = construireLien(app, message);
    if (!lien) return;
    try {
      window.localStorage.setItem(CLE_MEMOIRE_APP, app.nom);
    } catch {
      /* mémoire muette — le choix vit sans mémoire, refus net jamais silencieux */
    }
    window.open(lien, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {ouvert ? (
        <div
          className="panneau-question"
          role="dialog"
          aria-label="Questionner cet article avec une IA"
        >
          <h2>Questionner avec une IA</h2>
          <pre className="pre-message">{message}</pre>
          <div className="rangee-actions">
            <button type="button" className="petit-bouton" onClick={copier}>
              {copie ? "Copié ✓" : "Copier le pré-message"}
            </button>
            <select
              className="petit-bouton"
              value={appNom}
              onChange={(e) => setAppNom(e.currentTarget.value)}
              aria-label="L'IA à questionner"
            >
              {APPLICATIONS.map((a) => (
                <option key={a.nom} value={a.nom}>
                  {a.nom}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="petit-bouton accent"
              onClick={questionner}
              disabled={!app}
            >
              Questionner
            </button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        className="coin coin-questionner"
        aria-pressed={ouvert}
        aria-label="Questionner cet article avec une IA"
        onClick={() => setOuvert(!ouvert)}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Questionner</span>
      </button>
    </>
  );
}
