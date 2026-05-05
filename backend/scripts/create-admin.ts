import mongoose from 'mongoose';
import { AdminUser } from '../src/models/AdminUser';
import { config } from 'dotenv';
import * as readline from 'readline';

config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('\n🚀 Script de création d\'administrateur ÉBENOR CRÉATION\n');

    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ebenor-creation';
    console.log('📡 Connexion à MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB\n');

    // Demander les informations
    const email = await question('📧 Email de l\'administrateur (admin@ebenor-creation.tn): ') || 'admin@ebenor-creation.tn';
    const password = await question('🔑 Mot de passe (Admin123!): ') || 'Admin123!';
    const fullName = await question('👤 Nom complet (Achref Benali): ') || 'Achref Benali';
    
    // Séparer le nom complet en prénom et nom
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Admin';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // Vérifier si l'admin existe déjà
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      console.log('\n⚠️  Un administrateur avec cet email existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.firstName, existingAdmin.lastName);
      
      const overwrite = await question('\n❓ Voulez-vous le remplacer ? (oui/non): ');
      if (overwrite.toLowerCase() !== 'oui') {
        console.log('❌ Opération annulée');
        rl.close();
        process.exit(0);
      }
      
      await AdminUser.deleteOne({ email });
      console.log('🗑️  Ancien administrateur supprimé');
    }

    // Créer l'admin avec les permissions complètes pour super_admin
    // Le middleware pre-save va hasher le mot de passe automatiquement
    const admin = await AdminUser.create({
      email,
      password, // Sera hashé par le middleware
      firstName,
      lastName,
      role: 'super_admin',
      permissions: [
        { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'gallery', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'messages', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'home_content', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] }
      ],
      isActive: true,
    });

    console.log('\n✅ Administrateur créé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Mot de passe:', password);
    console.log('👤 Prénom:', firstName);
    console.log('👤 Nom:', lastName);
    console.log('🎭 Rôle: Super Administrateur');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT : Changez ce mot de passe après la première connexion !');
    console.log('🌐 Connectez-vous sur : http://localhost:3000/admin/login\n');

    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    rl.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();
