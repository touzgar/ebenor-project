#!/bin/bash

# Script de configuration initiale pour ÉBENOR CRÉATION
echo "🚀 Configuration initiale de la plateforme ÉBENOR CRÉATION"
echo "=================================================="

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé. Veuillez le configurer avec vos valeurs."
fi

# Créer les répertoires nécessaires
echo "📁 Création des répertoires..."
mkdir -p backend/logs
mkdir -p backend/uploads
mkdir -p nginx/ssl

# Installer les dépendances du backend
echo "📦 Installation des dépendances backend..."
cd backend
npm install
cd ..

# Installer les dépendances du frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "🔧 Prochaines étapes :"
echo "1. Configurez le fichier .env avec vos valeurs"
echo "2. Démarrez les services avec : docker-compose up -d"
echo "3. Ou démarrez en mode développement :"
echo "   - Backend : cd backend && npm run dev"
echo "   - Frontend : cd frontend && npm run dev"
echo ""
echo "🌐 URLs :"
echo "- Site web : http://localhost:3000"
echo "- API : http://localhost:5000"
echo "- Admin : http://localhost:3000/admin"
echo ""
echo "📚 Documentation complète dans README.md"