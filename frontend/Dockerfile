FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Vérifier que le build s'est bien passé
RUN ls -la build/ && echo "Build directory contents:" && ls -la build/

# Garder le conteneur en vie
CMD ["tail", "-f", "/dev/null"]