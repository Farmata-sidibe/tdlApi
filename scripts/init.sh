#!/bin/bash

# Arrêter le script immédiatement en cas d'erreur
set -e
    # Installer les dépendances NPM et compiler les assets avec Vite
npm install
npm start
# Démarrer Apache en mode premier plan
# Garder le processus Apache actif au premier plan