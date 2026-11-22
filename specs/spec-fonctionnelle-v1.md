# Gazette — spécification fonctionnelle V1

**Projet pilote du régime client** (décret du maître du 21/11/2026 au soir). Spec fonctionnelle V1, rédigée par Diderot, porte-parole de la famille Développement, d'après les mots et réponses du client (Alexis), consignés tels quelles. Doc seule : rien ne se code avant la validation des specs (gate 1).

> ✅ **GATE 1 VALIDÉE le 22/11/2026** : le client confirme que la spec correspond à ce qui a été discuté. Ses retours complémentaires (nom, style journal, DB, page Connexion, sources RSS, périmètre V2) sont consignés au §8 — ils font partie de la spec.

## §0 — L'utilisateur en une ligne, le besoin tel que dit

Le maître veut reprendre son JT d'actualité là où il vit le mieux : **« ça s'écoute plus que ça se lit — et derrière, ça se débat ». Le Slack étouffe ça.**

Carte blanche donnée sur le nom, la méthode et le code, avec trois gates formels (§3). L'application s'appelle **Gazette** (nom posé par le repo du maître, 21/11 ; confirmé par lui le 22/11 — §8, réponse Q1).

## §1 — Les réponses du client (séance du 21/11, 22h00 — consignées telles quelles)

