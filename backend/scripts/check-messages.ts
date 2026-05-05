import mongoose from 'mongoose';
import { Message } from '../src/models/Message';
import { config } from '../src/config/database';

async function checkMessages() {
  try {
    // Connexion à MongoDB
    await config.connectDB();
    console.log('✅ Connecté à MongoDB');

    // Compter tous les messages
    const totalMessages = await Message.countDocuments();
    console.log(`\n📊 Total de messages dans la base: ${totalMessages}`);

    if (totalMessages > 0) {
      // Afficher les 10 derniers messages
      const recentMessages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      console.log('\n📬 Derniers messages:');
      recentMessages.forEach((msg: any, index: number) => {
        console.log(`\n${index + 1}. ${msg['name']} (${msg['email']})`);
        console.log(`   Sujet: ${msg['subject']}`);
        console.log(`   Statut: ${msg['status']} | Priorité: ${msg['priority']}`);
        console.log(`   Date: ${new Date(msg['createdAt']).toLocaleString('fr-FR')}`);
        console.log(`   Message: ${msg['message'].substring(0, 100)}...`);
      });

      // Statistiques par statut
      const stats = await Message.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      console.log('\n📈 Statistiques par statut:');
      stats.forEach(stat => {
        console.log(`   ${stat._id}: ${stat.count}`);
      });
    } else {
      console.log('\n⚠️ Aucun message trouvé dans la base de données');
    }

    await mongoose.connection.close();
    console.log('\n✅ Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkMessages();
