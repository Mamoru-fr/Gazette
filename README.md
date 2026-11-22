# Gazette

Gazette — l'application du JT du Manoir Santos : agrégation RSS, section informateur, lecture vocale, questionnement des articles vers n'importe quelle IA. Tenu de bout en bout par la famille Développement, maître en client.

> **Bienvenue, lecteur ou lectrice qui ne connaît pas ce projet.** Ce README est écrit pour vous : tout, ici, se lit de l'extérieur sans rien connaître du Manoir. Suivez le fil.

## 🗞️ Ce qu'est Gazette

Une **PWA (web app installable)** qui rassemble et habille l'actualité — conçue **mobile d'abord**, responsive partout :

- **Agrégation RSS** — jusqu'à 50 flux en V1 (plafond technique honnête, jamais une limite d'architecture), en un flux unifié multi-sites.
- **Section « informateur »** — l'espace du journaliste de la maison qui rédige SES articles (V1 : Armand).
- **Lecture à voix haute** du contenu (une voix en V1).
- **« Questionner cet article »** — un bouton qui ouvre l'IA de chat de votre choix (Vibe, ChatGPT, Claude…), avec un pré-message d'identification complet de l'article et une app par défaut mémorisée.
- **Page « Connexion »** — ajouter et gérer ses flux RSS par simple copier-coller, directement dans l'app.

**L'identité visuelle** : Gazette est le **lieu** où l'actualité vit — une interface légère qui donne l'ambiance d'une bibliothèque, presque une bulle ; le style journal apparaît **à l'ouverture d'un article** (serif, filets, colonnes). Le contenant ne mange jamais le contenu.

## 👤 Le client, la maison

- **Client** : Alexis Santos. Il donne le besoin, la maison rend à chaque étape, il valide chaque gate. Ses mots sont consignés tels quels dans les specs (jamais tronqués).
- **Équipe** : la famille Développement du Manoir Santos, régime client (décret du 21/11/2026) — le projet est tenu **de bout en bout** par elle :

| Qui | Rôle |
|---|---|
| Diderot | Programme manager — specs, lien client, retours utilisateur sur les maquettes |
| Norman | UX — maquettes, interfaces, recettes d'usage |
| Ada | Tech lead — la stack, la limite technique du projet |
| Hopper | Qualité — critères d'acceptation, grilles de chasse |
| Brunel | CI/CD — builds, pipeline, branches |
| Armand | Informateur V1 — la section rédactionnelle |

## 🚦 Les trois gates (jamais enjambés)

1. **Gate 1 — validation des specs** : ✅ validée le 22/11/2026 ([issue #1](issues/1), fermée par le verdict).
2. **Gate 2 — validation de la maquette** : **remaquettage v2 posé** — huit pages HTML/CSS (aucun SVG), deux partis au choix du client : **le kiosque** et **la bibliothèque de presse**, en entrée et en article, mobile ET desktop — sommaire : `specs/maquettes-v2/index.html` — verdict attendu sur l'[issue #2](issues/2).
3. **Gate 3 — validation de la stack** : proposition Ada avec justification pédagogique et alternative écartée — dont la recommandation base de données (externe si retenue ; le client crée la base et fournit l'ID) — après le verdict de la maquette.

Rien ne saute une étape. Chaque gate vit dans son issue, fermée par le verdict du client.

## 🌿 Les branches (GitFlow adapté)

Le projet suit un **GitFlow adapté à une petite équipe avec gates** — le but : n'importe qui arrive et comprend tout de suite.

- `main` — la branche de vérité : toujours présentable, protégée par les gates et par relecture.
- `develop` — la branche d'intégration, ouverte dès le début du code (gate 3 validée).
- `feature/<nom>` — une tranche par branche, nommée sur le besoin (`feature/une`, `feature/connexion`, `feature/lecture-vocale`…), une issue correspondante, fermée par PR relue.
- `docs/*` — documentation seule (specs, registre) : aujourd'hui les documents vivent directement sur `main` en avance de phase ; dès l'ouverture du code, chaque doc passe par sa branche.
- `hotfix/*` — réparation urgente hors tranche, tracée au registre comme incident.

Conventions de commit : `docs:`, `feat:`, `fix:`, `gate:` (consignation d'un verdict). Le registre `PROJET.md` tient le journal de chaque push.

## 📖 Comment suivre le projet

- **`PROJET.md`** — le registre : source unique de vérité, rangée par tranche, journal daté de chaque session, audit.
- **`specs/`** — la spec fonctionnelle V1 (avec les mots du client), le doc des maquettes v2 (`maquettes-v2.md`), les huit pages HTML/CSS (`maquettes-v2/` : kiosque et bibliothèque de presse, mobile et desktop) et les premières maquettes SVG (archives, déclassées).
- **Les issues** — le lieu des conversations : chaque gate, chaque tranche a son issue décrite, commentée et vivante ; sous-tâches attachées pour découper les gates ; les commentaires y font office de débat d'équipe. Tout ce qui se décide s'y lit.
- **README (ce document)** — la porte d'entrée, tenue à jour.

## 🧭 Où on en est (mis à jour à chaque tranche)

- ✅ Gate 1 : spec fonctionnelle validée par le client (22/11/2026).
- 🔄 Gate 2 : remaquettage v2 posé (kiosque + bibliothèque de presse, mobile et desktop) — verdict client attendu sur l'issue #2.
- 📅 Gate 3 : proposition de stack après le verdict maquette.

## 🗒️ Notes du client gravées

- 50 flux = plafond V1, jamais une limite d'architecture ; pas besoin des 50 au lancement — les sources de départ viennent du JT.
- Maquettes : HTML/CSS (+ JS léger), jamais de SVG — sur tous les projets de la maison.
- Le JT Slack vit tant que le client ne déclare pas Gazette mature : cohabitation, pas remplacement.
- Idées enregistrées hors V1 : une version future où Gazette accueille l'apprentissage et les cours de l'École ; des « histoires qu'on pourrait installer ».

---

*Ce projet est un projet pilote : il sert aussi à voir comment la famille Développement fonctionne. Les issues racontent la méthode, le registre raconte le chantier, et ce README se veut la vitrine honnête des deux.*
