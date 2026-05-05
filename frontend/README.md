# ÉBENOR CRÉATION - Frontend

Frontend Next.js pour la plateforme ÉBENOR CRÉATION, une solution web haut de gamme pour une usine de fabrication de bois en Tunisie.

## 🚀 Technologies

- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** avec thème luxueux bois/or
- **React Hook Form** pour la gestion des formulaires
- **Headless UI** pour les composants accessibles
- **Framer Motion** pour les animations
- **Axios** pour les appels API

## 📁 Structure du Projet

```
src/
├── app/                    # App Router Next.js
│   ├── (public)/          # Pages publiques (groupées)
│   │   ├── page.tsx       # Page d'accueil
│   │   ├── produits/      # Page produits
│   │   ├── galerie/       # Page galerie
│   │   └── contact/       # Page contact
│   ├── admin/             # Pages administration
│   │   ├── page.tsx       # Dashboard admin
│   │   ├── login/         # Login admin
│   │   ├── products/      # Gestion produits
│   │   └── gallery/       # Gestion galerie
│   ├── layout.tsx         # Layout racine
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── public/           # Composants publics
│   └── admin/            # Composants admin
├── lib/                  # Utilitaires et configurations
├── hooks/                # Hooks React personnalisés
└── types/                # Types TypeScript
```

## 🎨 Thème et Design

### Palette de Couleurs

- **Primary (Or)**: Gamme de couleurs dorées pour les éléments principaux
- **Wood (Bois)**: Tons chauds de bois pour l'identité artisanale
- **Neutral**: Tons neutres pour le texte et les arrière-plans

### Typographie

- **Sans-serif**: Inter pour le texte courant
- **Serif**: Playfair Display pour les titres et éléments élégants

### Composants Stylisés

- Boutons avec gradients luxueux
- Cards avec ombres élégantes
- Animations fluides et transitions
- Design responsive mobile-first

## 🛠️ Développement

### Installation

```bash
npm install
```

### Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement (port 3000)

# Build
npm run build        # Build de production
npm start           # Serveur de production

# Qualité du code
npm run lint         # ESLint
npm run lint:fix     # Correction automatique ESLint
npm run type-check   # Vérification TypeScript
npm run format       # Formatage Prettier

# Tests
npm run test         # Tests unitaires
npm run test:watch   # Tests en mode watch
npm run test:coverage # Couverture de tests
```

### Variables d'Environnement

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=+216XXXXXXXX
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📱 Pages et Fonctionnalités

### Pages Publiques

- **Accueil** (`/`) : Hero, présentation, services, contact rapide
- **Produits** (`/produits`) : Catalogue avec filtres et recherche
- **Galerie** (`/galerie`) : Images avec filtres par catégories
- **Contact** (`/contact`) : Formulaire et informations de contact

### Pages Administration

- **Dashboard** (`/admin`) : Vue d'ensemble et statistiques
- **Login** (`/admin/login`) : Authentification administrateur
- **Gestion Contenu** (`/admin/home`) : Édition page d'accueil
- **Gestion Produits** (`/admin/products`) : CRUD produits
- **Gestion Galerie** (`/admin/gallery`) : Upload et organisation images
- **Messages** (`/admin/messages`) : Gestion messages clients

## 🔧 Configuration

### Next.js

- App Router activé
- Images optimisées avec domaines autorisés
- Headers de sécurité configurés
- Rewrites API pour le proxy backend

### Tailwind CSS

- Configuration personnalisée avec thème ÉBENOR
- Plugins : forms, typography, aspect-ratio
- Classes utilitaires personnalisées
- Animations et transitions

### TypeScript

- Configuration stricte
- Chemins d'alias configurés (`@/`)
- Types partagés avec le backend

## 🚀 Déploiement

### Build de Production

```bash
npm run build
npm start
```

### Docker

```bash
# Build de l'image
docker build -t ebenor-frontend .

# Lancement du conteneur
docker run -p 3000:3000 ebenor-frontend
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [React Hook Form](https://react-hook-form.com)

## 🤝 Contribution

1. Respecter la structure des composants
2. Utiliser TypeScript pour tous les nouveaux fichiers
3. Suivre les conventions de nommage
4. Tester les changements sur mobile et desktop
5. Maintenir la cohérence du design system

## 📄 Licence

© 2024 ÉBENOR CRÉATION. Tous droits réservés.