# Maquettes V3 — l'application maquette (22/11/2026, génération « immersion »)

La V2 montrait des pages seules. La V3 est **l'application** : on y navigue comme dans l'app, pour s'y immerger au lieu d'imaginer.

## Ouvrir (dans l'ordre du doigt)

- **Desktop** : `app-desktop.html` — **sidebar fixe** (Aujourd'hui · Informateur · Vos flux), l'article s'ouvre dans la même scène.
- **Mobile** : `app-mobile.html` — **app bar** en haut, **bottom bar tactile** en bas (trois onglets), retour à l'article par le lien « ← Aujourd'hui ».

## Ce qui marche dans la maquette (JS léger)

- **Navigation réelle** entre les quatre vues : Aujourd'hui · Article · Informateur · Vos flux.
- **La file illustrée** (mélange des partis validés de V2 : file douce + images des flux à la Reeder + note de l'informateur) ; « charger les textes d'hier » révèle la file d'hier.
- **L'article** : masthead source · date · heure · **ID en base**, image du flux, corps lisible, largeur limitée à ~65 caractères.
- **Écouter** : lecteur simulé (barre de progression, voix unique V1).
- **Questionner** : dialogue avec **pré-message visible** (titre + ID + extrait), choix Vibe / autre IA, case « mémoriser comme choix par défaut ».
- **Informateur** : le briefing du jour, en lettre.
- **Vos flux** : ajout d'un flux **par copier-coller** (l'ajout fonctionne dans la maquette), liste à puce d'état, compteur honnête 7/50.

## Règles de la maison, respectées

HTML/CSS + JS léger, mobile et desktop **distincts**, peau **Crème**. **SVG : réservé aux icônes fines** (volume, point d'interrogation — décret du client au verdict de la gate 2 : des icônes SVG classiques, jamais des émojis) ; jamais en maquette structurelle ; images des flux avec tuile de secours typographique quand le flux est muet.

— Norman à l'écran, Diderot au banc et à l'organisation, 22/11/2026. Sur la branche `feature/maquettes-v3`, fusion dans main par pull request : main reste sacrée.