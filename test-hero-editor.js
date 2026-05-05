/**
 * Hero Section Editor Test Script
 * This script tests the hero section editor functionality
 */

const https = require('http');

// Test configuration
const API_BASE = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'achref@ebenor-creation.tn';
const ADMIN_PASSWORD = 'Admin123!';

let authToken = null;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testLogin() {
  console.log('\n🔐 Test 1: Admin Login');
  console.log('=' .repeat(50));
  
  try {
    const response = await makeRequest('POST', '/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (response.status === 200 && response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Login successful');
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
      return true;
    } else {
      console.log('❌ Login failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return false;
  }
}

async function testGetHomeContent() {
  console.log('\n📖 Test 2: Get Home Content');
  console.log('=' .repeat(50));
  
  try {
    const response = await makeRequest('GET', '/home');

    if (response.status === 200 && response.data.success) {
      const hero = response.data.data.hero;
      console.log('✅ Home content retrieved');
      console.log(`   Title: ${hero.title}`);
      console.log(`   Subtitle: ${hero.subtitle.substring(0, 50)}...`);
      console.log(`   CTA Text: ${hero.ctaText}`);
      console.log(`   CTA Link: ${hero.ctaLink}`);
      console.log(`   Background Image: ${hero.backgroundImage.substring(0, 50)}...`);
      return hero;
    } else {
      console.log('❌ Failed to get home content:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error getting home content:', error.message);
    return null;
  }
}

async function testUpdateHeroValid() {
  console.log('\n✏️  Test 3: Update Hero Section (Valid Data)');
  console.log('=' .repeat(50));
  
  const validHero = {
    hero: {
      title: 'Test Title - Valid',
      subtitle: 'Test subtitle with valid length and content',
      ctaText: 'Click Here',
      ctaLink: '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    },
  };

  try {
    const response = await makeRequest('PUT', '/admin/home', validHero, authToken);

    if (response.status === 200 && response.data.success) {
      console.log('✅ Hero section updated successfully');
      return true;
    } else {
      console.log('❌ Failed to update hero section:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error updating hero section:', error.message);
    return false;
  }
}

async function testUpdateHeroInvalid() {
  console.log('\n❌ Test 4: Update Hero Section (Invalid Data)');
  console.log('=' .repeat(50));
  
  const tests = [
    {
      name: 'Title too long (201 chars)',
      data: {
        hero: {
          title: 'A'.repeat(201),
          subtitle: 'Valid subtitle',
          ctaText: 'Click',
          ctaLink: '/contact',
          backgroundImage: 'https://example.com/image.jpg',
        },
      },
    },
    {
      name: 'Subtitle too long (501 chars)',
      data: {
        hero: {
          title: 'Valid title',
          subtitle: 'A'.repeat(501),
          ctaText: 'Click',
          ctaLink: '/contact',
          backgroundImage: 'https://example.com/image.jpg',
        },
      },
    },
    {
      name: 'CTA text too long (51 chars)',
      data: {
        hero: {
          title: 'Valid title',
          subtitle: 'Valid subtitle',
          ctaText: 'A'.repeat(51),
          ctaLink: '/contact',
          backgroundImage: 'https://example.com/image.jpg',
        },
      },
    },
    {
      name: 'Missing required field (title)',
      data: {
        hero: {
          subtitle: 'Valid subtitle',
          ctaText: 'Click',
          ctaLink: '/contact',
          backgroundImage: 'https://example.com/image.jpg',
        },
      },
    },
  ];

  for (const test of tests) {
    console.log(`\n   Testing: ${test.name}`);
    try {
      const response = await makeRequest('PUT', '/admin/home', test.data, authToken);

      if (response.status === 400 || !response.data.success) {
        console.log(`   ✅ Correctly rejected: ${response.data.message || 'Validation error'}`);
      } else {
        console.log(`   ⚠️  Should have been rejected but was accepted`);
      }
    } catch (error) {
      console.log(`   ✅ Correctly rejected with error: ${error.message}`);
    }
  }
}

async function testPublishToggle() {
  console.log('\n🔄 Test 5: Publish/Unpublish Toggle');
  console.log('=' .repeat(50));
  
  // Test publish
  console.log('\n   Testing: Publish hero section');
  try {
    const response = await makeRequest(
      'POST',
      '/admin/home/publish',
      { section: 'hero', published: true },
      authToken
    );

    if (response.status === 200 && response.data.success) {
      console.log('   ✅ Hero section published successfully');
    } else {
      console.log('   ❌ Failed to publish:', response.data.message);
    }
  } catch (error) {
    console.log('   ❌ Error publishing:', error.message);
  }

  // Test unpublish
  console.log('\n   Testing: Unpublish hero section');
  try {
    const response = await makeRequest(
      'POST',
      '/admin/home/publish',
      { section: 'hero', published: false },
      authToken
    );

    if (response.status === 200 && response.data.success) {
      console.log('   ✅ Hero section unpublished successfully');
    } else {
      console.log('   ❌ Failed to unpublish:', response.data.message);
    }
  } catch (error) {
    console.log('   ❌ Error unpublishing:', error.message);
  }

  // Test invalid section
  console.log('\n   Testing: Invalid section name');
  try {
    const response = await makeRequest(
      'POST',
      '/admin/home/publish',
      { section: 'invalid', published: true },
      authToken
    );

    if (response.status === 400 || !response.data.success) {
      console.log('   ✅ Correctly rejected invalid section');
    } else {
      console.log('   ⚠️  Should have rejected invalid section');
    }
  } catch (error) {
    console.log('   ✅ Correctly rejected with error');
  }
}

async function testAuthenticationRequired() {
  console.log('\n🔒 Test 6: Authentication Required');
  console.log('=' .repeat(50));
  
  console.log('\n   Testing: Update without token');
  try {
    const response = await makeRequest('PUT', '/admin/home', {
      hero: {
        title: 'Test',
        subtitle: 'Test',
        ctaText: 'Test',
        ctaLink: '/test',
        backgroundImage: 'https://example.com/test.jpg',
      },
    });

    if (response.status === 401 || !response.data.success) {
      console.log('   ✅ Correctly rejected unauthenticated request');
    } else {
      console.log('   ⚠️  Should have rejected unauthenticated request');
    }
  } catch (error) {
    console.log('   ✅ Correctly rejected with error');
  }
}

// Run all tests
async function runTests() {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('  HERO SECTION EDITOR - API TESTS');
  console.log('═'.repeat(60));

  const loginSuccess = await testLogin();
  
  if (!loginSuccess) {
    console.log('\n❌ Cannot proceed without authentication');
    return;
  }

  await testGetHomeContent();
  await testUpdateHeroValid();
  await testUpdateHeroInvalid();
  await testPublishToggle();
  await testAuthenticationRequired();

  console.log('\n');
  console.log('═'.repeat(60));
  console.log('  TEST SUITE COMPLETED');
  console.log('═'.repeat(60));
  console.log('\n');
}

// Run the tests
runTests().catch(console.error);
