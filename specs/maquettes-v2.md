# Gazette — maquettes v2 (Gate 2, remaquettage)

Retour client du 22/11 intégralement servi : **HTML/CSS (+ JS léger), aucun SVG en maquette**, **mobile ET desktop distincts**, architecture **« lieu de stockage → ouverture d'article »**, et la nuance gravée en séance : **une interface légère qui donne une ambiance, presque une bulle de bibliothèque — jamais un chrome qui mange le texte, jamais du texte brut non plus.**

## Palette — la recherche (retour client : la peau actuelle ne donne pas envie de lire)

Le 22/11 au soir, le client dit la structure bonne et minimaliste, la **charte de couleurs** en faute. Recherche menée sur les couleurs qui donnent envie de lire ; constats sourcés :

- **Fond** : jamais de blanc pur (#FFFFFF) — un **blanc cassé chaud** (crème, pêche, sépia) réduit la fatigue et améliore la vitesse de lecture (étudelisée sur 341 lecteurs : fonds chauds > fonds froids) ; le sépia est la référence des liseuses.
- **Texte** : jamais de noir pur — un **gris très foncé** (contraste modéré, cible 7:1 à 10:1 pour le corps) ; le contraste reste LE facteur n°1.
- **Accent** : **une seule teinte vive**, réservée à la hiérarchie (kickers, liens, actions) ; le rouge brique du premier jet vieillissait la page au lieu de l'éclairer.
- **Nuit** : gris foncé (#121212-à-#191922), jamais noir pur (halation) — piste bonus, la V1 peut naitre claire.

**Quatre palettes proposées au client** (laboratoire interactif : `palette-lab.html`, même kiosque, changement de peau en un clic) :

| Peau | Fond | Encre | Accent | Esprit |
|---|---|---|---|---|
| **Encre fraîche** (posée par défaut) | #fdfcf8 | #1f1d1a | bleu #0b57d0 | le journal du matin, contemporain |
| **Crème** | #f8f3e7 | #37312a | terracotta #b4551e | la lampe de bibliothèque, chaleureux |
| **Sépia** | #f3ead6 | #40352a | ambre #9a6b2f | la liseuse, le papier qui a vécu |
| **Nuit** | #191922 | #e9e4d8 | ambre #f0b44f | le lecture du soir (bonus, pas V1 obligée) |

Sources : ReadingQuick (« Best Text and Background Colors for Reading Speed », étude 341 lecteurs) ; Wellfr (contraste et fond chaud) ; FreeApexGears (contraste optimal 7:1–10:1, jamais pur/pur) ; Tristate Blind (verts doux/blancs chauds, jamais pur) ; UX StackExchange (le fil historique « best color combination for on-screen reading ») ; RGAA/WCAG (4.5:1 minimum, 7:1 AAA).

## Les deux partis (variations d'une même intention — le client tranche)

**A — le kiosque** : l'entrée est une une dense — un article de tête, puis les titres en colonnes serrées. Zéro décor ; le style journal vit ENTIÈREMENT dans la page article (colonne unique, lettrine, pied Écouter / Questionner).
- `kiosque-entree-desktop.html` · `kiosque-entree-mobile.html` · `kiosque-article-{desktop,mobile}.html`

**B — la bibliothèque de presse** : l'entrée est LA PIÈCE des journaux — sources rangées en étagères, chacune ouvre SA gazette (sa une à lui). L'article porte un petit masthead de sa source. Une ligne rappelle que les étagères savent accueillir, à terme, des histoires installées (idée notée, rien en V1).
- `biblio-entree-desktop.html` · `biblio-entree-mobile.html` · `biblio-article-{desktop,mobile}.html`

## Ce que montre chaque page

- La barre : marque discrète, flux comptés honnêtement (7 / 50, jamais une limite d'architecture), nav Kiosque · Bibliothèque · Informateur · Connexion.
- L'article (même esprit, habillé par parti) : source · date · heure · **ID en base** ; le bouton **Questionner** ouvre (JS léger) le dialogue décrété : *Vibe ? Oui/Non — autre IA — par défaut mémorisée*, avec le pré-message complet visible tel qu'il partira ; **Écouter** : une seule voix (V1), pas de sélecteur.
- `index.html` : le sommaire cliquable ; `palette-lab.html` : le laboratoire de palettes.

## Lignes de coupure restantes (au client)

- **La peau** : encre fraîche / crème / sépia / nuit — dans `palette-lab.html`, un clic.
- Typographie finale (Georgia en attendant le feu vert).
- Ordre de la une : chronologique strict (posé) ou manchette choisie.
- Le parti : A, B, ou le mélange.

## Témoin

① verdict du client sur les partis ET la peau (issue #2) ; ② Ada : champs RSS réels et leur mise en forme, recommandation DB (Q2) ; ③ Hopper : critères d'acceptation en parallèle ; ④ zéro code applicatif avant la stack validée.

— Norman (écrans), Diderot (banc des retours), séance directe du 22/11/2026.