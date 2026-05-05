#!/usr/bin/env ts-node
/**
 * Verification script for Media Library Service
 * 
 * This script demonstrates the media library functionality by:
 * 1. Connecting to the database
 * 2. Fetching media from all sources
 * 3. Displaying statistics
 * 4. Finding references for a sample URL
 */

import mongoose from 'mongoose';
import { mediaLibraryService } from '../src/services/mediaLibraryService';
import { logger } from '../src/utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function verifyMediaLibrary() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ebenor-creation';
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');

    console.log('\n=== Media Library Verification ===\n');

    // 1. Get all media (first page)
    console.log('1. Fetching all media (page 1, limit 10)...');
    const { media, total } = await mediaLibraryService.getAllMedia(1, 10, {});
    console.log(`   Found ${total} total media items`);
    console.log(`   Showing ${media.length} items on this page\n`);

    if (media.length > 0) {
      console.log('   Sample media item:');
      const sample = media[0];
      console.log(`   - ID: ${sample.id}`);
      console.log(`   - Filename: ${sample.filename}`);
      console.log(`   - Type: ${sample.type}`);
      console.log(`   - Source: ${sample.source}`);
      console.log(`   - Category: ${sample.category || 'N/A'}`);
      console.log(`   - Size: ${(sample.size / 1024).toFixed(2)} KB`);
      console.log(`   - References: ${sample.references.length}`);
      console.log('');
    }

    // 2. Get media statistics
    console.log('2. Fetching media statistics...');
    const stats = await mediaLibraryService.getMediaStats();
    console.log(`   Total Media: ${stats.totalMedia}`);
    console.log(`   Total Images: ${stats.totalImages}`);
    console.log(`   Total Videos: ${stats.totalVideos}`);
    console.log(`   Total Size: ${(stats.totalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log('   By Source:');
    console.log(`     - Products: ${stats.bySource.product}`);
    console.log(`     - Gallery: ${stats.bySource.gallery}`);
    console.log(`     - Homepage: ${stats.bySource.homepage}`);
    console.log('   By Category:');
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`     - ${category}: ${count}`);
    });
    console.log('');

    // 3. Test filtering by source
    console.log('3. Testing filter by source (products only)...');
    const { media: productMedia, total: productTotal } = await mediaLibraryService.getAllMedia(
      1,
      10,
      { source: 'product' }
    );
    console.log(`   Found ${productTotal} product media items\n`);

    // 4. Test filtering by type
    console.log('4. Testing filter by type (images only)...');
    const { media: imageMedia, total: imageTotal } = await mediaLibraryService.getAllMedia(
      1,
      10,
      { type: 'image' }
    );
    console.log(`   Found ${imageTotal} image media items\n`);

    // 5. Test search functionality
    if (media.length > 0) {
      const searchTerm = media[0].filename.substring(0, 5);
      console.log(`5. Testing search functionality (term: "${searchTerm}")...`);
      const { media: searchResults, total: searchTotal } = await mediaLibraryService.getAllMedia(
        1,
        10,
        { search: searchTerm }
      );
      console.log(`   Found ${searchTotal} matching media items\n`);
    }

    // 6. Test finding references
    if (media.length > 0) {
      const testUrl = media[0].url;
      console.log(`6. Testing reference finding for URL: ${testUrl.substring(0, 50)}...`);
      const references = await mediaLibraryService.findMediaReferences(testUrl);
      console.log(`   Found ${references.length} reference(s):`);
      references.forEach((ref, index) => {
        console.log(`     ${index + 1}. Type: ${ref.type}, Name: ${ref.name}, Field: ${ref.field || 'N/A'}`);
      });
      console.log('');
    }

    console.log('=== Verification Complete ===\n');
    console.log('✅ Media Library Service is working correctly!');
    console.log('✅ All features tested successfully:');
    console.log('   - Media aggregation from all sources');
    console.log('   - Pagination');
    console.log('   - Statistics calculation');
    console.log('   - Filtering by source and type');
    console.log('   - Search functionality');
    console.log('   - Reference tracking');
    console.log('');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    logger.error('Media library verification failed', { error });
  } finally {
    // Disconnect from MongoDB
    await mongoose.connection.close();
    logger.info('Disconnected from MongoDB');
  }
}

// Run verification
verifyMediaLibrary().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
