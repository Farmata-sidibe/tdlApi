# Utiliser l'image officielle Node.js
FROM node:18

# Installer les dépendances système requises pour Puppeteer
RUN apt-get update && apt-get install -y \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libatk1.0-0 \
  libcups2 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libappindicator3-1 \
  libdbusmenu-glib4 \
  libdbusmenu-gtk3-4 \
  libgbm1 \
  libgtk-3-0 \
  libxshmfence1 \
  ca-certificates \
  fonts-liberation \
  libcurl4 \
  libexif12 \
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*
# Créer le dossier de travail
WORKDIR /usr/src/app

# Copier uniquement les fichiers package.json et package-lock.json pour installer les dépendances en premier
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install --loglevel verbose

RUN npx puppeteer browsers install chrome
# Copier le reste des fichiers du projet
COPY . .

# Vérifier les fichiers et les modules installés
RUN ls -la /usr/src/app && npm list

# Exposer le port
EXPOSE 8081

# Lancer l'application
#CMD ["npm", "start"]
# Copier le script de démarrage
COPY ./scripts/init.sh /init.sh
RUN chmod +x /init.sh

# Exécuter le script de démarrage au démarrage du conteneur
#CMD ["/init.sh"]
ENTRYPOINT ["/init.sh"]