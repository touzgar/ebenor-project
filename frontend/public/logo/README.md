# 🎨 Guide d'Intégration des Logos ÉBENOR CRÉATION

## 📁 Fichiers de Logo Requis

Placez vos fichiers de logo dans ce dossier avec les noms suivants :

### Logos Principaux
- `logo-full.svg` - Logo complet (icône + texte) - **REQUIS**
- `logo-full.png` - Version PNG du logo complet (fallback)
- `logo-white.svg` - Version blanche pour fonds sombres - **REQUIS**
- `logo-white.png` - Version PNG blanche (fallback)

### Icônes Seules
- `logo-icon.svg` - Icône seule (sans texte) - **REQUIS**
- `logo-icon.png` - Version PNG de l'icône
- `logo-icon-white.svg` - Icône blanche pour fonds sombres
- `logo-icon-white.png` - Version PNG icône blanche

### Favicons (Optionnel)
- `favicon-16x16.png` - Favicon 16x16 pixels
- `favicon-32x32.png` - Favicon 32x32 pixels
- `apple-touch-icon.png` - Icône Apple 180x180 pixels
- `android-chrome-192x192.png` - Icône Android 192x192 pixels

## 🎯 Spécifications Techniques

### Formats Recommandés
- **SVG** : Format vectoriel préféré (scalable, léger)
- **PNG** : Format raster avec transparence (fallback)

### Dimensions Recommandées
- **Logo complet** : Ratio 3:1 (ex: 300x100px, 600x200px)
- **Icône seule** : Format carré (ex: 100x100px, 200x200px)
- **Favicon** : 32x32px minimum

### Couleurs
- **Version claire** : Pour fonds blancs/clairs
- **Version blanche** : Pour fonds sombres/colorés
- **Transparence** : Arrière-plan transparent recommandé

## 🔧 Utilisation dans le Code

### Composant Logo
```tsx
import { Logo } from '@/components/ui/Logo';

// Logo complet (par défaut)
<Logo />

// Icône seule
<Logo variant="icon" />

// Version blanche pour fonds sombres
<Logo theme="dark" />

// Différentes tailles
<Logo size="sm" />   // Petit
<Logo size="md" />   // Moyen (défaut)
<Logo size="lg" />   // Grand
<Logo size="xl" />   // Très grand
```

### Navigation
Le logo est automatiquement utilisé dans la navigation :
- Version complète sur desktop
- Icône seule sur mobile (si l'espace est limité)

### Fallback
Si vos logos personnalisés ne sont pas trouvés, le système utilisera automatiquement le logo par défaut généré par code.

## 📋 Checklist d'Intégration

- [ ] `logo-full.svg` ajouté
- [ ] `logo-white.svg` ajouté  
- [ ] `logo-icon.svg` ajouté
- [ ] Test sur fond blanc ✓
- [ ] Test sur fond sombre ✓
- [ ] Test responsive (mobile/desktop) ✓
- [ ] Favicon mis à jour (optionnel)

## 🚀 Après Ajout des Logos

1. **Redémarrez le serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Vérifiez l'affichage** :
   - Navigation principale
   - Footer
   - Pages admin
   - Différentes tailles d'écran

3. **Testez les thèmes** :
   - Fond clair (logo normal)
   - Fond sombre (logo blanc)

## 🎨 Conseils de Design

### Pour un Rendu Optimal
- **Contraste** : Assurez-vous que le logo est lisible sur tous les fonds
- **Simplicité** : L'icône doit rester reconnaissable même en très petit
- **Cohérence** : Gardez le même style entre toutes les versions
- **Qualité** : Utilisez des fichiers haute résolution

### Formats SVG
- Optimisez vos SVG avec des outils comme SVGO
- Évitez les effets complexes qui ne s'affichent pas bien
- Utilisez des couleurs solides plutôt que des dégradés complexes

## 🔍 Dépannage

### Le logo ne s'affiche pas
1. Vérifiez le nom du fichier (sensible à la casse)
2. Vérifiez le format (SVG recommandé)
3. Consultez la console du navigateur pour les erreurs
4. Redémarrez le serveur de développement

### Le logo est déformé
1. Vérifiez les proportions du fichier original
2. Utilisez `object-contain` dans les styles CSS
3. Assurez-vous que le viewBox SVG est correct

### Performance
- Optimisez la taille des fichiers (< 50KB recommandé)
- Utilisez SVG pour la scalabilité
- Compressez les PNG si nécessaire

## 📞 Support

Si vous rencontrez des problèmes avec l'intégration de vos logos, vérifiez :
1. Les noms de fichiers correspondent exactement
2. Les fichiers sont dans le bon dossier (`frontend/public/logo/`)
3. Le serveur de développement a été redémarré
4. Les permissions de fichiers sont correctes