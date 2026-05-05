const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@ebenor-creation.tn'; // Changez si nécessaire
const ADMIN_PASSWORD = 'Admin@2024'; // Changez si nécessaire

async function testAdminAPI() {
  try {
    console.log('🔐 Connexion en tant qu\'admin...');
    
    // 1. Login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    if (!loginResponse.data.success) {
      console.error('❌ Échec de la connexion');
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Connecté avec succès');
    console.log(`Token: ${token.substring(0, 20)}...`);

    // 2. Récupérer les messages
    console.log('\n📬 Récupération des messages...');
    const messagesResponse = await axios.get(`${API_URL}/admin/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (messagesResponse.data.success) {
      console.log(`✅ ${messagesResponse.data.data.length} message(s) récupéré(s)`);
      console.log('\nMessages:');
      messagesResponse.data.data.forEach((msg, index) => {
        console.log(`\n${index + 1}. ${msg.name} (${msg.email})`);
        console.log(`   Sujet: ${msg.subject}`);
        console.log(`   Statut: ${msg.status} | Priorité: ${msg.priority}`);
        console.log(`   Date: ${new Date(msg.createdAt).toLocaleString('fr-FR')}`);
      });

      console.log('\n📊 Pagination:');
      console.log(`   Page: ${messagesResponse.data.pagination.page}`);
      console.log(`   Total: ${messagesResponse.data.pagination.total}`);
      console.log(`   Pages: ${messagesResponse.data.pagination.pages}`);
    } else {
      console.error('❌ Échec de la récupération des messages');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAdminAPI();
