# Gazette — maquettes V1 (Gate 2)

**Gate 2 du régime client** (décret du 21/11 ; Gate 1 validée le 22/11, issue #1 fermée). Maquettes posées par Norman, d'après les specs de Diderot (`specs/spec-fonctionnelle-v1.md`, §2 et §8). Doc seule : zéro code — la stack (gate 3) attend le verdict du client sur ces maquettes (issue #2).

## §0 — Le style voulu, tel que dit

Le client veut une interface « au style journal, à la manière des articles de presse » (§8, réponse 2). Les maquettes prennent le parti inverse de l'agrégateur générique : pas de cartes sur grille, mais **la une d'un journal**. Trois lois d'affichage :

1. **La une d'abord** : le flux unifié se lit comme la une d'un quotidien — un article de tête en grandes lettres, les suivants en colonnes, chaque colonne signée de sa source et de son heure.
2. **L'article est un article** : titre serif, source · date · ID en base en tête, corps en colonne de journal ; les actions (Écouter, Questionner) vivent en bas d'article, sur le pied de page du journal, jamais flottantes.
3. **Le journal a ses pages** : trois pages seulement en V1 — **Une** (le flux), **Informateur** (la page du journaliste de la maison, même gabarit article, marque « informateur »), **Connexion** (la gestion des flux, sobre, un champ copier-coller et la liste).

## §1 — Les trois vues

### Vue 1 — La Une (`specs/maquettes/gazette-vue-une.svg`)
Masthead « GAZETTE » en belle serif, filet double, ligne de date + compteur honnête des flux (ex. « 7 flux connectés — plafond V1 : 50, jamais une limite d'architecture »). Navigation : Une · Informateur · Connexion. Un article de tête, puis trois colonnes d'articles suivants, chacun : titre serif, source, heure. Badge discret « informateur » sur l'édito du majordome qui ouvre la page Informateur.

### Vue 2 — L'article (`specs/maquettes/gazette-vue-article.svg`)
Retour « ‹ Une ». Titre, chapeau, signature « Source · dimanche 22 novembre · ID en base : gzt-481 ». Corps sur colonne unique de journal. En pied, la barre du journal : **Écouter** (une seule voix en V1, §1 réponse 2 — pas de sélecteur) et **Questionner cet article** qui ouvre le dialogue décrété : « Voulez-vous utiliser Vibe ? Oui / Non — Choisir une autre IA (ChatGPT, Claude…) — retenir comme application par défaut » (§1 réponses 4 et 5 : pré-message portant titre + ID, finissant par « L'utilisateur veut questionner cet article », l'utilisateur complète ensuite).

### Vue 3 — Connexion (`specs/maquettes/gazette-vue-connexion.svg`)
La page des flux, nommée « Connexion » par le client (§8, réponse 4 — pas « audit »). Un champ : « Coller l'URL du flux RSS… » + bouton « Connecter ». En dessous, la liste des flux connectés (source, URL, retirer). Le compteur dit le vrai (« 7 / 50 ») et la frontière gravée : le plafond est un chiffre de V1, jamais une limite d'architecture.

## §2 — Recettes d'usage à froid (avant tout code, façon Maison — chacune finit par « ce que j'en fais »)

1. **Ouvrir Gazette le matin** : la une se lit de haut en bas comme un journal, je repère l'article de tête et l'édito du majordome sans chercher. *Ce que j'en fais : je lis le journal, pas une liste de notifications.*
2. **Ajouter un flux** : j'ouvre Connexion, je colle l'URL, Connecter — le flux apparaît, la une se rallonge. *Ce que j'en fais : j'abonne le journal, pas un backend.*
3. **Écouter un article** : en bas de l'article, Écouter — une seule voix lit, je peux quitter l'écran. *Ce que j'en fais : ça s'écoute plus que ça se lit, comme dit le besoin.*
4. **Questionner un article** : Questionner → Vibe ? Oui/Non ou autre IA ; une fois l'app que j'utilise retenue par défaut, le bouton m'y envoie directement avec le pré-message complet (titre + ID + « L'utilisateur veut questionner cet article »). *Ce que j'en fais : ça se débat, dans l'IA que je choisis.*
5. **Lire la page Informateur** : mêmes articles du journal, mais signés du majordome (Orion) — même gabarit, marque « informateur ». *Ce que j'en fais : le journal a sa rédaction maison.*

## §3 — Lignes de coupure (tranchées à deux avec le client, jamais en solo)

- Typographie exacte du masthead et du corps (une serif lisible à l'écran — proposition posée dans les SVG, son œil décide).
- Ordre de la une : chronologique strict (proposé) ou manchette choisie ?
- Mode sombre en V1 ou clair journal seul (proposé : papier clair) ?
- Mobile : colonnes ramenées à une seule (proposé) — la PWA vit d'abord au téléphone.

## §4 — Témoin

① verdict du client sur les maquettes (issue #2) ; ② derrière : proposition de stack Ada (gate 3) avec la recommandation DB (Q2 : externe si oui, le client crée la base et donne l'ID) et la justification pédagogique + alternative écartée ;③ Hopper : critères d'acceptation en parallèle des maquettes ;④ zéro code avant le verdict — jamais enjambé.

— Norman (maquettes), Armand coordination, Relance 12h15 du 22/11/2026. Doc seule, aucun gate enjambé.