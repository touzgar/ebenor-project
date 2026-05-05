import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixIndexes() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/ebenor-creation';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get the database
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Fix products collection
    console.log('\n📦 Fixing products collection...');
    const productsCollection = db.collection('products');
    const productIndexes = await productsCollection.indexes();
    console.log('Current product indexes:');
    productIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    const oldProductTextIndexes = productIndexes.filter(idx => 
      idx.name && idx.name.includes('text') && idx.name !== 'product_text_search'
    );

    for (const oldIndex of oldProductTextIndexes) {
      if (oldIndex.name) {
        console.log(`🗑️  Dropping old product text index: ${oldIndex.name}`);
        await productsCollection.dropIndex(oldIndex.name);
        console.log(`✅ Dropped index: ${oldIndex.name}`);
      }
    }

    // Fix gallery_images collection
    console.log('\n🖼️  Fixing gallery_images collection...');
    const galleryCollection = db.collection('gallery_images');
    const galleryIndexes = await galleryCollection.indexes();
    console.log('Current gallery indexes:');
    galleryIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    const oldGalleryTextIndexes = galleryIndexes.filter(idx => 
      idx.name && idx.name.includes('text') && idx.name !== 'gallery_text_search'
    );

    for (const oldIndex of oldGalleryTextIndexes) {
      if (oldIndex.name) {
        console.log(`🗑️  Dropping old gallery text index: ${oldIndex.name}`);
        await galleryCollection.dropIndex(oldIndex.name);
        console.log(`✅ Dropped index: ${oldIndex.name}`);
      }
    }

    // Fix audit_logs collection
    console.log('\n📝 Fixing audit_logs collection...');
    const auditCollection = db.collection('audit_logs');
    const auditIndexes = await auditCollection.indexes();
    console.log('Current audit indexes:');
    auditIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}, options: ${JSON.stringify(index)}`);
    });

    // Drop the timestamp_1 index without TTL so it can be recreated with TTL
    const timestampIndexes = auditIndexes.filter(idx => 
      idx.name === 'timestamp_1' && !idx.expireAfterSeconds
    );

    for (const oldIndex of timestampIndexes) {
      if (oldIndex.name) {
        console.log(`🗑️  Dropping timestamp index without TTL: ${oldIndex.name}`);
        await auditCollection.dropIndex(oldIndex.name);
        console.log(`✅ Dropped index: ${oldIndex.name}`);
      }
    }

    console.log('\n✅ Index cleanup complete!');
    console.log('The server will recreate the correct indexes on next startup.');

  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixIndexes();
