# 🎨 Guide Rapide - Intégration de Votre Logo ÉBENOR CRÉATION

## 📍 Où Placer Vos Logos

Placez vos fichiers de logo dans le dossier :
```
frontend/public/logo/
```

## 📋 Fichiers Requis (noms exacts)

### Obligatoires
- `logo-full.svg` - Logo complet pour fonds clairs
- `logo-white.svg` - Logo complet pour fonds sombres  
- `logo-icon.svg` - Icône seule pour fonds clairs

### Optionnels
- `logo-icon-white.svg` - Icône seule pour fonds sombres
- `logo-full.png` - Version PNG du logo complet
- `logo-white.png` - Version PNG blanche

## 🚀 Étapes Rapides

1. **Copiez vos logos** dans `frontend/public/logo/`
2. **Nommez-les exactement** comme indiqué ci-dessus
3. **Redémarrez le serveur** : `npm run dev` (dans le dossier frontend)
4. **Vérifiez** que vos logos apparaissent dans la navigation

## ✅ Vérification

Vos logos apparaîtront automatiquement :
- Dans la navigation principale
- Dans le footer
- Dans les pages admin
- Responsive sur mobile/desktop

## 🔧 Si Problème

Si vos logos ne s'affichent pas :
1. Vérifiez les noms de fichiers (exactement comme indiqué)
2. Redémarrez le serveur de développement
3. Consultez la console du navigateur (F12) pour les erreurs

Le système utilisera automatiquement le logo par défaut si vos fichiers ne sont pas trouvés.

---

**Note** : Le composant Logo est déjà configuré et intégré dans toute l'application. Il suffit d'ajouter vos fichiers avec les bons noms !