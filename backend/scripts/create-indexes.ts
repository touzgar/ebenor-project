import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../src/models/Product';
import { GalleryImage } from '../src/models/GalleryImage';
import { Message } from '../src/models/Message';
import { AuditLog } from '../src/models/AuditLog';
import { AdminUser } from '../src/models/AdminUser';
import { HomeContent } from '../src/models/HomeContent';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ebenor-creation';

interface IndexInfo {
  name: string;
  keys: Record<string, number>;
  unique?: boolean;
  sparse?: boolean;
}

/**
 * Create and verify all database indexes
 */
async function createIndexes() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const models = [
      { name: 'Product', model: Product },
      { name: 'GalleryImage', model: GalleryImage },
      { name: 'Message', model: Message },
      { name: 'AuditLog', model: AuditLog },
      { name: 'AdminUser', model: AdminUser },
      { name: 'HomeContent', model: HomeContent }
    ];

    console.log('📊 Creating and verifying indexes...\n');

    for (const { name, model } of models) {
      console.log(`\n📁 ${name} Collection:`);
      console.log('─'.repeat(50));

      try {
        // Create indexes
        await model.createIndexes();
        console.log('✅ Indexes created successfully');

        // Get existing indexes
        const indexes = await model.collection.listIndexes().toArray();
        
        console.log(`\n📋 Existing Indexes (${indexes.length}):`);
        indexes.forEach((index: any) => {
          const keys = Object.entries(index.key)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          
          const options = [];
          if (index.unique) options.push('unique');
          if (index.sparse) options.push('sparse');
          if (index.expireAfterSeconds) options.push(`TTL: ${index.expireAfterSeconds}s`);
          
          const optionsStr = options.length > 0 ? ` [${options.join(', ')}]` : '';
          console.log(`  • ${index.name}: { ${keys} }${optionsStr}`);
        });

        // Verify specific indexes based on requirements
        await verifyModelIndexes(name, indexes);

      } catch (error) {
        console.error(`❌ Error processing ${name}:`, error);
      }
    }

    console.log('\n\n✅ Index creation and verification complete!');
    console.log('\n📊 Summary:');
    console.log('─'.repeat(50));
    
    // Get database stats
    const stats = await mongoose.connection.db.stats();
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Collections: ${stats.collections}`);
    console.log(`Indexes: ${stats.indexes}`);
    console.log(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

/**
 * Verify that required indexes exist for each model
 */
async function verifyModelIndexes(modelName: string, indexes: any[]) {
  const indexNames = indexes.map(idx => idx.name);
  
  const requirements: Record<string, string[]> = {
    'Product': [
      'slug_1', // Requirement 29.1
      'category_1_subcategory_1', // Requirement 29.2
      'featured_-1_createdAt_-1', // Requirement 29.3
      'tags_1', // Requirement 29.4
      'product_text_search' // Requirement 29.5
    ],
    'GalleryImage': [
      'category_1_sortOrder_1', // Requirement 29.6
      'featured_-1_uploadedAt_-1', // Requirement 29.7
      'tags_1', // Requirement 29.4
      'gallery_text_search' // Requirement 29.8
    ],
    'Message': [
      'status_1_createdAt_-1' // Common query pattern
    ],
    'AuditLog': [
      'resource_1_resourceId_1_timestamp_-1', // Compound index
      'userId_1_timestamp_-1' // Compound index
    ],
    'AdminUser': [
      'email_1' // Unique constraint
    ],
    'HomeContent': [
      'updatedAt_-1' // Requirement 29.9
    ]
  };

  const required = requirements[modelName] || [];
  
  if (required.length > 0) {
    console.log(`\n🔍 Verifying Required Indexes:`);
    
    let allPresent = true;
    for (const reqIndex of required) {
      const exists = indexNames.some(name => name.includes(reqIndex) || reqIndex.includes(name));
      if (exists) {
        console.log(`  ✅ ${reqIndex}`);
      } else {
        console.log(`  ❌ ${reqIndex} - MISSING!`);
        allPresent = false;
      }
    }

    if (allPresent) {
      console.log(`\n✅ All required indexes present for ${modelName}`);
    } else {
      console.log(`\n⚠️  Some required indexes are missing for ${modelName}`);
    }
  }
}

/**
 * Drop all indexes (use with caution!)
 */
async function dropAllIndexes() {
  try {
    console.log('⚠️  WARNING: This will drop all indexes except _id');
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const models = [Product, GalleryImage, Message, AuditLog, AdminUser, HomeContent];

    for (const model of models) {
      const collectionName = model.collection.name;
      console.log(`Dropping indexes for ${collectionName}...`);
      
      try {
        await model.collection.dropIndexes();
        console.log(`✅ Indexes dropped for ${collectionName}`);
      } catch (error: any) {
        if (error.code === 26) {
          console.log(`⚠️  No indexes to drop for ${collectionName}`);
        } else {
          console.error(`❌ Error dropping indexes for ${collectionName}:`, error);
        }
      }
    }

    console.log('\n✅ All indexes dropped!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Main execution
const command = process.argv[2];

if (command === 'drop') {
  console.log('\n⚠️  DROPPING ALL INDEXES\n');
  dropAllIndexes();
} else {
  console.log('\n🚀 Creating Database Indexes\n');
  createIndexes();
}
