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
├── business.html           ← Business Setup
├── about.html              ← À propos
├── contact.html            ← Contact (Conciergerie Premium)
│
├── css/
│   ├── style.css           ← Styles globaux (cinematic system)
│   └── etudes.css          ← Styles exclusifs page Études (namespace 'et-')
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
```

Puis naviguer vers : `http://localhost:8080/etudes.html`

---

## 🧩 Pages & Classes CSS Body

| Page | Classe body | Fichier JS dédié |
| :--- | :--- | :--- |
| Accueil | `cinematic-home premium-site` | `main.js` |
| Études | `etudes-page` | `etudes.js` |
| Transfert | `premium-site transfer-page` | `main.js` |
| Sourcing | `premium-site sourcing-page` | `main.js` |
| Contact | `premium-site contact-page` | `main.js` |
| À propos | `premium-site about-page` | `main.js` |

---

Designed & built by ABRSON Design System — 2026
