# ABRSON — China Services Portal

Plateforme premium de services B2B et étudiants pour la Chine : transferts d'argent, sourcing produit, accompagnement académique et business setup.

---

## 🗂 Structure du projet

```text
china-services-portal/
├── index.html              ← Accueil (cinematic multi-scene)
├── etudes.html             ← Études en Chine (refonte complète)
├── transfert.html          ← Transfert d'argent
├── sourcing.html           ← Sourcing produit
├── cargo.html              ← Cargo / Logistique (nouveau)
├── business.html           ← Business Setup
├── about.html              ← À propos
├── contact.html            ← Contact (Conciergerie Premium)
│
├── css/
│   ├── style.css           ← Styles globaux (cinematic system)
│   ├── etudes.css          ← Styles exclusifs page Études (namespace 'et-')
│   └── cargo.css           ← Styles exclusifs page Cargo (namespace 'et-' partagé)
│
├── js/
│   ├── main.js             ← Logique globale (GSAP, Lenis, Lucide, guards)
│   ├── etudes.js           ← Animations exclusives page Études
│   └── vendor/
│       ├── gsap.min.js
│       ├── ScrollTrigger.min.js
│       ├── lenis.min.js
│       └── lucide.min.js
│
└── assets/
    ├── logo.png
    ├── etudes_hero.png     ← Image hero générée par IA (campus universitaire)
    ├── cargo_hero.png      ← Image hero page Cargo (container ship)
    ├── hero_bg_*.png
    ├── student_group.png
    ├── student_grad.png
    └── scenes/
        ├── scene_1.png
        ├── scene_3_university.png
        └── ...
```

---

## 🎨 Système de design

### Palette de couleurs

| Rôle | Couleur | Hex |
| :--- | :--- | :--- |
| Fond principal | Midnight | `#0D1117` |
| Fond secondaire | Midnight Sec | `#161B27` |
| Accent principal | China Red | `#C41E3A` |
| Accent luxe | Liquid Gold | `#D4AF37` |
| Accent luxe clair | Gold Light | `#F1D279` |
| Texte principal | White | `#FFFFFF` |
| Texte secondaire | Silver | `#94A3B8` |

### Typographie

- **Display / Titres** : Fraunces (serif italique) — `font-family: 'Fraunces'`
- **Corps / Interface** : Manrope (sans-serif) — `font-family: 'Manrope'`

### Dépendances JS (locales — pas CDN)

- GSAP v3.12.5
- ScrollTrigger v3.12.5
- Lenis v1.0.42
- Lucide Icons

---

## 🛡️ Audit Qualité & Vérification (02/03/2026)

Suite à la revue de direction et aux optimisations de mise en page, les métriques suivantes ont été établies pour garantir une densité business maximale.

### 📐 Métriques de Densité (Études - Version Finale)

| Élément | Valeur V2 (Zig-Zag) | Valeur Finale (Grid) | Impact |
| :--- | :--- | :--- | :--- |
| Hauteur Hero | `90vh` | `100vh` (Restaurée) | Pleine immersion visuelle |
| Position Texte Hero | `Padd: 2rem` | `Margin: -8vh` | Texte haut, impact immédiat |
| Style Services | Zig-Zag (Story) | Grille Horizontale | Style "À la carte" ultra-compact |
| Espacement Section | `5rem` | `3.5rem` | Densité maximale sans scroll inutile |

### 👁️ Visibilité des Arrière-plans

| Couche | Opacité Max Précédente | Opacité Max Nouvelle | Résultat |
| :--- | :--- | :--- | :--- |
| Overlay Hero | `0.95` | `0.82` | Image plus vibrante, profondeur retrouvée |
| Overlay Domaines | `0.90` | `0.72` | Visuel universitaire plus présent |

### ⚡ Stabilité JavaScript

- **Initialisation Unique** : Ajout d'une condition dans `main.js` pour neutraliser l'instance Lenis globale si la classe `.etudes-page` est détectée. L'instance de `etudes.js` prend le relais exclusif.
- **Menu Mobile Universel** : Refonte du sélecteur burger pour cibler dynamiquement `.main-nav` (Home) ou `.et-header__nav` (Études).
- **Zéro Console Throws** : Tests effectués sur Desktop et Mobile (Chrome DevTools).

---

## 📋 Historique des modifications

### 🚢 Session Cargo — Création & Finalisation (29-30/05/2026)

#### 📄 Nouveaux fichiers créés

- **`cargo.html`** — Page Logistique / Cargo complète
- **`css/cargo.css`** — Feuille de style dédiée (design system partagé avec namespace `et-`)

#### 🎨 Design & Interface

