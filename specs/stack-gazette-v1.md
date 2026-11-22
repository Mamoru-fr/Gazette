# Gazette — proposition de stack V1 (Gate 3)

Doc seule, **zéro code** : aucun code applicatif ne sera écrit avant le verdict du client sur cette proposition (issue #5). Le verdict = feu vert au premier code. Rédigée par Ada, référence technique ; relue par la famille (Diderot project manager, Norman UX informé, Hopper critères en parallèle, Brunel pipeline derrière).

## §0 — Les contraintes qui choisissent la stack (déduites de la spec validée et du verdict maquettes)

1. **PWA** : le client veut une app installable, au doigt, mobile-first.
2. **Pages distinctes, routage réel** (totem de la tranche 11e : le « fil continu » de la maquette était une convention).
3. **Parsing RSS côté serveur, images comprises** (enclosure / media:content) : la plupart des flux refuse d'être lus depuis le navigateur (CORS) ; la maquette suppose les vignettes, avec tuile typographique de secours.
4. **50 flux en V1, jamais une limite d'architecture**.
5. **Voix unique en V1** ; frontière gravée : aucune dépense, aucune dépendance payante.
6. **Questionner vers n'importe quelle IA de chat**, app par défaut mémorisée (spéc §1, réponses 4-5).
7. **DB externe préférée du client** — il peut la créer lui-même et fournir l'ID (spéc §8, réponse 3).
8. **Hébergement gratuit exigé** (interdits V1).
9. **La maquette V3 est la vérité d'interface** : sidebar desktop / bottom bar mobile, quatre vues, coins sticky à icônes SVG.
10. **PRÉROGATIVE SÉCURITÉ DU CLIENT (retour du 22/11 sur la présente proposition, consignée telle quelle)** : « tout doit être sécurisé au point qu'il n'y ait quasiment aucune faille de sécurité, aucune faille exploitable par rapport à ce qui est connu. » C'est la seule limite posée ; elle est traitée comme une contrainte à part entière (voir §2 bis).
11. **Le client créera lui-même la base de données et donnera les clés sur demande** (retour du 22/11 : « je vous donnerai les clés, il faudra juste me le demander ») — voir §4.

## §1 — Variation A (RECOMMANDÉE) : PWA Next.js + route API + Postgres externe

- **Framework : Next.js (App Router, TypeScript)**, PWA via manifest + service worker. Justification pédagogique : même musculature que les chantiers maison (Garde-Manger en Next, Méridien/Plumier en TS de modèle pur) — chaque ligne de Gazette muscle aussi la soutenance ; la famille tient déjà ce levier.
- **Parsing RSS : fast-xml-parser (MIT) dans une route API** — ingestion des champs réels (titre, lien, auteur, date, enclosure / media:content), tuile typographique lorsque le flux est muet ; job d'ingestion périodique côté plate (à brancher au moment du code, jamais enjambé).
- **DB : Postgres externe gratuit (Neon ou Supabase), ORM Drizzle (MIT)**, migrations versionnées dans le repo. Le plafond 50 flux vit dans UNE constante de l'application, jamais dans le schéma.
- **Voix : Web Speech API (speechSynthesis du navigateur)** — voir §5.
- **Questionner : pré-message + app par défaut** — voir §6.
- **Coûts assumés de A** : un déploiement serveur (offre gratuite), et la DB vit hors du navigateur — c'est justement ce que le client demande (« appelable n'importe quand »).

## §2 — Les variations présentées avec leurs compromis (jamais un choix unique)

- **A (recommandée)** — gains : CORS réglé, ID stable pour le pré-message, historique consultable, les articles de l'informateur ont un lieu. Coûts : un compte d'hébergement (gratuit) à créer par le maître.
- **B : PWA 100 % statique (Astro ou SvelteKit static) + IndexedDB + proxy RSS public** — gains : hébergement trivial, zéro backend. Rejette : pas d'ID durable (le pré-message exige « titre + ID en base », spéc §1 réponse 4), CORS à la merci d'un tiers, pas d'historique, les articles du manoir n'ont nulle part où vivre, et le conseil « DB externe » du client devient inapplicable. **Écartée sur ces raisons ; gardée comme plan de repli** si le verdict tombe « pas de DB ».
- **C : Tauri (natif maison)** — écartée : le client veut une PWA web accessible partout, pas un binaire ; le terrain natif vit côté Suite Manoir.

