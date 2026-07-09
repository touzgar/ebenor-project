import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { AdminUser } from '@/lib/models/AdminUser';

/**
 * SCRIPT TEMPORAIRE - À SUPPRIMER APRÈS UTILISATION
 * 
 * Crée un admin avec:
 * Email: Ebenorcreation@gmail.com
 * Password: Ebenor2024!
 * 
 * Utilisation: Appelez GET /api/create-admin-once UNE SEULE FOIS
 * Puis SUPPRIMEZ ce fichier!
 */

export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await AdminUser.findOne({ email: 'Ebenorcreation@gmail.com' });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin existe déjà! Vous pouvez supprimer ce fichier.',
        admin: {
          email: existingAdmin.email,
          name: `${existingAdmin.firstName} ${existingAdmin.lastName}`
        }
      });
    }

    // Créer le nouvel admin avec un mot de passe qui respecte les règles
    const admin = new AdminUser({
      firstName: 'Ébenor',
      lastName: 'Création',
      email: 'Ebenorcreation@gmail.com',
      password: 'Ebenor2024!', // Mot de passe avec majuscule, minuscule, chiffre, caractère spécial
      role: 'super_admin',
      permissions: [], // Auto-rempli par le middleware basé sur le rôle
    });
    
    await admin.save();

    return NextResponse.json({
      success: true,
      message: '✅ Admin créé avec succès! Vous pouvez maintenant supprimer ce fichier.',
      admin: {
        email: admin.email,
        name: `${admin.firstName} ${admin.lastName}`,
        role: admin.role
      },
      credentials: {
        email: 'Ebenorcreation@gmail.com',
        password: 'Ebenor2024!'
      },
      instructions: [
        '1. Connectez-vous avec: Ebenorcreation@gmail.com / Ebenor2024!',
        '2. Supprimez le fichier: frontend/src/app/api/create-admin-once/route.ts',
        '3. Redéployez le site'
      ]
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la création de l\'admin',
      error: error.message
    }, { status: 500 });
  }
});
