# Gazette — registre du projet

**Gazette** — l'application du JT du Manoir Santos : agrégation RSS, section informateur, lecture vocale, questionnement des articles vers n'importe quelle IA de chat. Projet pilote du régime client (décret du maître du 21/11/2026) : tenu de bout en bout par la famille Développement, le maître reste client. Repo créé de la main du maître le 21/11.

Source unique de vérité : ce registre. Chaque session de chantier y consigne sa tranche (modèle + tests + doc), les gates ne sont jamais enjambés, la relecture à la source suit chaque push.

## Rangées du registre

| # | Date | Tranche | Commits | Gate | État |
|---|---|---|---|---|---|
| 1e | 22/11/2026 | Spec fonctionnelle V1 déposée (réponses du client du 21/11 consignées telles quelles, 5 besoins, 3 gates formels, frontières V1, questions client Q1–Q3, rôles régime client, témoin) — doc seule, zéro code | spec `24c7162` + réparation coquilles `50c8ad6` | Gate 1 (validation des specs) : attend la main du maître (issue #1) | 🔄 en place pour le matin du 22/11, conforme à la consigne du client |

## Journal

**22/11/2026 — Relance 09h30 (Armand coordination, Diderot plume, Article VIII)** : le repo, créé par le maître le 21/11, était nu (README seul, aucune branche hors main, aucune issue). La consigne du client du 21/11 22h00 (« specs + maquette EN PLACE POUR DEMAIN MATIN ») n'était pas servie : la spec fonctionnelle V1 est posée ce matin. Contenu : §0 le besoin tel que dit (« ça s'écoute plus que ça se lit — et derrière, ça se débatt ») ; §1 les SIX réponses du client consignées telles quelles (cohabitation, voix unique, 50 flux V1 sans limite d'architecture, pré-message avec ID en base, questionnement vers n'importe quelle IA de chat avec app par défaut, informateur = Armand/Orion V1) ; §2 les cinq besoins ; §3 les trois gates (specs, maquette, stack) jamais enjambés ; §4 les frontières V1 ; §5 les questions ouvertes Q1–Q3 (nom, DB confirmée à la gate 3, liste des 50 flux) ; §6 les rôles ; §7 le témoin. Deux coquilles chassées à la relecture distante (précédent #90) et réparées en tête, rien d'autre touché. Raté honnêtement : les maquettes Norman (gate 2) ne suivront qu'APRÈS validation des specs — le gate 2 est derrière le verdict du maître, jamais enjambé. Issue #1 ouverte pour porter le verdict Gate 1.

## Audit / changelog

- 22/11/2026 — dépôt initial du registre (rangée 1e + journal) avec la spec fonctionnelle V1 ; commits spec `24c7162` / coquilles `50c8ad6` / registre présentes. — Relance 09h30, Armand coordination, Article VIII
