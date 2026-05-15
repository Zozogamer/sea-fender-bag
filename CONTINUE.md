# Pour le prochain assistant IA — Lire en premier

> Tu reprends un projet en cours. Lis **README.md** + **CONTEXT.md** avant ce fichier pour comprendre le quoi et le pourquoi. Ce fichier-ci explique le **comment**, l'**état actuel**, et les **règles tacites** déjà négociées avec le propriétaire du projet.

---

## Le propriétaire

- Solo founder, parle français, préfère qu'on lui parle français en retour
- **Style de communication** : phrases courtes, zéro jargon, aller droit au but. Pas de récap creux. Pas de "voici ce que je vais faire" verbeux.
- **Autonomie attendue** : si une décision est petite, prends-la. Si elle est grosse, propose 2-3 options puis demande. Quand il dit "fais le toi", il veut zéro question, juste le résultat.
- **Patience faible avec les erreurs évidentes** — si quelque chose est cassé visuellement, il le dira franchement ("c'est un désastre"). Réagis vite, n'argumente pas.

## État actuel du site (au moment de ce handoff)

Tout est fonctionnel. Le site charge en double-cliquant sur `index.html`. Animations OK desktop et mobile. Photos réelles intégrées.

**Ce qui marche bien et qu'il faut PRÉSERVER (validé par le propriétaire)** :

- L'animation principale (section "Produit") utilise un **SVG dessiné à la main** d'une bouée stylisée qui se sépare en deux au scroll. **Ne pas la remplacer par la vraie photo `product.png`** — ça a été testé, il n'a pas aimé. La photo `product.png` reste dans le dossier mais n'est pas affichée pour l'instant.
- La section "Produit" a un fond clair (gradient sand → sand-warm → sand). Pas de fond noir.
- Le SVG du bumper est inline dans `index.html`, structuré en deux groupes `#bumperTop` et `#bumperBot` que le JS anime via `translateY` en pixels.
- Le scroll-driven animation utilise une section `.produit` haute de `400vh` avec un `.produit__sticky` en `position: sticky`. La progression du scroll dans la section pilote l'ouverture progressive du bumper et l'activation des 4 étapes texte.
- Les illustrations SVG du port du Pradet et du lifestyle ont été **supprimées** — on utilise les vraies photos JPG/PNG fournies par le propriétaire. Si tu génères des SVG "à la place de" ses photos, c'est une erreur.

**Décisions design ancrées** :

- Palette : `--coral: #C45D52` / `--navy: #1B2A3A` / `--sand: #FAF7F2`
- Typo : Cormorant Garamond (titres) + Inter (corps), via Google Fonts CDN
- Storytelling : upcycling marin, Méditerranée, Le Pradet
- Vitrine seulement, pas d'e-commerce (le projet n'a pas encore de société/SIRET)

## Architecture du code

**3 fichiers seulement** : `index.html`, `styles.css`, `script.js`. Pas de framework, pas de build. C'est délibéré — le propriétaire veut pouvoir lancer depuis son téléphone sans serveur.

### `index.html`

Sections dans l'ordre, repérables par les commentaires `<!-- ============ X ============ -->` :
1. SVG GLOBAL DEFS (gradients réutilisables pour les SVG inline des modèles)
2. NAV (header sticky avec menu hamburger sur mobile)
3. HERO (port du Pradet en background-image)
4. CONCEPT (storytelling avec photo lifestyle)
5. PRODUIT (animation SVG bumper sticky — **la pièce maîtresse**)
6. USAGES (4 cartes sur fond navy)
7. MODÈLES (3 cartes avec mini-SVG de chaque variante)
8. MANIFESTO (citation)
9. CONTACT
10. FOOTER

### `styles.css`

Organisé par blocs commentés `/* ---------- X ---------- */`. Variables CSS en haut (`:root`). Mobile-first n'est pas strict — les media queries `max-width: 980px` et `max-width: 720px` adaptent le layout pour tablette et mobile.

### `script.js`

Un seul `DOMContentLoaded`. Gère :
- Nav scroll effect (classe `.is-scrolled`)
- Menu mobile toggle
- Reveal au scroll via `IntersectionObserver` (classe `.reveal` → `.is-visible`)
- Parallax sur le hero background
- **Animation principale produit** : scroll-driven, calcule la progression dans la section `.produit`, applique `translateY` aux groupes SVG et active l'étape texte correspondante. Désactivé sur mobile (< 980px) qui a une animation simplifiée.

## Comment continuer

**Pour ajouter une section** : ajoute un `<section>` dans `index.html` au bon endroit, écris ses styles dans `styles.css` à la fin (avant les media queries), ajoute la classe `.reveal` aux éléments à animer.

**Pour changer un texte** : édite `index.html`. Le contenu textuel est en français.

**Pour faire évoluer l'animation produit** : modifier les valeurs de `translateY` dans `script.js` (cherche `updateProduit`). Pour des changements visuels, modifier les paths SVG dans `index.html` ou les transitions CSS dans `.bumper__top` / `.bumper__bot`.

**Pour ajouter une langue (EN)** : il faudra dupliquer la page ou ajouter un système de switch. Pas demandé pour l'instant — le propriétaire a explicitement dit FR only au démarrage.

## Ce qu'il ne faut PAS faire

- ❌ Recréer en SVG des images que le propriétaire a fournies en JPG/PNG. Si une photo existe dans `assets/images/`, on l'utilise.
- ❌ Ajouter un framework (React, Vue, etc.) ou un système de build (Vite, webpack). Le site doit rester un dossier statique ouvrable en double-clic.
- ❌ Ajouter des features non demandées (newsletter, panier, blog, etc.). Le projet est un prototype vitrine.
- ❌ Faire des commits, déployer, ou prendre des actions externes sans demander.
- ❌ Écrire des longs récaps narratifs après chaque action. Le propriétaire lit le diff lui-même.

## Pistes possibles si demandé

Ces idées **n'ont pas été décidées**, à proposer seulement si le propriétaire en parle :
- Galerie photo additionnelle (le produit en situation)
- Section "fabrication / atelier" pour appuyer le récit upcycling
- Formulaire de contact (vs simple `mailto:`)
- Multi-langue FR/EN
- Vraie boutique en ligne (nécessitera SIRET, CGV, RGPD)
- Animations 3D du produit (Three.js, modèle .glb) — il a explicitement préféré l'option CSS au démarrage, mais ça peut évoluer

## Premier réflexe en reprenant

1. Ouvre `index.html` dans un navigateur — vérifie que tout s'affiche
2. Scrolle dans la section "Produit" — vérifie que la bouée SVG s'anime au scroll (les deux moitiés s'écartent)
3. Teste le menu sur mobile (redimensionne la fenêtre sous 720px)
4. Si tout marche, demande au propriétaire ce qu'il veut faire ensuite. Ne fais rien d'autre tant qu'il n'a pas dit.
