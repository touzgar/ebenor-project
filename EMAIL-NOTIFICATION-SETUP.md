# 📧 Configuration des Notifications Email (Optionnel)

## Vue d'ensemble

Ce guide explique comment configurer l'envoi automatique d'emails quand un utilisateur envoie un message via le formulaire de contact.

**Statut actuel** : Les messages sont enregistrés dans la base de données et visibles dans l'admin, mais **aucun email n'est envoyé automatiquement**.

**Ce guide est optionnel** - Le système fonctionne parfaitement sans emails automatiques.

---

## 🎯 Objectifs

Quand un utilisateur envoie un message via le formulaire :

1. **Email à l'admin** : "Vous avez reçu un nouveau message de [Nom]"
2. **Email à l'utilisateur** : "Nous avons bien reçu votre message"

---

## 📦 Services d'Email Recommandés

### Option 1 : SendGrid (Recommandé)
- ✅ **Gratuit** : 100 emails/jour
- ✅ Facile à configurer
- ✅ API simple
- ✅ Statistiques détaillées
- 🔗 https://sendgrid.com

### Option 2 : Mailgun
- ✅ **Gratuit** : 5000 emails/mois (3 premiers mois)
- ✅ Bonne documentation
- ✅ API REST
- 🔗 https://www.mailgun.com

### Option 3 : Nodemailer + SMTP
- ✅ Gratuit avec votre serveur SMTP
- ✅ Contrôle total
- ⚠️ Configuration plus complexe
- 🔗 https://nodemailer.com

### Option 4 : Resend (Moderne)
- ✅ **Gratuit** : 3000 emails/mois
- ✅ Interface moderne
- ✅ React Email support
- 🔗 https://resend.com

---

## 🔧 Implémentation avec SendGrid

### Étape 1 : Créer un Compte SendGrid

1. Allez sur https://sendgrid.com
2. Créez un compte gratuit
3. Vérifiez votre email
4. Créez une API Key :
   - Settings → API Keys → Create API Key
   - Nom : "Ebenor Contact Form"
   - Permissions : "Full Access" ou "Mail Send"
   - Copiez la clé (vous ne la reverrez plus !)

### Étape 2 : Installer le Package

```bash
cd backend
npm install @sendgrid/mail
```

### Étape 3 : Configurer les Variables d'Environnement

**Fichier** : `backend/.env`

```env
# Email Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=contact@ebenor-creation.tn
EMAIL_ADMIN=admin@ebenor-creation.tn
```

### Étape 4 : Créer le Service Email

**Fichier** : `backend/src/services/emailService.ts`

```typescript
import sgMail from '@sendgrid/mail';
import { logger } from '@/utils/logger';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send email using SendGrid
 */
export const sendEmail = async (options: SendEmailOptions): Promise<boolean> => {
  try {
    const msg = {
      to: options.to,
      from: process.env.EMAIL_FROM || 'contact@ebenor-creation.tn',
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await sgMail.send(msg);
    logger.info(`Email sent to ${options.to}`);
    return true;
  } catch (error: any) {
    logger.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send notification to admin when new message received
 */
export const sendNewMessageNotification = async (message: any): Promise<boolean> => {
  const subject = `Nouveau message de ${message.name}`;
  
  const text = `
Vous avez reçu un nouveau message via le formulaire de contact.

De: ${message.name}
Email: ${message.email}
Téléphone: ${message.phone || 'Non fourni'}
Sujet: ${message.subject}

Message:
${message.message}