- **Hero Section** : Layout deux colonnes (texte à gauche, carte CTA à droite) aligné sur le modèle de `etudes.html` (`.hero-form-side`, 380px, padding 40px/30px, border-radius 24px)
- **Palette unifiée** : Synchronisation complète avec le thème Midnight/Gold du site — ajout de `--et-gold-light: #F1D279` dans `cargo.css` pour harmoniser les jaunes avec les autres pages
- **Bouton CTA** (`Je veux envoyer un colis`) : Police réduite à `0.85rem`, `white-space: nowrap`, gap optimisé pour tenir sur une seule ligne
- **Stats flottantes** : Bande de statistiques en overlap sur le hero (même logique que `etudes.html`)
- **Grille de services** : 3 colonnes de cartes glassmorphiques avec hover doré
- **Bouton "Nous contacter"** : Converti de lien `<a>` en `<button>` avec même déclencheur que le bouton principal. Styles `.btn` et `.btn-gold:hover` ajoutés dans `cargo.css` pour l'animation curseur/survol

#### 🔀 Formulaire Multi-Étapes (Modal)

Architecture inspirée du formulaire `Tester mon éligibilité` de `etudes.html` :

- **Étape 1 — Type de colis** :
  - Petit objet (vêtement, tissu, airpod, assiettes...)
  - Objet dangereux (batterie, liquide ou inflammable...)
  - Appareil électronique cat. 1 (ordinateur, écran TV, projecteur...)
  - Appareil électronique cat. 3 (téléphone, tablette, appareil sensible...)
  - Titre de catégorie en gras avec exemples en sous-ligne

- **Étape 2 — Option de transport** :
  - Format : `Standard (1 à 2 mois)` + icône bateau 🚢 (jaune doré)
  - Format : `Rapide (8 à 12 jours)` + icône avion ✈️ (jaune doré)
  - Format : `Ultra rapide (5 jours)` + icône éclair ⚡ (jaune doré)
  - Icônes Lucide colorées avec `var(--et-gold-light)`

- **Étape 3 — Destination** : Brazzaville, Pointe-Noire, Kinshasa

- **Étape Analyse** : Barre de progression animée avec messages d'état dynamiques

#### 🧮 Logique de tarification (`calculatePrice()`)

| Catégorie | Standard / Rapide | Ultra rapide |
| :--- | :--- | :--- |
| Petit objet | 10 000 (Bzv) / 11 500 (PNR) / 10 500 (KIN) Fcfa | 14 000 Fcfa (Congo) / 21$ (KIN) |
| Objet dangereux | 13 000 Fcfa/kg (toutes dest.) | 14 000 Fcfa (Congo) / 21$ (KIN) |
| Élec. cat. 1 | 35 000 Fcfa/kg (toutes dest.) | 14 000 Fcfa (Congo) / 21$ (KIN) |
| Élec. cat. 3 | 15 000 Fcfa (toutes dest.) | 14 000 Fcfa (Congo) / 21$ (KIN) |

#### 🚢 Gestion spéciale Transport Maritime (Standard)

- Si l'utilisateur choisit **Standard (Bateau)** : le prix n'est **pas affiché** (tarif en CBM non calculable automatiquement — 280 000 Fcfa/CBM)
- Message de remplacement : *"discutez des détails du prix avec nos agents"*
- Apparition d'un second bouton `Voir devis autre transport` (outline gold) qui relance le formulaire pour comparer avec un mode aérien
- Pour **tous les autres transports** : comportement normal avec affichage du prix estimé

#### 🖥️ Affichage du Devis Final

- Texte de synthèse avec variables clés en couleur `--et-gold-light` (catégorie, transport, destination)
- Prix large et contrasté en jaune doré
- Disposition verticale : texte en haut, prix en bas (pour éviter les débordements horizontaux)

#### 🔗 Intégration WhatsApp

- Bouton CTA final : **"Se faire suivre par un agent"** → ouvre WhatsApp avec message structuré contenant : type de colis, transport choisi, destination, estimation de prix
- Le message envoie automatiquement toutes les données du formulaire au numéro ABRSON

#### 🐛 Corrections de Bugs

- **Superposition de l'écran de devis lors du retour** : `prevStep()` masque désormais systématiquement les vues `analysisStep`, `successStep` avant de naviguer en arrière — corrigé aussi sur `etudes.html`
- **Bouton "Nous contacter"** sans animation de survol : ajout de `cursor: pointer` + transition dans `cargo.css`
- **Confettis de `etudes.html` qui se relançaient à chaque rechargement** : `showFinalResult()` accepte maintenant un paramètre `triggerConfetti = false` lors de la restauration de session — les confettis ne se déclenchent qu'une seule fois, lors de la validation réelle
- **Fermeture de modal** : ajout de `resetModal()` à l'événement de fermeture pour éviter tout état incohérent à la réouverture

