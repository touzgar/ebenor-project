import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function dropAuditIndexes() {
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

    // Drop all audit_logs indexes except _id_
    console.log('\n📝 Dropping all audit_logs indexes...');
    const auditCollection = db.collection('audit_logs');
    const auditIndexes = await auditCollection.indexes();
    
    console.log('Current audit indexes:');
    auditIndexes.forEach(index => {
      console.log(`  - ${index.name}`);
    });

    for (const index of auditIndexes) {
      if (index.name && index.name !== '_id_') {
        console.log(`🗑️  Dropping index: ${index.name}`);
        await auditCollection.dropIndex(index.name);
        console.log(`✅ Dropped index: ${index.name}`);
      }
    }

    console.log('\n✅ All audit log indexes dropped!');
    console.log('The server will recreate the correct indexes on next startup.');

  } catch (error) {
    console.error('❌ Error dropping indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

dropAuditIndexes();
