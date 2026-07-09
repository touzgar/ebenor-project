import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { AdminUser } from '@/lib/models/AdminUser';

/**
 * SCRIPT TEMPORAIRE - À SUPPRIMER APRÈS UTILISATION
 * 
 * Crée un admin avec:
 * Email: Ebenorcreation@gmail.com
 * Password: 50136602m
 * 
 * Utilisation: Appelez GET /api/create-admin-once UNE SEULE FOIS
 * Puis SUPPRIMEZ ce fichier!
 */

export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await AdminUser.findOne({ email: 'ebenorcreation@gmail.com' });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: '✅ Admin existe déjà! Testez la connexion avec: Ebenorcreation@gmail.com / 50136602m',
        admin: {
          email: existingAdmin.email,
          name: `${existingAdmin.firstName} ${existingAdmin.lastName}`,
          created: 'Already exists'
        },
        instructions: [
          '1. Testez la connexion: https://ebenor-creation.com/admin/login',
          '2. Email: Ebenorcreation@gmail.com',
          '3. Password: 50136602m',
          '4. Si ça marche, dites "ok" pour supprimer ce script'
        ]
      });
    }

    // Créer le nouvel admin
    const admin = new AdminUser({
      firstName: 'Ébenor',
      lastName: 'Création',
      email: 'ebenorcreation@gmail.com', // lowercase pour MongoDB
      password: '50136602m',
      role: 'super_admin',
      permissions: [],
    });
    
    await admin.save();

    return NextResponse.json({
      success: true,
      message: '✅ Admin créé avec succès!',
      admin: {
        email: admin.email,
        name: `${admin.firstName} ${admin.lastName}`,
        role: admin.role,
        created: 'Just now'
      },
      credentials: {
        email: 'Ebenorcreation@gmail.com',
        password: '50136602m'
      },
      instructions: [
        '1. Connectez-vous maintenant: https://ebenor-creation.com/admin/login',
        '2. Email: Ebenorcreation@gmail.com',
        '3. Password: 50136602m',
        '4. Si ça marche, dites "ok" et le script sera supprimé'
      ]
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la création de l\'admin',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});
