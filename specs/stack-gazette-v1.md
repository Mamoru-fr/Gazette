# Gazette — proposition de stack V1 (Gate 3)

Doc seule, **zéro code jusqu'au verdict** : le verdict du client est RENDU — **Next.js retenu (22/11)**, issue #5 fermée, premier code déverrouillé. Rédigée par Ada, référence technique ; relue par la famille (Diderot project manager, Norman UX informé, Hopper critères en parallèle, Brunel pipeline derrière).

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
12. **DÉCRET DU CLIENT SUR LA COURBE D'APPRENTISSAGE (verdict du 22/11, consigné tel quel)** : « réapprendre » une stack (Nuxt, Astro, SvelteKit…) n'est JAMAIS un argument ni une excuse — la famille apprend une stack neuve TRÈS VITE (GitHub, documentation), et chaque stack maîtrisée ouvre un champ supplémentaire pour les prochains outils du manoir. Ce critère ne départage plus rien ci-dessous.
13. **VERDICT STACK (22/11)** : le client passe sur **Next.js** (« on peut passer sur du Next.js comme ce qui est proposé ») et laisse à la maison l'arbitrage « soit Next.js, soit Tauri pour suivre le manoir » — tranché au §2 ter : **Next.js pour Gazette V1**, Tauri piste future.

## §1 — Le ring : cinq stacks sérieuses, avantages et inconvénients (retour client du 22/11 : « proposer différentes stacks, voir les avantages et les inconvénients, puis faire une zone consensus, au risque que le fichier soit plus long » — servi)

Toutes les cinq remplissent les conditions minimales (PWA installable, routes serveur pour le parsing RSS hors CORS, TypeScript, hébergement gratuit, DB externe connectable). Ce qui les départage est propre à GAZETTE : le lecteur vocal, le contenu NON FIABLE des flux, et le régime maison (le code muscle aussi la soutenance RNCP). **Note du verdict (contrainte n°12)** : la courbe d'apprentissage d'une stack neuve ne compte plus au départage — les mentions de « muscle maison » dans les notes ci-dessous sont des constats d'expérience, JAMAIS des arguments ni des excuses ; chaque stack neuve maîtrisée est un champ ouvert pour les prochains outils du manoir.

### 1. Next.js 15 (React, App Router) — note maison : 19/20
**Avantages** : écosystème n°1 (tutos, bibliothèques, réponse à tout problème) ; route handlers + middleware = parsing RSS propre et **en-têtes de sécurité centralisés** ; Vercel gratuit natif avec cron gratuit pour l'ingestion périodique ; PWA outillée ; **musculature maison déjà là** (Garde-Manger en Next, TS modèle pur : chaque ligne muscle la soutenance).
**Inconvénients** : la plus grosse surface d'abstractions (RSC, cache, bundler) = plus à surveiller aux montées de version ; dépendances nombreuses, donc périmètre à auditer plus large ; réglages de sécurité à poser explicitement (rien n'est strict par défaut).

### 2. React Router 7 (ex-Remix, React) — note maison : 17/20
**Avantages** : la voie de la sobriété web (standards, formulaires/actions, peu de magie) ; CSP stricte facile à tenir ; même tribu React que la maison ; adapters sur la plupart des plateformes gratuites.
**Inconvénients** : renommé/restructuré récemment (Remix → RR7), documentation en transition ; outillage PWA/offline plus artisanal ; cron à fabriquer côté hébergeur ; moins de main courante que Next.

### 3. SvelteKit (Svelte) — note maison : 16/20 — le dauphin honnête
**Avantages** : bundle minimal = **moins de code exécuté = moins de surface d'attaque** ; syntaxe simple, performances superbes ; adapters gratuits (Vercel/Netlify/Node) ; ambiance « calm » qui sied à Gazette.
**Inconvénients** : la famille n'a pas ce muscle (courbe entière à payer, y compris pour la soutenance) ; écosystème plus petit pour PWA/lecteur vocal ; moins de matériel de révision sur les incidents sécurité.

### 4. Nuxt 4 (Vue) — note maison : 16/20
**Avantages** : Vue mature et documentée ; Nitro (server routes) très propre ; hébergement gratuit large ; cron outillé.
**Inconvénients** : aucun muscle maison Vue ; écosystème de modules à auditer un par un (prérogative sécurité : le point noir) ; montée Nuxt 3 → 4 récente (peu de recul).

### 5. Astro 5 (+ islands) — note maison : 15/20
**Avantages** : pensé CONTENU d'abord (l'esprit de Gazette) ; envoie presque rien au navigateur (sécurité et vitesse) ; images first-class ; hébergement statique trivial.
**Inconvénients** : orienté sites statiques : une app à état (lecteur, progression, flux dynamiques) va à contre-courant ; API routes limitées, pas de cron natif ; PWA offline à écrire à la main — le plus de travail serveur des cinq.