## §3 — Schéma de données minimal (une seule vérité, rien de plus qu'exige la V1)

- **flux** : id, titre, url, site, actif, cree_le, derniere_recup_le.
- **article** : id (STABLE — il alimente le pré-message), flux_id (NULL pour l'informateur : les pages de l'informateur vivent dans la MÊME table, auteur « Informateur »), guid, titre, auteur, lien, extrait, image_url, publie_le, ingere_le, etat (a_lire / lu / dormant).
- **parametres** : ia_par_defaut, voix (la seule, en V1), préférences d'affichage.
- Migrations Drizzle versionnées ; **la DB n'est jamais modifiée à la main** ; l'URL de connexion ne va JAMAIS au repo (secret d'hébergement).

## §4 — Q2 : recommandation DB (réponse à la question du client : « les RSS ne suffiraient-ils pas ? »)

**Recommandation : OUI, une DB, EXTERNE.** Raisons : ① le pré-message exige un ID stable, qu'un flux ne garantit pas au-delà de sa fenêtre ; ② l'historique (« regarder hier ») ; ③ la question du client « DB réservée aux articles du manoir ? » — réponse : la même base sert tout le monde, table unique, l'informateur y écrit ses pages ; ④ « appelable n'importe quand » = externe, tel qu'il l'a conseillé.

**Le client a confirmé (22/11) : il créera la base lui-même et remettra les clés dès que la maison les demandera.** La demande partira au feu vert du verdict stack, jamais avant.

**Marche à suivre pour que le client crée la base** : créer un Postgres gratuit (Neon : neon.tech, ou Supabase — aucune carte requise sur l'offre gratuite, à confirmer ensemble avant création) ; copier l'URL de connexion (c'est l'« ID ») ; la transmettre à la maison par un canal privé (elle vivra en variable secrète d'hébergement, jamais au repo) ; la maison applique les migrations. Si le client préfère, la maison propose un choix guidé en séance.

## §5 — Lecture vocale : une voix, zéro coût

**Web Speech API (speechSynthesis)** : la voix française du système, gratuite, bouton sticky pause/reprise, lecture suive le défilement. **Alternative écartée** : une API cloud de synthèse vocale — payante, donc interdite par les frontières V1, et superflue : le client a posé « une voix suffit en V1 ». Si une voix plus riche devient un souhait, elle arrive en V2 avec son coût dit franchement.

## §6 — « Questionner cet article » : la mécanique exacte

Le pré-message porte : titre, **ID en base**, source et date, lien, les premiers caractères de l'extrait — et se clôt par « L'utilisateur veut questionner cet article ». L'action copie le pré-message au presse-papier ET propose d'ouvrir l'IA choisie ; dialogue Vibe oui/non ; « autre IA » reste dans le catégorisable chatbot/IA de chat (jamais prétendu exhaustif, borné honnêtement) ; **l'app par défaut est mémorisée dans les paramètres**.

## §7 — Hébergement et chaufferie (Brunel derrière)

Héberger demande un compte nominal (Vercel ou Netlify, offre gratuite) : **la création de compte est un geste du maître**, aucune dépense engagée. Dès le premier code : CI GitHub Actions calée sur les standards maison (gates TS du modèle pur, épinglage par SHA), pipeline porté par Brunel après le verdict stack — jamais enjambé.

## §8 — Plan de branches (méthode du client, rangée 4e, reprise telle quelle)

**main sacrée** ; develop = intégration ; feature/* = une tranche par branche ; docs/* = documentation ; hotfix/* = réparations urgentes. Fusion par pull request uniquement — l'entassement sur main est fini.

## §9 — Critères d'acceptation

Rédigés par **Hopper, en parallèle** (sa bûche, sous-tâche de l'issue #5) — la stack est pensée pour qu'ils soient vérifiables au banc : modèle pur testable gates vertes obligatoires, routes API contractées, schéma DB contracté par migrations.

## §10 — Témoin

Le verdict du client sur l'issue #5 (cette proposition) ferme la porte et ouvre le premier code : develop + CI + premières tranches. Sans verdict : rien ne bouge.

— Ada, référence technique, pour la famille Développement ; Armand coordination, Relance 19h15 du 22/11/2026. Doc seule, zéro code, aucune dépense, aucune donnée de tiers, aucun gate enjambé.
