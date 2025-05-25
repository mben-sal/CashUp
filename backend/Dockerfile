FROM python:3.12

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    libpq-dev \
    libjpeg-dev \
    libpng-dev \
    gcc \
    postgresql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier le script d'attente pour la base de données et le rendre exécutable
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copier les fichiers requirements depuis le dossier backend
COPY backend/requirements.txt /app/

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Créer le répertoire pour le code backend
WORKDIR /app/backend

# Copier le code source de l'application backend
COPY backend/ .

# Créer les répertoires nécessaires
RUN mkdir -p /app/backend/staticfiles /app/backend/media

# Exposer le port pour l'application
EXPOSE 8000

# Commande pour démarrer l'application avec le script d'attente
CMD ["/wait-for-it.sh", "db:5432", "--", "daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]