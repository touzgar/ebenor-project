# ÉBENOR CRÉATION - Plateforme Web

Plateforme web professionnelle pour une usine de fabrication de bois haut de gamme en Tunisie.

## Architecture

- **Frontend**: Next.js 14 avec App Router et TypeScript
- **Backend**: Express.js avec TypeScript
- **Base de données**: MongoDB avec Mongoose
- **Style**: Tailwind CSS avec thème luxueux bois/or
- **Containerisation**: Docker

## Structure du Projet

```
Ebenor-Creation/
├── frontend/          # Application Next.js
├── backend/           # API Express.js
├── docker-compose.yml # Configuration Docker
├── .env.example       # Variables d'environnement
└── README.md
```

## Démarrage Rapide

### Avec Docker (Recommandé)

```bash
# Copier les variables d'environnement
cp .env.example .env

# Démarrer tous les services
docker-compose up -d
```

### Développement Local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

## URLs

- **Site Web**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **API**: http://localhost:5000/api

## Technologies

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Framer Motion

### Backend
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Multer + Cloudinary
- Winston (Logging)

### Outils de Développement
- ESLint + Prettier
- Jest (Tests)
- Docker
- GitHub Actions (CI/CD)

## Fonctionnalités

### Site Public
- Page d'accueil avec sections dynamiques
- Catalogue de produits avec filtrage
- Galerie d'images par catégories
- Formulaire de contact
- Design responsive luxueux

### Panneau d'Administration
- Authentification sécurisée
- Gestion du contenu de la page d'accueil
- CRUD complet des produits
- Gestion de la galerie d'images
- Gestion des messages clients

## Licence

Propriétaire - ÉBENOR CRÉATION













# Configuration de Base
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Base de Données MongoDB
MONGODB_URI=mongodb://localhost:27017/ebenor-creation
MONGODB_TEST_URI=mongodb://localhost:27017/ebenor-creation-test

# Authentification JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Cloudinary (Gestion des Images)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email (Notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@ebenor-creation.com
ADMIN_EMAIL=admin@ebenor-creation.com

# Sécurité
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# WhatsApp Business
WHATSAPP_NUMBER=+216XXXXXXXX

# Admin par défaut (pour l'initialisation)
DEFAULT_ADMIN_EMAIL=admin@ebenor-creation.com
DEFAULT_ADMIN_PASSWORD=ChangeThisPassword123!