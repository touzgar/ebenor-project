#!/bin/bash

echo "========================================"
echo "  NETTOYAGE COMPLET ET REDEMARRAGE"
echo "========================================"
echo ""

echo "[1/4] Suppression du cache Next.js..."
rm -rf .next
echo "✓ Cache .next supprimé"

echo ""
echo "[2/4] Suppression du cache node_modules/.cache..."
rm -rf node_modules/.cache
echo "✓ Cache node_modules supprimé"

echo ""
echo "[3/4] Suppression du cache TypeScript..."
rm -f tsconfig.tsbuildinfo
echo "✓ Cache TypeScript supprimé"

echo ""
echo "[4/4] Démarrage du serveur..."
echo ""
echo "========================================"
echo "  SERVEUR EN COURS DE DEMARRAGE..."
echo "========================================"
echo ""
echo "IMPORTANT: Après le démarrage:"
echo "1. Videz le cache de votre navigateur (Ctrl+Shift+Delete)"
echo "2. Rechargez la page avec Ctrl+F5"
echo ""

npm run dev
