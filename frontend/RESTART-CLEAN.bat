@echo off
echo ========================================
echo   NETTOYAGE COMPLET ET REDEMARRAGE
echo ========================================
echo.

echo [1/4] Suppression du cache Next.js...
if exist .next rmdir /s /q .next
echo ✓ Cache .next supprime

echo.
echo [2/4] Suppression du cache node_modules/.cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✓ Cache node_modules supprime

echo.
echo [3/4] Suppression du cache TypeScript...
if exist tsconfig.tsbuildinfo del /q tsconfig.tsbuildinfo
echo ✓ Cache TypeScript supprime

echo.
echo [4/4] Demarrage du serveur...
echo.
echo ========================================
echo   SERVEUR EN COURS DE DEMARRAGE...
echo ========================================
echo.
echo IMPORTANT: Apres le demarrage:
echo 1. Videz le cache de votre navigateur (Ctrl+Shift+Delete)
echo 2. Rechargez la page avec Ctrl+F5
echo.

npm run dev
