# Guide de Développement - ÉBENOR CRÉATION

## Configuration Initiale

### Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** >= 20.0.0
- **Docker Compose** >= 2.0.0

### Installation Rapide

```bash
# Cloner le projet
git clone <repository-url>
cd Ebenor-Creation

# Configuration automatique
make setup
# ou
chmod +x scripts/setup.sh && ./scripts/setup.sh

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

## Commandes de Développement

### Avec Make (Recommandé)

```bash
# Voir toutes les commandes disponibles
make help

# Développement avec Docker
make dev

# Développement local (sans Docker)
make dev-local

# Tests
make test
make test-coverage

# Linting et formatage
make lint
make format

# Production
make build
make start
```

### Commandes Manuelles

#### Backend

```bash
cd backend

# Installation
npm install

# Développement
npm run dev

# Tests
npm test
npm run test:watch
npm run test:coverage

# Build
npm run build
npm start

# Linting
npm run lint
npm run lint:fix
npm run format
```

#### Frontend

```bash
cd frontend

# Installation
npm install

# Développement
npm run dev

# Tests
npm test
npm run test:watch

# Build
npm run build
npm start

# Linting
npm run lint
npm run lint:fix
npm run format
```

## Architecture du Projet

### Structure des Répertoires

```
Ebenor-Creation/
├── backend/                 # API Express.js + TypeScript
│   ├── src/
│   │   ├── config/         # Configuration (DB, etc.)
│   │   ├── controllers/    # Contrôleurs API
│   │   ├── middleware/     # Middlewares Express
│   │   ├── models/         # Modèles Mongoose
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Logique métier
│   │   ├── types/          # Types TypeScript
│   │   ├── utils/          # Utilitaires
│   │   └── server.ts       # Point d'entrée
│   ├── tests/              # Tests automatisés
│   └── scripts/            # Scripts utilitaires
├── frontend/               # Application Next.js
│   ├── src/
│   │   ├── app/           # Pages App Router
│   │   ├── components/    # Composants React
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── lib/           # Utilitaires
│   │   └── types/         # Types TypeScript
│   └── public/            # Assets statiques
├── nginx/                 # Configuration Nginx
├── scripts/               # Scripts de configuration
└── docker-compose.yml     # Configuration Docker
```

### Technologies Utilisées

#### Backend
- **Express.js** - Framework web
- **TypeScript** - Typage statique
- **MongoDB + Mongoose** - Base de données
- **JWT** - Authentification
- **Multer + Cloudinary** - Gestion des fichiers
- **Winston** - Logging
- **Jest + Supertest** - Tests

#### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **React Hook Form + Zod** - Gestion des formulaires
- **Framer Motion** - Animations
- **Axios** - Client HTTP
- **Jest + Testing Library** - Tests

#### DevOps
- **Docker** - Containerisation
- **Nginx** - Reverse proxy
- **ESLint + Prettier** - Qualité du code
- **GitHub Actions** - CI/CD (à configurer)

## Conventions de Code

### TypeScript

- Utiliser des interfaces pour les types de données
- Typer explicitement les fonctions publiques
- Éviter `any`, préférer `unknown` si nécessaire
- Utiliser des types union pour les énumérations

```typescript
// ✅ Bon
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

function createUser(data: CreateUserRequest): Promise<User> {
  // ...
}

// ❌ Éviter
function createUser(data: any): any {
  // ...
}
```

### React/Next.js

- Composants fonctionnels avec hooks
- Props typées avec TypeScript
- Utiliser `use client` uniquement si nécessaire
- Préférer Server Components quand possible

```typescript
// ✅ Bon
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      className={cn('btn', `btn-${variant}`)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### CSS/Tailwind

- Utiliser les classes utilitaires Tailwind
- Créer des composants CSS pour les patterns répétés
- Utiliser la fonction `cn()` pour combiner les classes
- Respecter le design system (couleurs, espacements)

```typescript
// ✅ Bon
<div className={cn(
  'card',
  'p-6',
  isActive && 'border-primary-500',
  className
)}>
```

### API/Backend

- Routes RESTful avec verbes HTTP appropriés
- Validation des données avec express-validator
- Gestion d'erreurs centralisée
- Logging structuré avec Winston

```typescript
// ✅ Bon
router.post('/products', 
  authenticate,
  validateProductData,
  productController.create
);

// Contrôleur
export const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const product = await productService.create(req.body, req.user!.id);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};
```

## Tests

### Structure des Tests

```
tests/
├── unit/           # Tests unitaires
├── integration/    # Tests d'intégration
├── e2e/           # Tests end-to-end
├── fixtures/      # Données de test
└── utils/         # Utilitaires de test
```

### Exemples de Tests

#### Backend (Jest + Supertest)

```typescript
describe('Products API', () => {
  beforeEach(async () => {
    await setupTestDB();
  });

  it('should create a new product', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      category: 'furniture'
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send(productData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(productData.name);
  });
});
```

#### Frontend (Jest + Testing Library)

```typescript
describe('Button Component', () => {
  it('should render with correct variant', () => {
    render(<Button variant="primary">Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Base de Données

### Modèles Mongoose

- Utiliser des schémas stricts avec validation
- Créer des index pour optimiser les performances
- Utiliser des middlewares pour les hooks (pre/post)
- Implémenter des méthodes personnalisées si nécessaire

```typescript
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  // ...
}, {
  timestamps: true
});

// Index
productSchema.index({ category: 1, featured: -1 });
productSchema.index({ slug: 1 }, { unique: true });

// Middleware
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});
```

## Déploiement

### Environnements

- **Development** - Local avec hot reload
- **Staging** - Environnement de test
- **Production** - Environnement de production

### Variables d'Environnement

Configurer les variables dans `.env` :

```bash
# Base
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb://localhost:27017/ebenor-creation

# Auth
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Docker

```bash
# Développement
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker-compose up -d

# Avec Nginx (production)
docker-compose --profile production up -d
```

## Debugging

### Backend

```bash
# Avec debugger Node.js
npm run dev -- --inspect=0.0.0.0:9229

# Logs en temps réel
docker-compose logs -f backend
```

### Frontend

```bash
# Mode debug Next.js
npm run dev

# Logs en temps réel
docker-compose logs -f frontend
```

### Base de Données

```bash
# Shell MongoDB
make shell-db

# Backup/Restore
make backup
make restore BACKUP=backup-20231201-120000
```

## Contribution

1. Créer une branche feature : `git checkout -b feature/nouvelle-fonctionnalite`
2. Faire les modifications avec tests
3. Vérifier le code : `make lint && make test`
4. Commit avec message descriptif
5. Push et créer une Pull Request

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les logs : `make logs`
3. Vérifier les issues GitHub
4. Contacter l'équipe de développement