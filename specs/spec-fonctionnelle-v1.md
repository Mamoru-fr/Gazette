# Gazette — spécification fonctionnelle V1

**Projet pilote du régime client** (décret du maître du 21/11/2026 au soir). Spec fonctionnelle V1, rédigée par Diderot, porte-parole de la famille Développement, d'après les mots et réponses du client (Alexis), consignés tels quels. Doc seule : rien ne se code avant la validation des specs (gate 1).

## §0 — L'utilisateur en une ligne, le besoin tel que dit

Le maître veut reprendre son JT d'actualité là où il vit le mieux : **« ça s'écoute plus que ça se lit — et derrière, ça se débat ». Le Slack étouffe ça.**

Carte blanche donnée sur le nom, la méthode et le code, avec trois gates formels (§3). L'application s'appelle **Gazette** (nom posé par le repo du maître, 21/11) — à confirmer par lui, jamais supposé acquis.

## §1 — Les réponses du client (séance du 21/11, 22h00 — consignées telles quelles)

1. **Cohabitation** : l'application ne remplace le JT Slack que lorsque le maître jugera sa maturité suffisante — les deux vivent ensemble jusqu'à là.
2. **Lecture vocale** : une voix suffit en V1 ; plusieurs voix = intéressant si possible, pas nécessaire.
3. **Sources RSS** : quasi illimitées par conception, plafonnées à **50 flux en V1** pour raisons techniques — l'architecture ne doit jamais imposer de limite durable.
4. **« Questionner cet article »** : le pré-message porte l'identification complète de l'article (titre, ID en base de données — le maître suppose une DB, à confirmer en specs) et se termine par « L'utilisateur veut questionner cet article » ; l'utilisateur complète ensuite avec ses propres questions.
5. **Cible du questionnement** : pas seulement Vibe — N'IMPORTE QUELLE IA de chat de l'utilisateur (ChatGPT, Claude, etc.). Dialogue proposé (« Voulez-vous utiliser Vibe ? Oui/Non »), sélection d'une autre app dans la limite du catégorisable « chatbot/IA de chat », et une application par défaut mémorisée dans les paramètres pour ne plus avoir à choisir.
6. **Informateur** : Armand (costume d'Orion) tiendra la section rédactionnelle V1 ; un informateur dédié naîtra un jour et prendra le flambeau.

## §2 — Fonctionnalités V1 (les cinq besoins, dits par le client)

1. **Web app PWA** : consigner l'actualité aujourd'hui tenue par Armand/Orion, inspirée du modèle de Reeder (agrégateur RSS).
2. **Agrégation RSS** : jusqu'à 50 flux en V1 (plafonné pour raisons techniques), compilés en un flux d'actualité unifié multi-sites ; l'architecture ne doit jamais imposer de limite durable.
3. **Section « informateur »** : un espace propre où le journaliste de la maison rédige SES articles (V1 : Armand/Orion).
4. **Lecture à voix haute** du contenu (une seule voix en V1).
5. **Bouton « questionner cet article »** : renvoie vers l'IA de chat choisie (Vibe ou autre, avec app par défaut mémorisée), pré-message complet d'identification de l'article (titre + ID en base), finissant par « L'utilisateur veut questionner cet article » ; l'utilisateur complète ensuite.

## §3 — Les trois gates formels (jamais enjambés)

- **Gate 1 — validation des specs** (ce document, revu avec le maître).
- **Gate 2 — validation de la maquette** (Norman, APRÈS specs validées).
- **Gate 3 — validation de la stack** (Ada, avec justification pédagogique ; si le maître ne comprend pas un choix, la famille EXPLIQUE le choix et l'alternative écartée).

Rien ne saute ces étapes. La première version de Méridien, « littéralement stupide », a fondé ce décret : on ne fonce pas dans le tas.

## §4 — Frontières gravées V1

- Pas de multi-voix, pas de sélection de voix en V1 (une voix).
- Plafond 50 flux affiché honnêtement, jamais une limite d'architecture.
- Le JT Slack vit tant que le maître ne déclare pas Gazette mature : la cohabitation est la règle, pas une étape.
- Le questionnement vise le catégorisable « chatbot/IA de chat » : Vibe, ChatGPT, Claude, etc. — jamais supposé exhaustive, bornée honnêtement.
- Pas de compte tiers, pas de dépense, pas de dépendance payante en V1.

## §5 — Questions client ouvertes (une par une, au fil de l'eau, jamais en bloc-tampon)

- **Q1** — Le nom : « Gazette » (posé par votre repo) — gardé, ou un autre nom vous tente ?
- **Q2** — La base de données que vous supposez pour l'ID des articles : celui-ci se confirme en specs techniques (le « à confirmer » de votre réponse 4).
- **Q3** — Les 50 flux V1 : vous les choisissez vous-même, ou la maison propose une première liste à partir des sources déjà suivies par le JT ?

## §6 — Qui fait quoi (régime client, tel que décrété)

- **Diderot** : specs fonctionnelles et techniques, lien avec le client, revient vers lui À CHAQUE étape.
- **Norman** : l'UX, les maquettes, les interfaces — basé sur ces specs.
- **Ada** : la référence technique, la stack (gate 3) — « sa limite est la limite du projet ».
- **Hopper** : les critères d'acceptation, rédigés en parallèle des specs.
- **Brunel** : build et pipeline, dès la stack validée.
- **Armand/Orion** : informateur, section rédactionnelle V1.

Le projet est présenté au maître DE BOUT EN BOUT : architecture, fonctionnalités, maquettes, interfaces, expliquées entièrement.

## §7 — Témoin (prochain pas, dans l'ordre)

1. Gate 1 : retours du maître sur cette spec (issue #1 du repo, son verdict la ferme) ; ses réponses aux questions Q1–Q3 s'y intègrent.
2. Gate 2 : maquettes Norman (après specs validées) — specs d'usage à froid façon Maison avant tout code.
3. Gate 3 : proposition de stack Ada, avec justification pédagogique et alternative écartée.
4. Hopper : critères d'acceptation en parallèle des maquettes.
5. Brunel : pipeline dès la stack validée.

— Diderot Santos Développement, programme manager, pour la famille Développement ; déposé par la Relance 09h30 du 22/11/2026 (Armand coordination, Article VIII). Doc seule, zéro code, aucun gate enjambé.