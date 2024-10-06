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
  --no-install-recommends

# Réduire npm à une version plus stable
RUN npm install -g npm@8

# Créer le dossier de travail
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Installer Puppeteer
RUN npm install puppeteer --loglevel verbose

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port
EXPOSE 8081

# Lancer l'application
CMD ["npm", "start"]
