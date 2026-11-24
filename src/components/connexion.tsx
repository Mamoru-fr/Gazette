"use client";
import { useState, type FormEvent } from "react";
import type { ConnexionModel, VerdictConnexion } from "../lib/connexion";
import { jugerConnexion } from "../lib/connexion";

/**
 * Gazette — la vue Connexion (rangée 26e), la page « Vos flux » de la
 * maquette V3 validée : ajouter un flux RSS par simple copier-coller,
 * compteur honnête, jamais une limite d'architecture.
 *
 * Le formulaire est BRANCHÉ au modèle pur (jugerConnexion) : chaque
 * geste rend LE verdict entier du modèle — jamais un bouton muet. La
 * vérité de la V1 y est dite : la base est vierge, l'écriture attend
 * l'ingestion (s2) ; le bouton ne prétend PAS connecter, il JUGE la
 * colle. Zéro script inline (CSP à nonce tenue), zéro stockage local :
 * rien n'est retenu qui ne soit pas vrai.
 */
export default function VueConnexion({ model }: { model: ConnexionModel }) {
  const [saisie, setSaisie] = useState("");
  const [verdict, setVerdict] = useState<VerdictConnexion | null>(null);

  const juger = (e: FormEvent) => {
    e.preventDefault();
    setVerdict(jugerConnexion(saisie, []));
  };

  const classeVerdict: string | undefined = verdict
    ? `verdict-connexion ${verdict.etat}`
    : undefined;

  return (
    <div className="wrap">
      <section className="greeting">
        <h1>{model.titre}</h1>
        <p>{model.sousTitre}</p>
      </section>
      <hr className="filet" />
      <form className="ajout" onSubmit={juger}>
        <input
          type="text"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder="https://exemple.fr/feed.xml"
          aria-label="Adresse du flux RSS"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit">Juger cette adresse</button>
      </form>
      {verdict ? <p className={classeVerdict}>{verdict.message}</p> : null}
      {model.lignes.length > 0 ? (
        <ul className="liste-flux">
          {model.lignes.map((f) => (
            <li key={f.id}>
              <span className="puce" aria-hidden="true"></span>
              <span className="flux-marque">{f.marque}</span>
              <span className="flux-url">{f.url}</span>
            </li>
          ))}
        </ul>
      ) : model.vide ? (
        <p className="flux-vide">{model.vide}</p>
      ) : null}
      <p className="compteur-ligne">
        compteur honnête : <strong>{model.compteur}</strong> — le plafond V1
        n&apos;est jamais une limite d&apos;architecture
      </p>
    </div>
  );
}
