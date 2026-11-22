# Gazette — maquettes v2 (Gate 2, remaquettage)

Retour client du 22/11 intégralement servi : **HTML/CSS (+ JS léger), aucun SVG en maquette**, **mobile ET desktop distincts**, architecture **« lieu de stockage → ouverture d'article »**, et la nuance gravée en séance : **une interface légère qui donne une ambiance, presque une bulle de bibliothèque — jamais un chrome qui mange le texte, jamais du texte brut non plus.**

## Les deux partis (variations d'une même intention — le client tranche)

**A — le kiosque** : l'entrée est une une dense — un article de tête, puis les titres en colonnes serrées. Zéro décor ; le style journal vit ENTIÈREMENT dans la page article (colonne unique, lettrine, pied Écouter / Questionner).
- `kiosque-entree-desktop.html` · `kiosque-entree-mobile.html` · `kiosque-article-{desktop,mobile}.html`

**B — la bibliothèque de presse** : l'entrée est LA PIÈCE des journaux — sources rangées en étagères, chacune ouvre SA gazette (sa une à lui). L'article porte un petit masthead de sa source. Une ligne rappelle que les étagères savent accueillir, à terme, des histoires installées (idée notée, rien en V1).
- `biblio-entree-desktop.html` · `biblio-entree-mobile.html` · `biblio-article-{desktop,mobile}.html`

## Ce que montre chaque page

- La barre : marque discrète, flux comptés honnêtement (7 / 50, jamais une limite d'architecture), nav Kiosque · Bibliothèque · Informateur · Connexion.
- L'article (même esprit, habillé par parti) : source · date · heure · **ID en base** ; le bouton **Questionner** ouvre (JS léger) le dialogue décrété : *Vibe ? Oui/Non — autre IA — par défaut mémorisée*, avec le pré-message complet visible tel qu'il partira ; **Écouter** : une seule voix (V1), pas de sélecteur.
- `index.html` : le sommaire cliquable des huit pages.

## Lignes de coupure restantes (au client)

- Typographie finale (Georgia en attendant le feu vert sur une autre serif).
- Ordre de la une : chronologique strict (posé) ou manchette choisie.
- Mode sombre : posé papier clair seul en V1.
- Le parti : A, B, ou le mélange (une bibliothèque dont la première étagère est un kiosque).

## Témoin

① verdict du client sur ces huit pages (issue #2 — son verdict la ferme et ouvre la Gate 3) ; ② Ada : les champs RSS réels et leur mise en forme, recommandation DB (Q2, externe si retenue — le client crée et donne l'ID) ; ③ Hopper : critères d'acceptation en parallèle ; ④ zéro code applicatif avant la stack validée.

— Norman (écrans), Diderot (banc des retours, le Goût passé : les deux partis gardés, la faute contenant>contenu corrigée au double), séance directe du 22/11/2026.