---
Voir le message dans l'admin: ${process.env.FRONTEND_URL}/admin/messages/${message._id}
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #C9A14A; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #C9A14A; margin: 15px 0; }
    .button { display: inline-block; padding: 12px 24px; background: #C9A14A; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Nouveau Message</h1>
    </div>
    <div class="content">
      <p>Vous avez reçu un nouveau message via le formulaire de contact.</p>
      
      <div class="field">
        <span class="label">De:</span>
        <span class="value">${message.name}</span>
      </div>
      
      <div class="field">
        <span class="label">Email:</span>
        <span class="value">${message.email}</span>
      </div>
      
      ${message.phone ? `
      <div class="field">
        <span class="label">Téléphone:</span>
        <span class="value">${message.phone}</span>
      </div>
      ` : ''}
      
      <div class="field">
        <span class="label">Sujet:</span>
        <span class="value">${message.subject}</span>
      </div>
      
      <div class="message-box">
        <strong>Message:</strong><br>
        ${message.message.replace(/\n/g, '<br>')}
      </div>
      
      <a href="${process.env.FRONTEND_URL}/admin/messages/${message._id}" class="button">
        Voir dans l'admin
      </a>
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmail({
    to: process.env.EMAIL_ADMIN || 'admin@ebenor-creation.tn',
    subject,
    text,
    html,
  });
};

/**
 * Send confirmation email to user
 */
