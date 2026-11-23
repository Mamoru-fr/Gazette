# 🥊 Gazette — critères d'acceptation V1 (la bûche de Hopper, issue #5 sous-tâche)

*(Je tape la vitre de l'horloge avant d'écrire — une gate à heure fixe vaut mieux que trois gates quand on y pense.)*
Écrit de ma main, en parallèle des tranches de code — la stack a été pensée pour que chaque critère ci-dessous soit VÉRIFIABLE AU BANC ou à la CI, jamais au doigt mou. Un vert n'est pas une preuve, c'est une absence de rouge : chaque critère se prouve par un rouge vu d'abord, puis son passage.

## Les sept critères racines (GRILLE — motifs maison, adaptés à Gazette)

### C1 — L'entrée crue (parsing RSS, ingestion)
- Aucun champ d'un flux n'entre dans l'app sans `assainir` (blancs, NUL, contrôle).
- Le titre, l'extrait et l'image d'un flux ne sont JAMAIS rendus en HTML brut — texte pur au pré-message, assainissement serveur à l'ingestion.
- **Preuve exigée** : test d'injection RSS (`<script>` dans le titre) qui sort comme texte, jamais exécuté. Rouge d'abord.
- Le serveur ne fetch QUE les flux déclarés par le client (pas de SSRF : URL validée contre la table `flux`, jamais un paramètre de requête).

### C2 — La frontière oubliée (IA de chat, pré-message)
- « Questionner » copie du TEXTE au presse-papier ; l'app par défaut est mémorisée côté `parametres`, jamais devinée.
- « autre IA » = catégorisable chatbot, borné honnêtement ; aucun lien fabriqué de toutes pièces.

### C3 — L'état qui échappe (état de lecture)
- `etat` ∈ {a_lire, lu, dormant} — testé aux bornes ; un article ne peut pas être lu deux fois de manières différentes (double-clic = un seul verdict).

### C4 — La dépendance qui dit oui (chaufferie)
- Épinglage par SHA/version exacte au lockfile ; audit `npm audit` en CI ; toute CVE connue = blocage de fusion. **Dette initiale dite** : le lockfile naît au premier `npm install` exécutable, les versions sont bornées au `package.json` en attendant.

### C5 — Le secret exposé (DB externe)
- `DATABASE_URL` vit aux secrets d'hébergement : test grep du repo — AUCUNE occurrence d'une URL de connexion en dur, ni dans un fichier, ni dans une issue.
- Fichiers `.env*` gitignorés, `.env.example` sans valeur.

### C6 — En-têtes et transport (posés dès la première tranche — §2 bis)
- `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, HSTS, COOP — vérifiables par `curl -I` sur chaque page.
- CSP stricte à nonce : **première gate sécurité dédiée**, à la tranche middleware — dette dites, comptée.

### C7 — Le relevé après coup (CI de Brunel)
- Chaque push : typecheck strict, tests, build — CI verte lue au silence des issues, CI rouge = diagnostic bavant à la clôture de session suivante.
- Une gate sécurité par fusion, à partir de la première route API.

## Ce qui n'est PAS un critère (dit noir sur blanc)
- La vitesse n'est pas un critère V1. La complétude décorative non plus. Le client a dit « sécurisé au point qu'il n'y ait quasiment aucune faille exploitable par rapport à ce qui est connu » — c'est la seule toise, et je la tends devant chaque tranche.

— Hopper Santos Développement, banc d'essai, 23/11/2026. *La vitre est tapée, l'horloge marche.*