---

### ✅ Session Animation Slider — (02/03/2026)

- **UI/UX** : Implémentation d'une animation "Page-Turn" (tourne-page) sur le slider de la Scène 2 (`index.html`).
  - Ajout de perspective 3D (`perspective: 2000px`) et `transform-style: preserve-3d`.
  - Animation GSAP `rotateY: -110deg` pour simuler le basculement d'une page.
  - Correction du clipping via `overflow: visible` sur le conteneur du slider.

### ✅ Session Manager Audit — Corrections (02/03/2026)

- **JS** : Neutralisation Lenis doublon sur Études + Correction sélecteur menu mobile.
- **CSS** : Réduction des paddings de sections et headers (-20%).
- **UI** : Adoucissement des gradients d'overlay pour valoriser les visuels premium.

### ✅ Session Refonte Études — Version initial (02/03/2026)

... (Suite des modifications précédentes) ...

#### 🔴 Corrections JavaScript globales (`js/main.js`)

- **Ajout de guards DOM** sur tous les sélecteurs GSAP/ScrollTrigger critiques :
  - `#scene-2`, `.modern-slider-container`, `.step-item`, `#scene-4`, `.reveal-final`, `#scene-5`
  - Correction de `.scroll-progress` (guard ajouté)
  - Guard sur `.sourcing-gate` et `.sourcing-flow .flow-line`
- **Consolidation** des `DOMContentLoaded` en un seul listener consolidé
- **Suppression des doublons** de la fonction `initStudiesSignature` (ancienne version)
- Toutes les fonctions page-spécifiques (`initStudiesSignature`, `initConciergeSignature`, `initBridgeSignature`, `initSourcingSignature`) sont maintenant appelées dans un seul listener

#### 🎓 Refonte Complète `etudes.html`

- **Reconstruction totale** depuis zéro (aucune ligne de l'ancienne page conservée)
- Structure : 5 sections claires (Hero, Services, Domaines, Bourses, CTA)
- Namespace CSS dédié `et-` pour éviter tout conflit avec `style.css`
- Correction de la typo Lucide : `stethosocpe` → `stethoscope`

#### 🎨 Création `css/etudes.css` (nouveau fichier)

- Thème **Cinématique Midnight** (#0D1117) — texte toujours lisible
- Cartes glassmorphic avec hover au **gold** et glow rouge
- Domain pills interactives avec hover China Red
- Fenêtre "terminal" pour la section Bourses (dots rouge/jaune/vert)
- Section CTA avec glow radial animé
- **Entièrement responsive** (mobile, tablette, desktop)

#### ✨ Création `js/etudes.js` (nouveau fichier)

- Lenis dédié à la page (durée 1.4s, easing exponentiel)
- Animations d'entrée hero (GSAP timeline staggerée)
- Parallax sur l'image hero (scrub 1.5)
- Scroll reveals génériques + stagger sur cards, pills, scholar rows
- **Compteur animé** sur les stats du trust bar (99%, +200, 4)
- Glow CTA pulsant (gsap yoyo repeat)
- Guard `etudes-page` class — ne s'exécute que sur la page études

#### 📸 Asset généré

- `assets/etudes_hero.png` — Image de campus universitaire chinois générée par IA (cinématique, golden hour)

---

## 🚀 Lancer localement

Ouvrir directement les fichiers HTML dans un navigateur, ou utiliser un serveur local :

```bash
# Option 1: Python
python -m http.server 8080

# Option 2: Node (http-server)
npx http-server . -p 8080

# Option 3: Node (server.js local)
node server.js
```

Puis naviguer vers : `http://localhost:3000`

---

## 🧩 Pages & Classes CSS Body

| Page | Classe body | Fichier JS dédié | CSS dédié |
| :--- | :--- | :--- | :--- |
| Accueil | `cinematic-home premium-site` | `main.js` | `style.css` |
| Études | `etudes-page` | `etudes.js` | `etudes.css` |
| Cargo | `premium-site` | inline `<script>` | `cargo.css` |
| Transfert | `premium-site transfer-page` | `main.js` | `style.css` |
| Sourcing | `premium-site sourcing-page` | `main.js` | `style.css` |
| Contact | `premium-site contact-page` | `main.js` | `style.css` |
| À propos | `premium-site about-page` | `main.js` | `style.css` |

---

Designed & built by ABRSON Design System — 2026

Designed & built by ABRSON Design System — 2026
