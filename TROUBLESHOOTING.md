# Guide de Dépannage - ÉBENOR CRÉATION

## Problème : "Failed to fetch" lors de la connexion admin

### Causes possibles et solutions

#### 1. Backend non démarré
**Symptôme** : Message "Failed to fetch" immédiatement

**Solution** :
```bash
# Vérifier si le backend tourne
curl http://localhost:5000/api/home

# Si erreur, démarrer le backend
cd backend
npm run dev
```

#### 2. Frontend sur mauvais port
**Symptôme** : Le frontend est sur un port différent de 3001

**Solution** :
- Vérifiez l'URL dans votre navigateur
- Le frontend devrait être sur http://localhost:3001
- Le backend devrait être sur http://localhost:5000

#### 3. Configuration API incorrecte
**Symptôme** : Requêtes envoyées à la mauvaise URL

**Solution** :
Vérifiez que `frontend/.env.local` existe avec :
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Si le fichier n'existe pas, créez-le et redémarrez le frontend.

#### 4. Problème CORS
**Symptôme** : Erreur CORS dans la console du navigateur

**Solution** :
Le backend autorise déjà les ports 3000 et 3001. Si vous utilisez un autre port, modifiez `backend/src/server.ts` :
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:VOTRE_PORT', // Ajoutez votre port ici
];
```

#### 5. Cache du navigateur
**Symptôme** : Anciennes erreurs persistent

**Solution** :
- Videz le cache du navigateur (Ctrl + Shift + Delete)
- Ou utilisez le mode navigation privée
- Ou faites un hard refresh (Ctrl + F5)

---

## Problème : MongoDB connection failed

### Solutions

#### 1. MongoDB non démarré (Installation locale)
```bash
# Windows - Vérifier le service
Get-Service MongoDB

# Si arrêté, démarrer
Start-Service MongoDB
```

#### 2. Connection string incorrecte
Vérifiez `backend/.env` :
```env
# Pour MongoDB local
MONGODB_URI=mongodb://localhost:27017/ebenor-creation

# Pour MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ebenor-creation
```

#### 3. MongoDB Atlas - IP non autorisée
1. Allez sur MongoDB Atlas
2. Network Access
3. Ajoutez votre IP ou autorisez 0.0.0.0/0 (tous)

---

## Problème : Erreur "AdminUser validation failed"

### Cause
Le modèle AdminUser nécessite des champs spécifiques

### Solution
Utilisez le script mis à jour :
```bash
cd backend
npm run create-admin
```

Le script va automatiquement :
- Séparer le nom complet en prénom/nom
- Créer les permissions correctement
- Hasher le mot de passe

---

## Problème : "Cannot overwrite model"

### Cause
Les modèles Mongoose sont compilés plusieurs fois en mode watch

### Solution
Déjà corrigé dans le code. Si le problème persiste :
```bash
# Arrêter le backend
# Supprimer node_modules
cd backend
rm -rf node_modules
npm install
npm run dev
```

---

## Problème : Page blanche après connexion

### Causes possibles

#### 1. Erreur JavaScript
**Solution** : Ouvrez la console (F12) et regardez les erreurs

#### 2. Token non sauvegardé
**Solution** : Vérifiez localStorage dans les DevTools :
- F12 > Application > Local Storage
- Cherchez `auth_token`

#### 3. Redirection échouée
**Solution** : Essayez d'accéder directement à http://localhost:3001/admin/dashboard

---

## Vérification rapide du système

### 1. Vérifier que tout tourne
```bash
# Backend
curl http://localhost:5000/api/home

# Frontend
# Ouvrez http://localhost:3001 dans le navigateur
```

### 2. Tester l'authentification
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"achref@ebenor-creation.tn","password":"Admin123!"}'
```

Devrait retourner un token JWT.

### 3. Vérifier MongoDB
```bash
# Si MongoDB local
mongosh mongodb://localhost:27017/ebenor-creation

# Lister les utilisateurs
db.admin_users.find()
```

---

## Logs utiles

### Backend
Les logs apparaissent dans le terminal où vous avez lancé `npm run dev`

Recherchez :
- ✅ Connexion MongoDB établie
- 🚀 Serveur démarré sur le port 5000
- Erreurs en rouge

### Frontend
- Console du navigateur (F12)
- Onglet Network pour voir les requêtes
- Onglet Console pour les erreurs JavaScript

---

## Commandes de diagnostic

### Vérifier les ports utilisés
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3001
```

### Redémarrer proprement
```bash
# Arrêter tous les processus Node
taskkill /F /IM node.exe

# Redémarrer backend
cd backend
npm run dev

# Redémarrer frontend (nouveau terminal)
cd frontend
npm run dev
```

### Nettoyer les caches
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf .next node_modules
npm install
```

---

## Besoin d'aide supplémentaire ?

1. **Vérifiez les logs** dans les terminaux
2. **Ouvrez la console** du navigateur (F12)
3. **Testez l'API** directement avec curl ou Postman
4. **Vérifiez MongoDB** avec mongosh ou MongoDB Compass

Si le problème persiste, notez :
- Le message d'erreur exact
- Les logs du backend
- Les erreurs de la console navigateur
- Les étapes pour reproduire le problème
