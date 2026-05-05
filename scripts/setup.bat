@echo off
echo 🚀 Configuration initiale de la plateforme ÉBENOR CRÉATION
echo ==================================================

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

REM Créer le fichier .env s'il n'existe pas
if not exist .env (
    echo 📝 Création du fichier .env...
    copy .env.example .env
    echo ✅ Fichier .env créé. Veuillez le configurer avec vos valeurs.
)

REM Créer les répertoires nécessaires
echo 📁 Création des répertoires...
if not exist backend\logs mkdir backend\logs
if not exist backend\uploads mkdir backend\uploads
if not exist nginx\ssl mkdir nginx\ssl

REM Installer les dépendances du backend
echo 📦 Installation des dépendances backend...
cd backend
call npm install
cd ..

REM Installer les dépendances du frontend
echo 📦 Installation des dépendances frontend...
cd frontend
call npm install
cd ..

echo.
echo ✅ Configuration terminée !
echo.
echo 🔧 Prochaines étapes :
echo 1. Configurez le fichier .env avec vos valeurs
echo 2. Démarrez les services avec : docker-compose up -d
echo 3. Ou démarrez en mode développement :
echo    - Backend : cd backend ^&^& npm run dev
echo    - Frontend : cd frontend ^&^& npm run dev
echo.
echo 🌐 URLs :
echo - Site web : http://localhost:3000
echo - API : http://localhost:5000
echo - Admin : http://localhost:3000/admin
echo.
echo 📚 Documentation complète dans README.md
pause