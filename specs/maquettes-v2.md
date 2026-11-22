# Gazette — maquettes v2 (Gate 2, remaquettage)

Retour client du 22/11 intégralement servi : **HTML/CSS (+ JS léger), aucun SVG en maquette**, **mobile ET desktop distincts**, architecture **« lieu de stockage → ouverture d'article »**, et la nuance gravée en séance : **une interface légère qui donne une ambiance, presque une bulle de bibliothèque — jamais un chrome qui mange le texte, jamais du texte brut non plus.**

## Palette — la recherche (retour client : la peau actuelle ne donne pas envie de lire)

Recherche menée sur les couleurs qui donnent envie de lire ; constats sourcés :

- **Fond** : jamais de blanc pur (#FFFFFF) — un **blanc cassé chaud** (crème, pêche, sépia) réduit la fatigue et améliore la vitesse de lecture (étudelisée sur 341 lecteurs : fonds chauds > fonds froids) ; le sépia est la référence des liseuses.
- **Texte** : jamais de noir pur — un **gris très foncé** (contraste modéré, cible 7:1 à 10:1 pour le corps) ; le contraste reste LE facteur n°1.
- **Accent** : **une seule teinte vive**, réservée à la hiérarchie (kickers, liens, actions).
- **Nuit** : gris foncé (#121212-à-#191922), jamais noir pur (halation) — piste bonus, la V1 peut naitre claire.

**Quatre palettes proposées au client** (laboratoire interactif : `palette-lab.html`, même kiosque, changement de peau en un clic) :

| Peau | Fond | Encre | Accent | Esprit |
|---|---|---|---|---|
| **Encre fraîche** (posée par défaut) | #fdfcf8 | #1f1d1a | bleu #0b57d0 | le journal du matin, contemporain |
| **Crème** (retenue par le client) | #f8f3e7 | #37312a | terracotta #b4551e | la lampe de bibliothèque, chaleureux |
| **Sépia** | #f3ead6 | #40352a | ambre #9a6b2f | la liseuse, le papier qui a vécu |
| **Nuit** | #191922 | #e9e4d8 | ambre #f0b44f | la lecture du soir (bonus, pas V1 obligée) |

Sources : ReadingQuick (« Best Text and Background Colors for Reading Speed », étude 341 lecteurs) ; Wellfr (contraste et fond chaud) ; FreeApexGears (contraste optimal 7:1–10:1, jamais pur/pur) ; Tristate Blind (verts doux/blancs chauds, jamais pur) ; UX StackExchange (fil historique « best color combination for on-screen reading ») ; RGAA/WCAG (4.5:1 minimum, 7:1 AAA).

## Les images — la demande du client (retour du 22/11, deuxième vague)

« Si tu peux mettre une image sur la gauche, ça permettrait de rajouter du contexte et un peu de vie… normalement, plein de fois, tu as des images via les flux RSS. » Le client cite **Reeder** comme référence. Constat sourcé : les flux RSS portent souvent une illustration (champ `<enclosure>` / media:content), et Reeder en fait son pain quotidien — jusqu'à supprimer l'idée même de non-lu pour ne laisser que la lecture ([Reeder](https://reederapp.com/), [MacStories, « Reeder: A New Approach to Following Feeds »](https://www.macstories.net/reviews/reeder-a-new-approach-to-following-feeds/)).

Conséquence gravée dans les partis de la piste douce : **vignette à gauche de chaque entrée** (issue des flux), avec **tuile typographique de secours** quand le flux n'a pas d'image (JS léger) — jamais d'image cassée, jamais de bloc vide.

## Les cinq partis (variations d'une même intention — le client tranche)

**A — le kiosque** (structure magazine — le client la dit « trop brute » : maintenue en variante, plus la piste principale) : une dense, le journal vit ENTIÈREMENT dans la page article.
- `kiosque-entree-desktop.html` · `kiosque-entree-mobile.html` · `kiosque-article-{desktop,mobile}.html`

**C — la file douce, illustrée** (piste principale ; peau : Crème) : une FILE qui respire — salutation, lecture estimée du jour, article de tête, entrées aérées **avec vignette à gauche (à la Reeder)**, FIN assumée (« le reste dort sans honte ») plus un bouton « hier ». Inspirée de Matter, Readwise Reader, my-rss-reader (bocan), Instapaper.
- `file-entree-desktop.html` · `file-entree-mobile.html`

**D — la file des moments** (nouveau 22/11, deuxième vague) : même file, même air, mais le contenant raconte la JOURNÉE — trois chapitres doux (« Pour le matin, avant le bruit », « Pour la pause de l'après-midi », « Pour le soir, quand tout ralentit »), chacun avec son compte de textes et de minutes. Le contenant ne dit pas « optimise », il dit « voilà comment ta journée peut se lire ».
- `moments-entree-desktop.html` · `moments-entree-mobile.html`

**E — la une installée** (nouveau 22/11, deuxième vague) : la page ouvre sur une GRANDE image de tête (celle de l'article de une) puis la file illustrée ; chaque entrée porte une **note de l'informateur** — une ligne en italique qui dit POURQUOI ce texte est là. Le contenant apporte du contexte et une voix, sans toucher au texte.
- `une-installee-desktop.html` · `une-installee-mobile.html`

**B — la bibliothèque de presse** : LA PIÈCE des journaux — sources en étagères, chacune ouvre SA gazette. L'article porte un petit masthead de sa source. (Idée « histoires installées » notée, hors V1.)
- `biblio-entree-desktop.html` · `biblio-entree-mobile.html` · `biblio-article-{desktop,mobile}.html`

## Ce que montre chaque page

- La barre : marque discrète, flux comptés honnêtement (7 / 50, jamais une limite d'architecture), nav Aujourd'hui · Informateur · Connexion.
- L'entrée : salutation, date, lecture estimée, fin douce + « hier ».
- Les images : `<img>` des flux (vignettes), `loading="lazy"`, tuile de secours typographique si le flux est muet (JS léger).
- L'article (partis A/B) : source · date · heure · **ID en base** ; bouton **Questionner** (dialogue Vibe oui/non, autre IA, défaut mémorisé) ; **Écouter** : une seule voix (V1).
- `index.html` : sommaire cliquable ; `palette-lab.html` : laboratoire de palettes.

## Lignes de coupure restantes (au client)

- **Le parti** : A, B, C, D, E, ou un mélange (C/D/E partagent la même colonne, seul le contenant change).
- La peau : Crème retenue séance tenante — confirmable.
- Typographie finale (Georgia en attendant le feu vert).
- Ordre de la une : chronologique strict ou manchette choisie.
- Le sort de la note de l'informateur (E) : élément de contenant à garder ou couper.

## Témoin

① verdict du client sur les CINQ partis, les images et la peau (issue #2) ; ② Ada : champs RSS réels (dont images `enclosure`) et leur mise en forme, recommandation DB (Q2) ; ③ Hopper : critères d'acceptation en parallèle ; ④ zéro code applicatif avant la stack validée.

— Norman (écrans), Diderot (banc des retours), séance directe du 22/11/2026, deuxième vague.