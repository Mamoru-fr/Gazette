"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ArticleModel } from "../lib/article";
import {
  bornerVitesse,
  choisirVoix,
  composerLecon,
  decouperSegments,
  etatSuivant,
} from "../lib/voix";
import type { EtatLecture } from "../lib/voix";

/**
 * Gazette — le coin sticky Écouter (tranche rangée 23e), en bas à gauche
 * de la page article (maquette V3 validée). BRANCHÉ au modèle pur voix :
 * jamais un bouton décoratif (rejet gravé). L'API absente ⇒ le coin ne
 * se pose pas — pas de promesse qu'on ne tient pas. Zéro script inline :
 * les événements vivent dans le composant, la CSP garde la barre. Le
 * repli d'étiquette au défilement viendra avec le second coin
 * (Questionner) — une seule passe de JS, jamais deux.
 */
export default function VueEcouter({ article }: { article: ArticleModel }) {
  const [disponible, setDisponible] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const arrete = useRef(false);

  useEffect(() => {
    setDisponible(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      arrete.current = true;
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* le moteur est déjà parti */
      }
    };
  }, []);

  const segments = useMemo(
    () => decouperSegments(composerLecon(article)),
    [article],
  );

  const rendre = () => {
    if (enCours) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    arrete.current = false;
    let etat: EtatLecture = { position: 0, total: segments.length };
    const voixNom = choisirVoix(
      synth.getVoices().map((v) => ({ nom: v.name, langue: v.lang })),
    )?.nom;
    setEnCours(true);
    const jouer = () => {
      if (arrete.current) return;

      const suivant = etatSuivant(etat);
      if (suivant.fini) {
        setEnCours(false);
        return;
      }
      etat = { position: suivant.position, total: etat.total };
      const u = new SpeechSynthesisUtterance(segments[suivant.position - 1] ?? "");
      if (voixNom) u.voice = synth.getVoices().find((v) => v.name === voixNom) ?? null;
      u.lang = "fr-FR";
      u.rate = bornerVitesse(1);
      u.onend = () => jouer();
      u.onerror = () => setEnCours(false);
      synth.speak(u);
    };
    jouer();
  };

  const arreter = () => {
    arrete.current = true;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* déjà muet */
    }
    setEnCours(false);
  };

  if (!disponible) return null;

  return (
    <button
      className="coin coin-ecouter"
      onClick={enCours ? arreter : rendre}
      aria-pressed={enCours}
      aria-label={enCours ? "Arrêter la lecture" : "Écouter l'article"}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </svg>
      <span>{enCours ? "Arrêter" : "Écouter"}</span>
    </button>
  );
}
