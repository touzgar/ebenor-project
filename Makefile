# Makefile pour ÉBENOR CRÉATION

.PHONY: help setup install dev build start stop clean test lint format

# Couleurs pour les messages
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

help: ## Afficher l'aide
	@echo "$(GREEN)ÉBENOR CRÉATION - Commandes disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

setup: ## Configuration initiale du projet
	@echo "$(GREEN)Configuration initiale...$(NC)"
	@chmod +x scripts/setup.sh
	@./scripts/setup.sh

install: ## Installer les dépendances
	@echo "$(GREEN)Installation des dépendances...$(NC)"
	@cd backend && npm install
	@cd frontend && npm install

dev: ## Démarrer en mode développement avec Docker
	@echo "$(GREEN)Démarrage en mode développement...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-local: ## Démarrer en mode développement local (sans Docker)
	@echo "$(GREEN)Démarrage local...$(NC)"
	@echo "$(YELLOW)Démarrage du backend...$(NC)"
	@cd backend && npm run dev &
	@echo "$(YELLOW)Démarrage du frontend...$(NC)"
	@cd frontend && npm run dev

build: ## Construire les images Docker pour la production
	@echo "$(GREEN)Construction des images...$(NC)"
	@docker-compose build

start: ## Démarrer en mode production
	@echo "$(GREEN)Démarrage en production...$(NC)"
	@docker-compose up -d

stop: ## Arrêter tous les services
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	@docker-compose down

restart: stop start ## Redémarrer tous les services

logs: ## Afficher les logs
	@docker-compose logs -f

logs-backend: ## Afficher les logs du backend
	@docker-compose logs -f backend

logs-frontend: ## Afficher les logs du frontend
	@docker-compose logs -f frontend

clean: ## Nettoyer les containers et volumes
	@echo "$(RED)Nettoyage...$(NC)"
	@docker-compose down -v --remove-orphans
	@docker system prune -f

clean-all: ## Nettoyage complet (images, containers, volumes)
	@echo "$(RED)Nettoyage complet...$(NC)"
	@docker-compose down -v --remove-orphans --rmi all
	@docker system prune -af

test: ## Lancer tous les tests
	@echo "$(GREEN)Lancement des tests...$(NC)"
	@cd backend && npm test
	@cd frontend && npm test

test-backend: ## Lancer les tests backend
	@cd backend && npm test

test-frontend: ## Lancer les tests frontend
	@cd frontend && npm test

test-coverage: ## Lancer les tests avec couverture
	@echo "$(GREEN)Tests avec couverture...$(NC)"
	@cd backend && npm run test:coverage
	@cd frontend && npm run test:coverage

lint: ## Vérifier le code avec ESLint
	@echo "$(GREEN)Vérification du code...$(NC)"
	@cd backend && npm run lint
	@cd frontend && npm run lint

lint-fix: ## Corriger automatiquement les erreurs ESLint
	@echo "$(GREEN)Correction automatique...$(NC)"
	@cd backend && npm run lint:fix
	@cd frontend && npm run lint:fix

format: ## Formater le code avec Prettier
	@echo "$(GREEN)Formatage du code...$(NC)"
	@cd backend && npm run format
	@cd frontend && npm run format

type-check: ## Vérifier les types TypeScript
	@echo "$(GREEN)Vérification des types...$(NC)"
	@cd backend && npm run type-check
	@cd frontend && npm run type-check

db-seed: ## Initialiser la base de données avec des données de test
	@echo "$(GREEN)Initialisation de la base de données...$(NC)"
	@docker-compose exec backend npm run db:seed

db-reset: ## Réinitialiser la base de données
	@echo "$(YELLOW)Réinitialisation de la base de données...$(NC)"
	@docker-compose exec mongodb mongo ebenor-creation --eval "db.dropDatabase()"

backup: ## Sauvegarder la base de données
	@echo "$(GREEN)Sauvegarde de la base de données...$(NC)"
	@mkdir -p backups
	@docker-compose exec mongodb mongodump --db ebenor-creation --out /tmp/backup
	@docker cp $$(docker-compose ps -q mongodb):/tmp/backup ./backups/backup-$$(date +%Y%m%d-%H%M%S)

restore: ## Restaurer la base de données (usage: make restore BACKUP=backup-20231201-120000)
	@echo "$(GREEN)Restauration de la base de données...$(NC)"
	@docker cp ./backups/$(BACKUP) $$(docker-compose ps -q mongodb):/tmp/restore
	@docker-compose exec mongodb mongorestore --db ebenor-creation /tmp/restore/ebenor-creation

status: ## Afficher le statut des services
	@echo "$(GREEN)Statut des services:$(NC)"
	@docker-compose ps

shell-backend: ## Ouvrir un shell dans le container backend
	@docker-compose exec backend sh

shell-frontend: ## Ouvrir un shell dans le container frontend
	@docker-compose exec frontend sh

shell-db: ## Ouvrir un shell MongoDB
	@docker-compose exec mongodb mongo ebenor-creation

update: ## Mettre à jour les dépendances
	@echo "$(GREEN)Mise à jour des dépendances...$(NC)"
	@cd backend && npm update
	@cd frontend && npm update

security-audit: ## Audit de sécurité des dépendances
	@echo "$(GREEN)Audit de sécurité...$(NC)"
	@cd backend && npm audit
	@cd frontend && npm audit

# Commandes par défaut
.DEFAULT_GOAL := help