# Gazette

Gazette — l'application du JT du Manoir Santos : agrégation RSS, section informateur, lecture vocale, questionnement des articles vers n'importe quelle IA. Tenu de bout en bout par la famille Développement, maître en client.

> **Bienvenue, lecteur ou lectrice qui ne connaît pas ce projet.** Ce README est écrit pour vous : tout, ici, se lit de l'extérieur sans rien connaître du Manoir. Suivez le fil.

## 🗞️ Ce qu'est Gazette

Une **PWA (web app installable)** qui rassemble et habille l'actualité :

- **Agrégation RSS** — jusqu'à 50 flux en V1 (plafond technique honnête, jamais une limite d'architecture), compilés en un flux unifié multi-sites.
- **Section « informateur »** — l'espace du journaliste de la maison qui rédige SES articles (V1 : Armand).
- **Lecture à voix haute** du contenu (une voix en V1).
- **« Questionner cet article »** — un bouton qui ouvre l'IA de chat de votre choix (Vibe, ChatGPT, Claude…), avec un pré-message d'identification complet de l'article et une app par défaut mémorisée.
- **Page « Connexion »** — ajouter et gérer ses flux RSS par simple copier-coller, directement dans l'app.

**L'identité visuelle : le journal.** Masthead serif, filets, colonnes — les articles se lisent comme la une d'un quotidien.

## 👤 Le client, la maison

- **Client** : Alexis Santos. Il donne le besoin, la maison rend à chaque étape, il valide chaque gate. Ses mots sont consignés tels quels dans les specs (jamais tronqués, jamais « trimétrés »).
- **Équipe** : la famille Développement du Manoir Santos, régime client (décret du 21/11/2026) — le projet est tenu **de bout en bout** par elle :

| Qui | Rôle |
|---|---|
| Diderot | Programme manager — specs, lien client, retour au client à chaque étape |
| Norman | UX — maquettes, interfaces, recettes d'usage |
| Ada | Tech lead — la stack, la limite technique du projet |
| Hopper | Qualité — critères d'acceptation, grilles de chasse |
| Brunel | CI/CD — builds, pipeline, branches |
| Armand | Informateur V1 — la section rédactionnelle |

## 🚦 Les trois gates (jamais enjambés)

1. **Gate 1 — validation des specs** : ✅ validée le 22/11/2026 ([issue #1](issues/1)).
2. **Gate 2 — validation de la maquette** : maquettes posées, verdict client attendu ([issue #2](issues/2)).
3. **Gate 3 — validation de la stack** : proposition Ada avec justification pédagogique et alternative écartée — après le verdict de la maquette.

Rien ne saute une étape. Chaque gate vit dans son issue, fermée par le verdict du client.

## 🌿 Les branches (GitFlow adapté)

Le projet suit un **GitFlow adapté à une petite équipe avec gates** — le but : n'importe qui arrive et comprend tout de suite.

- `main` — la branche de vérité : toujours présentable, protégée par les gates et par relecture.
- `develop` — la branche d'intégration, ouverte dès le début du code (gate 3 validée).
- `feature/<nom>` — une tranche par branche, nommée sur le besoin (`feature/une`, `feature/connexion`, `feature/lecture-vocale`…), une issue correspondante, fermée par PR relue.
- `docs/*` — documentation seule (specs, registre) : aujourd'hui les documents vivent directement sur `main` en avance de phase ; dès l'ouverture du code, chaque doc passe par sa branche.
- `hotfix/*` — réparation urgente hors tranche, tracée au registre comme incident.

Conventions de nommage en tête de commit : `docs:`, `feat:`, `fix:`, `gate:` (consignation d'un verdict). Le registre `PROJET.md` tient le journal de chaque push.

## 📖 Comment suivre le projet

- **`PROJET.md`** — le registre : source unique de vérité, rangée par tranche, journal daté de chaque session, audit.
- **`specs/`** — la spec fonctionnelle V1 (avec les mots du client) et les maquettes (document + SVG).
- **Les issues** — le lieu des conversations : chaque gate, chaque tranche a son issue décrite, commentée et vivante ; sous-tâches attachées pour découper les gates ; les commentaires y font office de débat d'équipe. Tout ce qui se décide s'y lit.
- **README (ce document)** — la porte d'entrée, tenue à jour.

## 🧭 Où on en est (mis à jour à chaque tranche)

- ✅ Gate 1 : spec fonctionnelle validée par le client (22/11/2026).
- 🔄 Gate 2 : maquettes posées (trois vues : la Une, l'article, Connexion) — verdict client attendu sur l'issue #2.
- 📅 Gate 3 : proposition de stack (dont la question de la base de données, externe si retenue) après le verdict maquette.

## 🗒️ Notes du client gravées

- 50 flux = plafond V1, jamais une limite d'architecture ; pas besoin des 50 au lancement — les sources de départ viennent du JT.
- Le JT Slack vit tant que le client ne déclare pas Gazette mature : cohabitation, pas remplacement.
- Idée enregistrée hors V1 : une version future où Gazette accueille aussi l'apprentissage et les cours de l'École.

---

*Ce projet est un projet pilote : il sert aussi à voir comment la famille Développement fonctionne. Les issues racontent la méthode, le registre raconte le chantier, et ce README se veut la vitrine honnête des deux.*
