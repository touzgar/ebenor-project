# 🎬 Vidéo Hero Background - Instructions

## 📍 Placement de la Vidéo

Placez votre fichier vidéo ici avec le nom exact :
```
hero.mp4
```

## 🎯 Spécifications Recommandées

### **Format Vidéo**
- **Format** : MP4 (H.264)
- **Résolution** : 1920x1080 minimum (Full HD)
- **Ratio** : 16:9 ou plus large (21:9 pour cinématique)
- **Durée** : 10-30 secondes (pour loop fluide)

### **Optimisations Techniques**
- **Taille fichier** : < 10MB pour performance web
- **Framerate** : 30fps (suffisant pour web)
- **Bitrate** : 2-5 Mbps (équilibre qualité/taille)
- **Audio** : Supprimer (vidéo en muted)

### **Contenu Suggéré**
- **Thème** : Atelier de menuiserie, bois noble, artisanat
- **Style** : Cinématographique, mouvements lents
- **Couleurs** : Tons chauds (bois, or) compatibles avec overlay
- **Mouvement** : Subtil (zoom, travelling, rotation douce)

## 🛠️ Outils de Compression

### **En Ligne (Gratuit)**
- **CloudConvert** : cloudconvert.com
- **Online Video Converter** : onlinevideoconverter.com
- **Compress Video** : compressvideo.io

### **Logiciels**
- **HandBrake** (gratuit) : handbrake.fr
- **Adobe Media Encoder** (payant)
- **FFmpeg** (ligne de commande)

## 📱 Test de Compatibilité

### **Navigateurs Supportés**
- ✅ Chrome 36+
- ✅ Firefox 42+
- ✅ Safari 10+
- ✅ Edge 12+
- ✅ Mobile Safari iOS 10+
- ✅ Chrome Mobile 53+

### **Fallback Automatique**
Si la vidéo ne charge pas, une image Unsplash s'affiche automatiquement.

## 🎨 Exemples de Vidéos Appropriées

### **Scènes d'Atelier**
- Artisan travaillant le bois
- Outils de menuiserie en action
- Copeaux de bois qui tombent
- Finition d'un meuble

### **Produits Finis**
- Cuisine moderne en rotation
- Dressing luxueux (travelling)
- Mobilier haut de gamme (zoom)
- Détails du bois (macro)

### **Ambiance**
- Atelier avec lumière naturelle
- Bois noble en gros plan
- Textures et veines du bois
- Outils traditionnels

## ⚡ Optimisation Performance

### **Commande FFmpeg (Exemple)**
```bash
ffmpeg -i input.mov -c:v libx264 -crf 28 -preset slow -vf "scale=1920:1080" -an hero.mp4
```

### **Paramètres Expliqués**
- `-c:v libx264` : Codec H.264
- `-crf 28` : Qualité (18-28 recommandé)
- `-preset slow` : Compression optimisée
- `-vf "scale=1920:1080"` : Redimensionnement
- `-an` : Supprime l'audio

## 🔧 Dépannage

### **Vidéo ne s'affiche pas**
1. Vérifier le nom : `hero.mp4` (exact)
2. Vérifier le format : MP4 H.264
3. Vérifier la taille : < 50MB
4. Redémarrer le serveur de développement

### **Vidéo ne démarre pas automatiquement**
- Normal sur mobile (politique navigateur)
- L'autoplay fonctionne car vidéo en `muted`
- Fallback image s'affiche si problème

### **Performance lente**
1. Réduire la taille du fichier
2. Baisser la résolution si nécessaire
3. Augmenter la compression (CRF plus élevé)

## 📋 Checklist Final

- [ ] Fichier nommé `hero.mp4`
- [ ] Format MP4 H.264
- [ ] Taille < 10MB
- [ ] Résolution 1920x1080+
- [ ] Durée 10-30 secondes
- [ ] Pas d'audio
- [ ] Contenu approprié (bois/artisanat)
- [ ] Test sur mobile et desktop

## 🎬 Résultat Attendu

Une fois la vidéo placée, vous obtiendrez :
- ✅ Background vidéo fullscreen
- ✅ Autoplay avec loop
- ✅ Overlay sombre élégant
- ✅ Logo circulaire au centre
- ✅ Animations premium
- ✅ Effet parallax au scroll

**Votre Hero Section sera digne des plus grandes marques de luxe !** 🏆✨