## §2 — Zone de consensus

**Ce sur quoi les cinq s'accordent** : PWA possible, parsing serveur possible, DB externe possible, zéro coût, TypeScript. Aucune n'est exclue techniquement : le choix est un ARBITRAGE, pas une vérité.

**Ce qui départage, par ordre de poids pour ce projet** :
1. **La prérogative sécurité (contrainte n°10)** : moins de code et de dépendances = SvelteKit et React Router gagnent en surface d'attaque ; mais l'OUTILLAGE de sécurité mature (middleware central pour CSP/HSTS, vulnérabilités vite patchées, Dependabot bien supporté) favorise Next.js et Nuxt. Bilan : à périmètre de fonctionnalité égale, l'écart se joue sur la DISCIPLINE plus que sur le framework — la §2 bis s'applique aux cinq.
2. **Le cron d'ingestion gratuit** : Next.js (Vercel cron) et Nuxt (Nitro) l'ont natif ; les autres le fabriquent.
3. **La soutenance RNCP** : Next.js est déjà pratiqué (Garde-Manger) — mais depuis le décret du client (contrainte n°12), ce critère est SECONDAIRE : apprendre vite et ouvrir des champs au manoir vaut mieux qu'un muscle de confort ; il ne départage plus.
4. **L'écosystème de secours** (lecteur vocal, PWA offline, incidents) : Next.js largement en tête.

**CONSENSUS DE LA MAISON** : **Next.js reste la recommandation** (muscle + outillage sécurité + cron natif + écosystème), **SvelteKit est le dauphin honnête** si le client préfère la légèreté minimale, **React Router 7** la voie moyenne web-standards. Le client tranche ; son verdict porte TOUTE la famille technique d'un coup. La variation A décrite avant enrichissement (Next.js + fast-xml-parser en route API + Postgres externe + Drizzle + speechSynthesis) reste la déclinaison opérationnelle du choix Next.js.

## §2 bis — La prérogative sécurité, servie en engagements vérifiables (Hopper au banc)

Le contenu RSS est un INTRANT NON FIABLE (texte tiers). Engagements, vérifiables au banc avant chaque fusion :
1. **Dépendances** : épinglage par SHA (déjà standard maison), audit continu (npm audit + Dependabot), zéro dépendance peu maintenue ; toute CVE connue sur une dépendance = blocage de fusion.
2. **En-têtes et transport** : HTTPS uniquement ; CSP stricte (aucun script inline, sources listées), HSTS, X-Content-Type-Options, Referrer-Policy, COOP/CORP — posés AU FRAMEWORK dès la première tranche de code.
3. **Contenu tiers** : le titre, l'extrait et l'image d'un flux ne sont JAMAIS rendus en HTML brut — assainissement serveur à l'ingestion, jamais d'eval ni d'innerHTML direct ; URLs des images et liens validées (pas de SSRF ni d'open redirect : le serveur ne fetch QUE les flux déclarés par le client).
4. **Secrets** : URL de connexion et clés jamais au repo, variables d'hébergement uniquement (transmission par canal privé — le client donne les clés sur demande).
5. **Entrées** : validation stricte de tout ce qui entre (URL de flux, paramètres de routes) ; rate limiting des routes API.
6. **Contrôle** : Hopper tient une grille OWASP Top 10 sur Gazette et UNE GATE SÉCURITÉ obligatoire par fusion ; audit mensuel des dépendances consigné au registre.

## §2 ter — L'arbitrage Tauri, tranché (le client a laissé le choix : « soit Next.js, soit Tauri pour suivre le manoir »)

**Tranché : Next.js pour Gazette V1.** Pourquoi : Gazette est une PWA — installable au doigt (contrainte n°1) SANS passer par un store ni une intégration système ; maj instantanées à chaque visite, pas de version à retélécharger ; le cron d'ingestion RSS vit côté SERVEUR, où Tauri (application cliente) ne peut pas l'héberger gratuitement ; le lien s'ouvre dans n'importe quel navigateur, y compris chez un tiers. Tauri garde tout son sens pour une **version INSTALLÉE** future — convergence naturelle avec Suite Manoir (cœur natif Rust/Tauri), distribution bureau, offline profond : piste notée au registre des idées, HORS V1, jamais fermée.

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

**VERDICT RENDU (22/11) : Next.js.** Le feu vert est donné — issue #5 fermée par le verdict, la porte ouvre sur le premier code : develop + CI + premières tranches. Les engagements §2 bis s'appliquent dès la première ligne.

— Ada, référence technique, pour la famille Développement ; Armand coordination, Relance 19h15 du 22/11/2026. Doc seule, zéro code, aucune dépense, aucune donnée de tiers, aucun gate enjambé.