export const sendMessageConfirmation = async (message: any): Promise<boolean> => {
  const subject = 'Nous avons bien reçu votre message';
  
  const text = `
Bonjour ${message.name},

Nous avons bien reçu votre message concernant "${message.subject}".

Notre équipe vous répondra dans les plus brefs délais, généralement sous 48 heures.

Merci de votre confiance !

---
ÉBENOR CRÉATION
Menuiserie Haut de Gamme
contact@ebenor-creation.tn
+216 XX XXX XXX
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #C9A14A; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Message Reçu</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${message.name}</strong>,</p>
      
      <p>Nous avons bien reçu votre message concernant <strong>"${message.subject}"</strong>.</p>
      
      <p>Notre équipe vous répondra dans les plus brefs délais, généralement sous 48 heures.</p>
      
      <p>Merci de votre confiance !</p>
    </div>
    <div class="footer">
      <strong>ÉBENOR CRÉATION</strong><br>
      Menuiserie Haut de Gamme<br>
      contact@ebenor-creation.tn | +216 XX XXX XXX
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmail({
    to: message.email,
    subject,
    text,
    html,
  });
};

export const emailService = {
  sendEmail,
  sendNewMessageNotification,
  sendMessageConfirmation,
};
```

### Étape 5 : Modifier le Controller des Messages

**Fichier** : `backend/src/controllers/messageController.ts`

Ajoutez l'import :
```typescript
import { emailService } from '@/services/emailService';
```

Dans la fonction `createMessage`, après l'enregistrement en base de données :

```typescript
// Existing code...
const message = await Message.create(messageData);

// NEW: Send email notifications
try {
  // Send notification to admin
  await emailService.sendNewMessageNotification(message);
  
  // Send confirmation to user
  await emailService.sendMessageConfirmation(message);
} catch (emailError) {
  // Log error but don't fail the request
  logger.error('Error sending email notifications:', emailError);
}

// Existing code...
res.status(201).json({
  success: true,
  message: 'Message créé avec succès',
  data: message,
});
```

### Étape 6 : Tester

1. Redémarrez le backend :
```bash
cd backend
npm run dev
```

2. Envoyez un message via le formulaire de contact

3. Vérifiez :
   - ✅ Message enregistré dans la base de données
   - ✅ Email reçu par l'admin
   - ✅ Email de confirmation reçu par l'utilisateur

---

## 🔍 Vérification SendGrid

### Dashboard SendGrid
1. Allez sur https://app.sendgrid.com
2. Activity → Email Activity
3. Vous verrez tous les emails envoyés avec leur statut

### Statuts possibles
- **Delivered** : Email livré avec succès ✅
- **Processed** : Email en cours de traitement ⏳
- **Bounced** : Email rejeté (adresse invalide) ❌
- **Dropped** : Email non envoyé (spam, liste noire) ⚠️

---

## 🎨 Personnalisation des Emails

### Templates HTML Avancés

Pour des emails plus beaux, utilisez :
- **MJML** : https://mjml.io (framework email responsive)
- **React Email** : https://react.email (composants React pour emails)
- **Maizzle** : https://maizzle.com (framework Tailwind pour emails)

### Variables Dynamiques

Ajoutez plus d'informations dans les emails :
```typescript
- Date et heure du message
- Priorité détectée automatiquement
- Lien direct vers le message dans l'admin
- Statistiques (nombre de messages ce mois-ci)
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais exposer l'API Key** :
   - Toujours dans `.env`
   - Jamais dans le code
   - Jamais dans Git

2. **Vérifier l'email de l'expéditeur** :
   - Utiliser un domaine vérifié
   - Configurer SPF, DKIM, DMARC

3. **Rate Limiting** :
   - Limiter le nombre d'emails par IP
   - Éviter le spam

4. **Validation** :
   - Vérifier que l'email est valide
   - Sanitizer les données avant envoi

---

## 📊 Statistiques et Monitoring

### Logs à Surveiller

```typescript
- Nombre d'emails envoyés par jour
- Taux de livraison
- Taux d'ouverture (si tracking activé)
- Erreurs d'envoi
```

### Alertes

Configurez des alertes si :
- Trop d'emails échouent
- Quota SendGrid atteint
- Erreurs répétées

---

## 💰 Coûts

### SendGrid Gratuit
- **100 emails/jour** = 3000 emails/mois
- Suffisant pour un site de PME

### Si vous dépassez
- **Essentials** : 19.95$/mois pour 50,000 emails
- **Pro** : 89.95$/mois pour 100,000 emails

### Alternatives Gratuites
- **Mailgun** : 5000 emails/mois (3 premiers mois)
- **Resend** : 3000 emails/mois
- **Brevo (ex-Sendinblue)** : 300 emails/jour

---

## 🧪 Tests

### Test en Développement

Utilisez **Mailtrap** pour tester sans envoyer de vrais emails :
1. Créez un compte sur https://mailtrap.io
2. Utilisez les credentials SMTP de test
3. Tous les emails sont capturés dans Mailtrap

### Test en Production

1. Envoyez un message de test
2. Vérifiez votre boîte email
3. Vérifiez le dashboard SendGrid
4. Vérifiez les logs du backend

---

## ❓ FAQ

### Q: Les emails vont dans les spams ?
**R:** Configurez SPF, DKIM et DMARC pour votre domaine. SendGrid fournit les instructions.

### Q: Puis-je utiliser mon propre serveur SMTP ?
**R:** Oui, utilisez Nodemailer avec vos credentials SMTP.

### Q: Comment personnaliser l'expéditeur ?
**R:** Vérifiez votre domaine dans SendGrid, puis utilisez `from: 'contact@votre-domaine.com'`

### Q: Que faire si SendGrid est bloqué ?
**R:** Utilisez une alternative (Mailgun, Resend, Postmark)

---

## ✅ Checklist d'Implémentation

- [ ] Créer un compte SendGrid
- [ ] Obtenir l'API Key
- [ ] Ajouter les variables d'environnement
- [ ] Installer `@sendgrid/mail`
- [ ] Créer `emailService.ts`
- [ ] Modifier `messageController.ts`
- [ ] Redémarrer le backend
- [ ] Tester l'envoi d'un message
- [ ] Vérifier la réception des emails
- [ ] Vérifier le dashboard SendGrid

---

## 🎉 Conclusion

L'envoi d'emails est **optionnel** mais **recommandé** pour :
- ✅ Notifier l'admin immédiatement
- ✅ Rassurer l'utilisateur (confirmation)
- ✅ Professionnalisme accru
- ✅ Meilleure réactivité

**Le système fonctionne parfaitement sans emails** - les messages sont visibles dans l'admin !

---

## 📚 Ressources

- SendGrid Docs : https://docs.sendgrid.com
- Nodemailer : https://nodemailer.com
- MJML : https://mjml.io
- React Email : https://react.email
- Mailtrap : https://mailtrap.io

**Bon développement !** 📧
