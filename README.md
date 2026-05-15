# Sea Bumpers — Site vitrine

Site vitrine pour Sea Bumpers, un projet de rangement étanche fabriqué à partir de pare-battages marins recyclés.

## Lancer le site

Double-clique sur `index.html` — il s'ouvre dans ton navigateur. Aucune installation requise.

Pour le mettre en ligne (gratuit, 30 secondes) : va sur [app.netlify.com/drop](https://app.netlify.com/drop) et glisse-dépose le dossier complet.

## Structure du projet

```
sea-bumpers/
├── index.html          ← page unique du site
├── styles.css          ← tout le design
├── script.js           ← animations et interactions
├── README.md           ← ce fichier
├── CONTEXT.md          ← contexte business (produit, vision)
├── CONTINUE.md         ← infos pour un futur assistant IA qui reprend le projet
└── assets/
    └── images/
        ├── logo.jpg        ← logo "S" rouge corail
        ├── pradet.jpg      ← photo du port du Pradet (hero)
        ├── lifestyle.jpg   ← photo lifestyle (femme à la plage)
        └── product.png     ← photo produit ouvert fond noir
```

## Sections du site

1. **Hero** — port du Pradet en fond, logo, titre, tagline
2. **Concept** — storytelling upcycling marin
3. **Produit** — bouée dessinée en SVG qui s'ouvre au scroll (animation principale)
4. **Usages** — kayak, paddle, randonnée, escalade
5. **Modèles** — 3 variantes (50cm, 30cm, sphère 50cm)
6. **Manifesto** — citation
7. **Contact** — email
8. **Footer**

## Stack technique

- HTML5 + CSS3 + JavaScript vanilla (zéro framework, zéro build)
- Google Fonts (Cormorant Garamond + Inter) via CDN
- Marche complètement en local (`file://`)
- Responsive (mobile-first, breakpoints à 980px et 720px)
- Animations : IntersectionObserver pour le reveal, scroll-driven pour l'ouverture du produit

## Personnaliser rapidement

**Changer les couleurs** — `styles.css` ligne ~35 :
```css
--coral: #C45D52;   /* rouge corail */
--navy:  #1B2A3A;   /* bleu marine */
--sand:  #FAF7F2;   /* fond beige clair */
```

**Changer le texte** — modifier `index.html` directement.

**Changer l'email de contact** — chercher `hello@seabumpers.fr` dans `index.html`.
