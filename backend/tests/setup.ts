import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Charger les variables d'environnement de test
config({ path: '.env.test' });

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Créer une instance MongoDB en mémoire pour les tests
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Se connecter à la base de données de test
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Fermer la connexion et arrêter le serveur MongoDB
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Nettoyer toutes les collections après chaque test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Configuration globale pour les tests
global.console = {
  ...console,
  // Supprimer les logs pendant les tests (optionnel)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};