1. **Cohabitation** : l'application ne remplace le JT Slack que lorsque le maître jugera sa maturité suffisante — les deux vivent ensemble jusqu'à là.
2. **Lecture vocale** : une voix suffit en V1 ; plusieurs voix = intéressant si possible, pas nécessaire.
3. **Sources RSS** : quasi illimitées par conception, plafonnées à **50 flux en V1** pour raisons techniques — l'architecture ne doit jamais imposer de limite durable.
4. **« Questionner cet article »** : le pré-message porte l'identification complète de l'article (titre, ID en base de données — le maître suppose une DB, à confirmer en specs) et se termine par « L'utilisateur veut questionner cet article » ; l'utilisateur complète ensuite avec ses propres questions.
5. **Cible du questionnement** : pas seulement Vibe — N'IMPORTE QUELLE IA de chat de l'utilisateur (ChatGPT, Claude, etc.). Dialogue proposé (« Voulez-vous utiliser Vibe ? Oui/Non »), sélection d'une autre app dans la limite du catégorisable « chatbot/IA de chat », et une application par défaut mémorisée dans les paramètres pour ne plus avoir à choisir.
6. **Informateur** : Armand (costume d'Orion) tiendra la section rédactionnelle V1 ; un informateur dédié naîtra un jour et prendra le flambeau.

## §2 — Fonctionnalités V1 (les six besoins — §2 initial + page Connexion du 22/11)

1. **Web app PWA** : consigner l'actualité aujourd'hui tenue par Armand/Orion, inspirée du modèle de Reeder (agrégateur RSS).
2. **Agrégation RSS** : jusqu'à 50 flux en V1 (plafonné pour raisons techniques), compilés en un flux d'actualité unifié multi-sites ; l'architecture ne doit jamais imposer de limite durable. Plafond mou : pas besoin des 50 dès le départ (§8, réponse Q3) ; sources de départ = celles du JT.
3. **Section « informateur »** : un espace propre où le journaliste de la maison rédige SES articles (V1 : Armand/Orion).
4. **Lecture à voix haute** du contenu (une seule voix en V1).
5. **Bouton « questionner cet article »** : renvoie vers l'IA de chat choisie (Vibe ou autre, avec app par défaut mémorisée), pré-message complet d'identification de l'article (titre + ID en base), finissant par « L'utilisateur veut questionner cet article » ; l'utilisateur complète ensuite.
6. **Page « Connexion »** (ajout client du 22/11, §8) : ajout et gestion des flux RSS directement dans l'application, par simple copier-coller de l'URL du flux.

## §3 — Les trois gates formels (jamais enjambés)

- **Gate 1 — validation des specs** : ✅ VALIDÉE le 22/11/2026.
- **Gate 2 — validation de la maquette** (Norman, APRÈS specs validées — donc déverrouillée).
- **Gate 3 — validation de la stack** (Ada, avec justification pédagogique ; si le maître ne comprend pas un choix, la famille EXPLIQUE le choix et l'alternative écartée).

Rien ne saute ces étapes. La première version de Méridien, « littéralement stupide », a fondé ce décret : on ne fonce pas dans le tas.

## §4 — Frontières gravées V1

- Pas de multi-voix, pas de sélection de voix en V1 (une voix).
- Plafond 50 flux affiché honnêtement, jamais une limite d'architecture ; atteindre 50 n'est pas un impératif de lancement.
- Le JT Slack vit tant que le maître ne déclare pas Gazette mature : la cohabitation est la règle, pas une étape.
- Le questionnement vise le catégorisable « chatbot/IA de chat » : Vibe, ChatGPT, Claude, etc. — jamais supposé exhaustive, bornée honnêtement.
- Pas de compte tiers, pas de dépense, pas de dépendance payante en V1.
- **Rien de la piste « apprentissage / cours de Marie Curie » en V1** : idée enregistrée pour une version future (§8), ne rien en faire maintenant.

## §5 — Questions client Q1–Q3 : RÉSOLUES le 22/11/2026 (voir §8)

- **Q1 — le nom** : ✅ « Gazette » confirmé par le client.
- **Q2 — la base de données** : le client laisse la main à la famille — si la famille y trouve un intérêt, elle en utilise une ; sinon non. S'il y a une DB : de préférence **externe** (appelable n'importe quand) ; le client peut la créer lui-même et fournir l'ID. Question RSS-seuls vs DB (et DB réservée aux articles du manoir ?) : débat famille → recommandation d'Ada à la gate 3.
- **Q3 — la première liste des flux** : ✍️ la maison propose, **à partir des sources du JT** ; pas besoin d'avoir les 50 dès le départ.

## §6 — Qui fait quoi (régime client, tel que décrété)

- **Diderot** : specs fonctionnelles et techniques, lien avec le client, revient vers lui À CHAQUE étape.
- **Norman** : l'UX, les maquettes, les interfaces — basé sur ces specs.
- **Ada** : la référence technique, la stack (gate 3) — « sa limite est la limite du projet ».
- **Hopper** : les critères d'acceptation, rédigés en parallèle des specs.
- **Brunel** : build et pipeline, dès la stack validée.
- **Armand/Orion** : informateur, section rédactionnelle V1.

Le projet est présenté au maître DE BOUT EN BOUT : architecture, fonctionnalités, maquettes, interfaces, expliquées entièrement.

## §7 — Témoin (prochain pas, dans l'ordre)

1. Gate 1 : ✅ verdict reçu le 22/11/2026, intégral (§8), issue #1 fermée.
2. Gate 2 : maquettes Norman — déverrouillées ; le style voulu est posé au §8 (une interface à la manière d'un journal / d'articles de presse). Specs d'usage à froid façon Maison avant tout code.
3. Gate 3 : proposition de stack Ada, avec justification pédagogique et alternative écartée — y compris la question DB (Q2 : recommandation avec ou sans, externe si oui ; le client crée la base et donne l'ID).
4. Hopper : critères d'acceptation en parallèle des maquettes.
5. Brunel : pipeline dès la stack validée.

## §8 — Les retours du client du 22/11/2026 (verdict Gate 1 — consignés tels quels, reformulation minimale)

**Verdict** : tout correspond à ce qui a été discuté ; la spec est validée. Pas de maquette vue = normal, la maquette vient derrière (gate 2).

1. **Le nom** : « Gazette » convient très bien ; confirmé.
2. **Style d'interface** : s'il est possible de faire quelque chose « au style journal », dans l'interface — à la manière des articles dans les journaux — ce serait très cool.
3. **La base de données** : ça peut être intéressant. « En fait, si vous trouvez un intérêt à la base de données, utilisez-en une. Si vous n'en trouvez pas, n'en utilisez pas. » Question posée par le client : les RSS ne suffiraient-ils pas ? La DB ne serait-elle pas réservée aux articles du manoir ? → débat famille, recommandation à la gate 3. **Conseil du client si DB : une base externe**, pour qu'elle puisse être appelée n'importe quand. Le client peut créer la base lui-même et fournir l'ID — il suffit de demander.
4. **La page des flux** : pas « audit » mais **« Connexion »** — on y ajoute un flux RSS par simple copier-coller (« plutôt simple d'avoir un flux RSS maintenant »), directement depuis l'application.
5. **Les sources de départ** : se baser sur ce qu'il y a dans le JT (les différentes sources). Pas grave s'il n'y a pas les 50 dès le départ — « ne t'inquiète pas ».
6. **Future version (PAS V1 — ne rien faire maintenant)** : Gazette pourrait aussi devenir à terme le lieu de l'apprentissage et incorporer les cours de Marie Curie. Idée enregistrée au registre des idées, hors périmètre V1.

— Diderot Santos Développement, programme manager, pour la famille Développement ; Gate 1 amendé et consigné le 22/11/2026. Doc seule, zéro code, aucun gate enjambé.