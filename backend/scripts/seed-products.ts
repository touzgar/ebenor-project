#!/usr/bin/env ts-node
/**
 * Script de seed pour ajouter des produits réels dans la base de données
 * Usage: npx ts-node scripts/seed-products.ts
 */

import mongoose from 'mongoose';
import { Product } from '../src/models/Product';
import { GalleryImage } from '../src/models/GalleryImage';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  // CUISINE
  {
    name: 'Cuisine Moderne en Chêne Massif',
    slug: 'cuisine-moderne-chene-massif',
    description: '<p>Cuisine complète en chêne massif avec finition naturelle. Design moderne et épuré avec îlot central et plan de travail en granit. Équipée de tiroirs à fermeture douce et d\'éclairage LED intégré.</p><p>Cette cuisine allie fonctionnalité et esthétique, offrant un espace de travail optimal pour les passionnés de gastronomie.</p>',
    shortDescription: 'Cuisine complète en chêne massif avec îlot central et finition naturelle',
    category: 'cuisine',
    subcategory: 'Cuisine complète',
    images: [
      { url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800', alt: 'Cuisine moderne en chêne', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', alt: 'Détail îlot central', isPrimary: false },
    ],
    specifications: {
      'Style': 'Moderne',
      'Type': 'Cuisine complète',
      'Garantie': '10 ans',
      'Installation': 'Incluse',
    },
    dimensions: { length: 450, width: 300, height: 240, unit: 'cm' },
    materials: ['Chêne massif', 'Granit', 'Acier inoxydable'],
    finishes: ['Vernis naturel', 'Huilé'],
    price: { amount: 25000, currency: 'TND', unit: 'ensemble' },
    availability: 'made_to_order',
    featured: true,
    tags: ['moderne', 'chêne', 'îlot central', 'haut de gamme'],
  },
  {
    name: 'Cuisine Traditionnelle Tunisienne',
    slug: 'cuisine-traditionnelle-tunisienne',
    description: '<p>Cuisine traditionnelle tunisienne en bois de noyer avec sculptures artisanales. Design authentique inspiré de l\'architecture tunisienne traditionnelle.</p><p>Chaque élément est sculpté à la main par nos artisans, créant une pièce unique qui raconte une histoire.</p>',
    shortDescription: 'Cuisine traditionnelle en noyer avec sculptures artisanales tunisiennes',
    category: 'cuisine',
    subcategory: 'Cuisine traditionnelle',
    images: [
      { url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800', alt: 'Cuisine traditionnelle', isPrimary: true },
    ],
    specifications: {
      'Style': 'Traditionnel',
      'Type': 'Cuisine complète',
      'Artisanat': 'Fait main',
    },
    dimensions: { length: 400, width: 280, height: 240, unit: 'cm' },
    materials: ['Noyer', 'Marbre'],
    finishes: ['Ciré', 'Patiné'],
    price: { amount: 30000, currency: 'TND', unit: 'ensemble' },
    availability: 'made_to_order',
    featured: true,
    tags: ['traditionnel', 'tunisien', 'artisanal', 'sculpté'],
  },

  // DRESSING
  {
    name: 'Dressing Sur Mesure Contemporain',
    slug: 'dressing-sur-mesure-contemporain',
    description: '<p>Dressing contemporain sur mesure avec portes coulissantes et miroirs intégrés. Optimisation maximale de l\'espace avec système de rangement modulaire.</p><p>Éclairage LED automatique et finitions haut de gamme pour une expérience luxueuse.</p>',
    shortDescription: 'Dressing contemporain avec portes coulissantes et système modulaire',
    category: 'dressing',
    subcategory: 'Dressing complet',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Dressing contemporain', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800', alt: 'Intérieur dressing', isPrimary: false },
    ],
    specifications: {
      'Style': 'Contemporain',
      'Portes': 'Coulissantes',
      'Éclairage': 'LED automatique',
      'Miroirs': 'Intégrés',
    },
    dimensions: { length: 300, width: 60, height: 250, unit: 'cm' },
    materials: ['MDF laqué', 'Verre', 'Aluminium'],
    finishes: ['Laqué brillant', 'Mat'],
    price: { amount: 15000, currency: 'TND', unit: 'ensemble' },
    availability: 'made_to_order',
    featured: true,
    tags: ['contemporain', 'sur mesure', 'modulaire', 'LED'],
  },
  {
    name: 'Armoire Dressing Classique',
    slug: 'armoire-dressing-classique',
    description: '<p>Armoire dressing classique en bois massif avec portes battantes. Design intemporel avec compartiments multiples et tiroirs intégrés.</p>',
    shortDescription: 'Armoire dressing classique en bois massif avec compartiments multiples',
    category: 'dressing',
    subcategory: 'Armoire',
    images: [
      { url: 'https://images.unsplash.com/photo-1595428773637-3b0c3c6b9f7f?w=800', alt: 'Armoire classique', isPrimary: true },
    ],
    specifications: {
      'Style': 'Classique',
      'Portes': 'Battantes',
      'Compartiments': '6',
    },
    dimensions: { length: 200, width: 60, height: 220, unit: 'cm' },
    materials: ['Chêne massif'],
    finishes: ['Vernis naturel'],
    price: { amount: 8000, currency: 'TND', unit: 'pièce' },
    availability: 'in_stock',
    featured: false,
    tags: ['classique', 'bois massif', 'intemporel'],
  },

  // MOBILIER
  {
    name: 'Table à Manger Artisanale',
    slug: 'table-manger-artisanale',
    description: '<p>Table à manger artisanale en bois de noyer avec plateau massif d\'une seule pièce. Pieds en acier forgé pour un look industriel-chic.</p><p>Chaque table est unique avec ses veines naturelles et son histoire.</p>',
    shortDescription: 'Table à manger en noyer massif avec pieds en acier forgé',
    category: 'mobilier',
    subcategory: 'Table',
    images: [
      { url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800', alt: 'Table à manger', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', alt: 'Détail plateau', isPrimary: false },
    ],
    specifications: {
      'Type': 'Table à manger',
      'Places': '8 personnes',
      'Épaisseur plateau': '5 cm',
    },
    dimensions: { length: 240, width: 100, height: 75, unit: 'cm' },
    materials: ['Noyer massif', 'Acier forgé'],
    finishes: ['Huilé', 'Ciré'],
    price: { amount: 12000, currency: 'TND', unit: 'pièce' },
    availability: 'made_to_order',
    featured: true,
    tags: ['artisanal', 'noyer', 'industriel', 'unique'],
  },
  {
    name: 'Bibliothèque Murale Moderne',
    slug: 'bibliotheque-murale-moderne',
    description: '<p>Bibliothèque murale moderne avec étagères asymétriques. Design épuré et fonctionnel, parfait pour les espaces contemporains.</p>',
    shortDescription: 'Bibliothèque murale avec design asymétrique moderne',
    category: 'mobilier',
    subcategory: 'Bibliothèque',
    images: [
      { url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', alt: 'Bibliothèque moderne', isPrimary: true },
    ],
    specifications: {
      'Type': 'Bibliothèque murale',
      'Étagères': '8',
      'Fixation': 'Murale',
    },
    dimensions: { length: 300, width: 30, height: 250, unit: 'cm' },
    materials: ['Chêne', 'Métal'],
    finishes: ['Laqué mat'],
    price: { amount: 6500, currency: 'TND', unit: 'pièce' },
    availability: 'in_stock',
    featured: false,
    tags: ['moderne', 'bibliothèque', 'murale', 'asymétrique'],
  },
  {
    name: 'Lit King Size en Bois Massif',
    slug: 'lit-king-size-bois-massif',
    description: '<p>Lit king size en bois massif avec tête de lit sculptée. Confort et élégance pour votre chambre à coucher.</p>',
    shortDescription: 'Lit king size avec tête de lit sculptée en bois massif',
    category: 'mobilier',
    subcategory: 'Lit',
    images: [
      { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800', alt: 'Lit king size', isPrimary: true },
    ],
    specifications: {
      'Type': 'Lit',
      'Taille': 'King Size (180x200)',
      'Sommier': 'Inclus',
    },
    dimensions: { length: 220, width: 200, height: 120, unit: 'cm' },
    materials: ['Chêne massif'],
    finishes: ['Vernis naturel'],
    price: { amount: 9500, currency: 'TND', unit: 'pièce' },
    availability: 'made_to_order',
    featured: false,
    tags: ['lit', 'king size', 'sculpté', 'chambre'],
  },

  // AMENAGEMENT
  {
    name: 'Aménagement Bureau Professionnel',
    slug: 'amenagement-bureau-professionnel',
    description: '<p>Aménagement complet pour bureau professionnel incluant bureau exécutif, bibliothèque murale et rangements intégrés.</p><p>Design sophistiqué pour un environnement de travail optimal.</p>',
    shortDescription: 'Aménagement bureau complet avec mobilier exécutif et rangements',
    category: 'amenagement',
    subcategory: 'Bureau',
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', alt: 'Bureau professionnel', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', alt: 'Détail aménagement', isPrimary: false },
    ],
    specifications: {
      'Type': 'Aménagement complet',
      'Pièces': 'Bureau, bibliothèque, rangements',
      'Style': 'Professionnel',
    },
    dimensions: { length: 400, width: 300, height: 240, unit: 'cm' },
    materials: ['Noyer', 'Cuir', 'Verre'],
    finishes: ['Vernis satiné'],
    price: { amount: 18000, currency: 'TND', unit: 'ensemble' },
    availability: 'made_to_order',
    featured: true,
    tags: ['bureau', 'professionnel', 'aménagement', 'exécutif'],
  },
  {
    name: 'Aménagement Salon TV',
    slug: 'amenagement-salon-tv',
    description: '<p>Meuble TV mural avec rangements intégrés et éclairage LED. Design moderne pour votre salon.</p>',
    shortDescription: 'Meuble TV mural avec rangements et éclairage LED intégré',
    category: 'amenagement',
    subcategory: 'Salon',
    images: [
      { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800', alt: 'Meuble TV', isPrimary: true },
    ],
    specifications: {
      'Type': 'Meuble TV mural',
      'Éclairage': 'LED RGB',
      'Support TV': 'Jusqu\'à 75 pouces',
    },
    dimensions: { length: 300, width: 45, height: 180, unit: 'cm' },
    materials: ['MDF laqué', 'Verre trempé'],
    finishes: ['Laqué brillant'],
    price: { amount: 7500, currency: 'TND', unit: 'ensemble' },
    availability: 'in_stock',
    featured: false,
    tags: ['TV', 'salon', 'moderne', 'LED'],
  },
  {
    name: 'Aménagement Entrée Maison',
    slug: 'amenagement-entree-maison',
    description: '<p>Aménagement d\'entrée complet avec vestiaire, banc et miroir. Première impression élégante pour votre maison.</p>',
    shortDescription: 'Aménagement entrée avec vestiaire, banc et miroir intégré',
    category: 'amenagement',
    subcategory: 'Entrée',
    images: [
      { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', alt: 'Aménagement entrée', isPrimary: true },
    ],
    specifications: {
      'Type': 'Aménagement entrée',
      'Éléments': 'Vestiaire, banc, miroir',
    },
    dimensions: { length: 200, width: 40, height: 200, unit: 'cm' },
    materials: ['Chêne', 'Miroir'],
    finishes: ['Vernis naturel'],
    price: { amount: 5500, currency: 'TND', unit: 'ensemble' },
    availability: 'made_to_order',
    featured: false,
    tags: ['entrée', 'vestiaire', 'banc', 'miroir'],
  },

  // AUTRE
  {
    name: 'Porte d\'Entrée Sculptée',
    slug: 'porte-entree-sculptee',
    description: '<p>Porte d\'entrée en bois massif avec sculptures traditionnelles tunisiennes. Sécurité et esthétique pour votre maison.</p>',
    shortDescription: 'Porte d\'entrée en bois massif avec sculptures artisanales',
    category: 'autre',
    subcategory: 'Porte',
    images: [
      { url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800', alt: 'Porte sculptée', isPrimary: true },
    ],
    specifications: {
      'Type': 'Porte d\'entrée',
      'Sécurité': 'Serrure 3 points',
      'Isolation': 'Thermique et phonique',
    },
    dimensions: { length: 100, width: 8, height: 220, unit: 'cm' },
    materials: ['Chêne massif', 'Acier'],
    finishes: ['Vernis extérieur'],
    price: { amount: 8500, currency: 'TND', unit: 'pièce' },
    availability: 'made_to_order',
    featured: false,
    tags: ['porte', 'sculptée', 'sécurité', 'entrée'],
  },
  {
    name: 'Escalier en Bois Massif',
    slug: 'escalier-bois-massif',
    description: '<p>Escalier sur mesure en bois massif avec rampe sculptée. Design élégant et sécurisé.</p>',
    shortDescription: 'Escalier sur mesure en bois massif avec rampe sculptée',
    category: 'autre',
    subcategory: 'Escalier',
    images: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', alt: 'Escalier en bois', isPrimary: true },
    ],
    specifications: {
      'Type': 'Escalier droit',
      'Marches': '14',
      'Rampe': 'Sculptée',
    },
    dimensions: { length: 400, width: 100, height: 300, unit: 'cm' },
    materials: ['Chêne massif'],
    finishes: ['Vernis satiné'],
    price: { amount: 15000, currency: 'TND', unit: 'ensemble' },
    availability: 'made_to_order',
    featured: false,
    tags: ['escalier', 'sur mesure', 'rampe', 'sécurisé'],
  },
];

const galleryImages = [
  // CUISINE
  {
    title: 'Cuisine Moderne Réalisée',
    description: 'Cuisine moderne en chêne avec îlot central',
    url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
    category: 'cuisine',
    tags: ['moderne', 'chêne', 'îlot'],
    alt: 'Cuisine moderne en chêne',
    dimensions: { width: 1920, height: 1280 },
    fileSize: 524288,
    mimeType: 'image/jpeg',
    featured: true,
    sortOrder: 1,
  },
  {
    title: 'Cuisine Traditionnelle',
    description: 'Cuisine traditionnelle tunisienne',
    url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400',
    category: 'cuisine',
    tags: ['traditionnel', 'tunisien'],
    alt: 'Cuisine traditionnelle',
    dimensions: { width: 1920, height: 1280 },
    fileSize: 524288,
    mimeType: 'image/jpeg',
    featured: true,
    sortOrder: 2,
  },

  // DRESSING
  {
    title: 'Dressing Contemporain',
    description: 'Dressing avec portes coulissantes',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'dressing',
    tags: ['contemporain', 'coulissant'],
    alt: 'Dressing contemporain',
    dimensions: { width: 1920, height: 1280 },
    fileSize: 524288,
    mimeType: 'image/jpeg',
    featured: true,
    sortOrder: 3,
  },

  // MOBILIER
  {
    title: 'Table Artisanale',
    description: 'Table à manger en noyer massif',
    url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400',
    category: 'mobilier',
    tags: ['table', 'noyer', 'artisanal'],
    alt: 'Table artisanale',
    dimensions: { width: 1920, height: 1280 },
    fileSize: 524288,
    mimeType: 'image/jpeg',
    featured: true,
    sortOrder: 4,
  },
  {
    title: 'Bibliothèque Moderne',
    description: 'Bibliothèque murale asymétrique',
    url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400',
    category: 'mobilier',
    tags: ['bibliothèque', 'moderne'],
    alt: 'Bibliothèque moderne',
    dimensions: { width: 1920, height: 1280 },
    fileSize: 524288,
    mimeType: 'image/jpeg',
    featured: true,
    sortOrder: 5,
  },

  // AMENAGEMENT
  {
    title: 'Bureau Professionnel',
    description: 'Aménagement bureau exécutif',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    category: 'amenagement',
    tags: ['bureau', 'professionnel'],
    alt: 'Bureau professionnel',
    dimensions: { width: 1920, height: 1280 },
    fileSize: 524288,
    mimeType: 'image/jpeg',
    featured: true,
    sortOrder: 6,
  },

  // SHOWROOM
  {
    title: 'Notre Showroom',
    description: 'Espace d\'exposition ÉBÉNOR CRÉATION',
    url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400',
    category: 'showroom',
    tags: ['showroom', 'exposition'],
    alt: 'Showroom',
    dimensions: { width: 1920, height: 1280 },
    fileSize: 524288,
    mimeType: 'image/jpeg',
    featured: true,
    sortOrder: 7,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ebenor-creation';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await GalleryImage.deleteMany({});
    console.log('✅ Existing data cleared');

    // Insert products
    console.log('\n📦 Inserting products...');
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} products inserted`);

    // Insert gallery images
    console.log('\n🖼️  Inserting gallery images...');
    const insertedImages = await GalleryImage.insertMany(galleryImages);
    console.log(`✅ ${insertedImages.length} gallery images inserted`);

    // Display summary
    console.log('\n📊 Summary:');
    console.log('─'.repeat(50));
    
    const categoryCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nProducts by category:');
    categoryCounts.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count} products`);
    });

    const galleryCounts = await GalleryImage.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nGallery images by category:');
    galleryCounts.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count} images`);
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('\n🚀 You can now test the application with real data');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run seed
seedDatabase();
