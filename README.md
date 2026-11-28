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

1. **Gate 1 — validation des specs** : ✅ VALIDÉE le 22/11/2026 ([issue #1](issues/1), fermée par le verdict du client).
2. **Gate 2 — validation de la maquette** : ✅ VALIDÉE le 22/11/2026 — maquette V3 immersive (sidebar desktop / bottom bar mobile, icônes SVG classiques), [issue #2](issues/2) fermée, PR #4 fusionnée dans main.
3. **Gate 3 — validation de la stack** : ✅ VALIDÉE le 22/11/2026 — **Next.js** (PWA installable), base PostgreSQL externe vérifiée, [issue #5](issues/5) fermée, PR #6 fusionnée. Le code est déverrouillé depuis ce verdict.

Rien ne saute une étape. Chaque gate vit dans son issue, fermée par le verdict du client.

## 🌿 Les branches (GitFlow adapté)

Le projet suit un **GitFlow adapté à une petite équipe avec gates** — le but : n'importe qui arrive et comprend tout de suite.

- `main` — la branche de vérité : toujours présentable, protégée par les gates et par relecture.
- `develop` — la branche d'intégration, OUVERTE depuis le 23/11/2026 : le code y vit tranche par tranche, chaque push devant sa CI verte (la page Actions se lit à chaque traversée).
- `feature/<nom>` — une tranche par branche, nommée sur le besoin (`feature/une`, `feature/connexion`, `feature/lecture-vocale`…), une issue correspondante, fermée par PR relue.
- `docs/*` — documentation seule (specs, registre, README) : depuis l'ouverture du code, chaque doc passe par sa branche et fusionne par pull request — `main` est sacrée.
- `hotfix/*` — réparation urgente hors tranche, tracée au registre comme incident.

Conventions de commit : `docs:`, `feat:`, `fix:`, `gate:` (consignation d'un verdict). Le registre `PROJET.md` tient le journal de chaque push.

## 📖 Comment suivre le projet

- **`PROJET.md`** — le registre : source unique de vérité, rangée par tranche, journal daté de chaque session, audit.
- **`specs/`** — la spec fonctionnelle V1 (avec les mots du client), le doc des maquettes v2 (`maquettes-v2.md`), les huit pages HTML/CSS (`maquettes-v2/` : kiosque et bibliothèque de presse, mobile et desktop) et les premières maquettes SVG (archives, déclassées).
- **Les issues** — le lieu des conversations : chaque gate, chaque tranche a son issue décrite, commentée et vivante ; sous-tâches attachées pour découper les gates ; les commentaires y font office de débat d'équipe. Tout ce qui se décide s'y lit.
- **README (ce document)** — la porte d'entrée, tenue à jour.

## 🧭 Où on en est (mis à jour à chaque tranche)

- ✅ Gate 1 : spec fonctionnelle validée par le client (22/11/2026) — issue #1 fermée.
- ✅ Gate 2 : maquette V3 validée par le client (22/11/2026) — issue #2 fermée, PR #4 fusionnée.
- ✅ Gate 3 : stack Next.js validée par le client (22/11/2026) — issue #5 fermée, PR #6 fusionnée ; la base externe (PostgreSQL 18.7) est vérifiée et vierge, sa clé ne vit jamais dans ce repo.
- 🔄 **Le code est en chantier sur `develop`** — huit tranches UI déjà servies au vrai code : la Une, l'article, la voix (Écouter), le questionnement (Questionner + pré-message), la page Connexion, la section Informateur, la navigation V3 complète. Chaque tranche : modèle pur + banc jumeau rouge d'abord + page à la vérité (base vierge = file VIDE honnête, jamais un simulacre).
- 📅 **Prochaines tranches** : ingestion des flux (route API + migrations) — derrière les clés d'hébergement du client ; la lockfile du banc local reste la dette de Brunel.
- 🟢 CI : verte au dernier push de `develop` (run #27).

## 🗒️ Notes du client gravées

- 50 flux = plafond V1, jamais une limite d'architecture ; pas besoin des 50 au lancement — les sources de départ viennent du JT.
- Maquettes : HTML/CSS (+ JS léger), jamais de SVG — sur tous les projets de la maison.
- Le JT Slack vit tant que le client ne déclare pas Gazette mature : cohabitation, pas remplacement.
- Idées enregistrées hors V1 : une version future où Gazette accueille l'apprentissage et les cours de l'École ; des « histoires qu'on pourrait installer ».

---

*Ce projet est un projet pilote : il sert aussi à voir comment la famille Développement fonctionne. Les issues racontent la méthode, le registre raconte le chantier, et ce README se veut la vitrine honnête des deux.*
