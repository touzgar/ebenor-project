# Guide d'Installation MongoDB pour ÉBENOR CRÉATION

## Option 1 : Installation Locale (Recommandé pour le développement)

### Étape 1 : Télécharger MongoDB Community Server

1. Allez sur : https://www.mongodb.com/try/download/community
2. Sélectionnez :
   - **Version** : 7.0.x (dernière version stable)
   - **Platform** : Windows
   - **Package** : MSI
3. Cliquez sur **Download**

### Étape 2 : Installer MongoDB

1. Lancez le fichier `.msi` téléchargé
2. Choisissez **Complete** installation
3. **Important** : Cochez "Install MongoDB as a Service"
4. Laissez les paramètres par défaut :
   - Service Name: `MongoDB`
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log\`
5. **Décochez** "Install MongoDB Compass" (optionnel, interface graphique)
6. Cliquez sur **Install**

### Étape 3 : Vérifier l'Installation

Ouvrez PowerShell ou CMD et tapez :

\`\`\`bash
mongod --version
\`\`\`

Vous devriez voir la version de MongoDB s'afficher.

### Étape 4 : Démarrer MongoDB

MongoDB devrait démarrer automatiquement comme service Windows. Pour vérifier :

\`\`\`bash
# Vérifier le statut du service
Get-Service MongoDB

# Si le service n'est pas démarré
Start-Service MongoDB
\`\`\`

### Étape 5 : Configurer les Variables d'Environnement

Votre backend est déjà configuré pour utiliser MongoDB. Vérifiez le fichier \`backend/.env\` :

\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ebenor-creation
MONGODB_DB_NAME=ebenor-creation

# JWT Configuration
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi_en_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
\`\`\`

### Étape 6 : Créer un Utilisateur Administrateur

Une fois MongoDB installé et le backend démarré, créez votre premier utilisateur admin :

\`\`\`bash
cd backend
npm run create-admin
\`\`\`

Ou utilisez le script manuel ci-dessous.

---

## Option 2 : MongoDB Atlas (Cloud - Gratuit)

Si vous préférez ne pas installer MongoDB localement, utilisez MongoDB Atlas (gratuit jusqu'à 512 MB) :

### Étape 1 : Créer un Compte

1. Allez sur : https://www.mongodb.com/cloud/atlas/register
2. Créez un compte gratuit

### Étape 2 : Créer un Cluster

1. Choisissez **FREE** (M0 Sandbox)
2. Sélectionnez une région proche (ex: Frankfurt, Germany)
3. Nommez votre cluster : `ebenor-cluster`
4. Cliquez sur **Create**

### Étape 3 : Configurer l'Accès

1. **Database Access** :
   - Créez un utilisateur (ex: `ebenor_admin`)
   - Notez le mot de passe
   - Donnez les droits "Read and write to any database"

2. **Network Access** :
   - Cliquez sur "Add IP Address"
   - Choisissez "Allow Access from Anywhere" (0.0.0.0/0)
   - Pour la production, limitez aux IPs spécifiques

### Étape 4 : Obtenir la Connection String

1. Cliquez sur **Connect** sur votre cluster
2. Choisissez **Connect your application**
3. Copiez la connection string :
   \`\`\`
   mongodb+srv://<username>:<password>@ebenor-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   \`\`\`

### Étape 5 : Configurer le Backend

Modifiez \`backend/.env\` :

\`\`\`env
MONGODB_URI=mongodb+srv://ebenor_admin:VOTRE_MOT_DE_PASSE@ebenor-cluster.xxxxx.mongodb.net/ebenor-creation?retryWrites=true&w=majority
MONGODB_DB_NAME=ebenor-creation
\`\`\`

---

## Script de Création d'Utilisateur Admin

Créez le fichier \`backend/scripts/create-admin.ts\` :

\`\`\`typescript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../src/models/AdminUser';
import { config } from 'dotenv';

config();

async function createAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ebenor-creation');
    console.log('✅ Connecté à MongoDB');

    // Données de l'admin
    const adminData = {
      email: 'admin@ebenor-creation.tn',
      password: 'Admin123!', // Changez ce mot de passe !
      name: 'Administrateur',
      role: 'super_admin',
      permissions: ['all'],
    };

    // Vérifier si l'admin existe déjà
    const existingAdmin = await AdminUser.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Un administrateur avec cet email existe déjà');
      process.exit(0);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // Créer l'admin
    const admin = await AdminUser.create({
      ...adminData,
      password: hashedPassword,
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Mot de passe:', adminData.password);
    console.log('⚠️  CHANGEZ CE MOT DE PASSE après la première connexion !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

createAdmin();
\`\`\`

Ajoutez le script dans \`backend/package.json\` :

\`\`\`json
{
  "scripts": {
    "create-admin": "ts-node scripts/create-admin.ts"
  }
}
\`\`\`

---

## Vérification Finale

1. **Backend démarré** : http://localhost:5000/api
2. **MongoDB connecté** : Vérifiez les logs du backend
3. **Admin créé** : Utilisez le script ci-dessus
4. **Test de connexion** : http://localhost:3001/admin/login

### Credentials de Test

- **Email** : admin@ebenor-creation.tn
- **Mot de passe** : Admin123!

---

## Dépannage

### Erreur : "MongoDB connection failed"

1. Vérifiez que le service MongoDB est démarré :
   \`\`\`bash
   Get-Service MongoDB
   \`\`\`

2. Vérifiez la connection string dans \`.env\`

3. Testez la connexion manuellement :
   \`\`\`bash
   mongosh mongodb://localhost:27017
   \`\`\`

### Erreur : "Authentication failed"

1. Vérifiez que l'utilisateur admin a été créé
2. Vérifiez le mot de passe
3. Consultez les logs du backend pour plus de détails

### Port 27017 déjà utilisé

Un autre processus utilise le port MongoDB. Arrêtez-le ou changez le port dans la configuration.

---

## Prochaines Étapes

Une fois MongoDB configuré et l'admin créé :

1. ✅ Connectez-vous à http://localhost:3001/admin/login
2. ✅ Accédez au dashboard
3. ✅ Commencez à gérer votre contenu !

Pour toute question, consultez la documentation officielle : https://docs.mongodb.com/
