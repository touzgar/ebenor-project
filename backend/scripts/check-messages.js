const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ebenor-creation';

async function checkMessages() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer la collection messages
    const db = mongoose.connection.db;
    const messagesCollection = db.collection('messages');

    // Compter tous les messages
    const totalMessages = await messagesCollection.countDocuments();
    console.log(`\n📊 Total de messages dans la base: ${totalMessages}`);

    if (totalMessages > 0) {
      // Afficher les 10 derniers messages
      const recentMessages = await messagesCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();

      console.log('\n📬 Derniers messages:');
      recentMessages.forEach((msg, index) => {
        console.log(`\n${index + 1}. ${msg.name} (${msg.email})`);
        console.log(`   Sujet: ${msg.subject}`);
        console.log(`   Statut: ${msg.status} | Priorité: ${msg.priority}`);
        console.log(`   Date: ${new Date(msg.createdAt).toLocaleString('fr-FR')}`);
        console.log(`   Message: ${msg.message.substring(0, 100)}...`);
        console.log(`   ID: ${msg._id}`);
      });

      // Statistiques par statut
      const stats = await messagesCollection.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]).toArray();

      console.log('\n📈 Statistiques par statut:');
      stats.forEach(stat => {
        console.log(`   ${stat._id}: ${stat.count}`);
      });
    } else {
      console.log('\n⚠️ Aucun message trouvé dans la base de données');
      console.log('Vérifiez que:');
      console.log('1. MongoDB est bien démarré');
      console.log('2. Le backend est connecté à MongoDB');
      console.log('3. Le message a bien été envoyé depuis le formulaire');
    }

    await mongoose.connection.close();
    console.log('\n✅ Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

checkMessages();
