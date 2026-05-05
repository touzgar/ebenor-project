// Script d'initialisation MongoDB pour Docker
// Ce script crée la base de données et un utilisateur admin par défaut

db = db.getSiblingDB('ebenor-creation');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'ebenor_user',
  pwd: 'ebenor_password',
  roles: [
    {
      role: 'readWrite',
      db: 'ebenor-creation'
    }
  ]
});

// Créer les collections avec validation
db.createCollection('admins', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'firstName', 'lastName', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        },
        firstName: {
          bsonType: 'string',
          minLength: 1
        },
        lastName: {
          bsonType: 'string',
          minLength: 1
        },
        role: {
          bsonType: 'string',
          enum: ['super_admin', 'admin', 'editor']
        }
      }
    }
  }
});

// Créer les index pour optimiser les performances
db.admins.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ category: 1, featured: -1 });
db.galleryimages.createIndex({ category: 1, sortOrder: 1 });
db.messages.createIndex({ status: 1, createdAt: -1 });

print('Base de données ÉBENOR CRÉATION initialisée avec succès!');