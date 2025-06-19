FROM postgres:15

# Variables d'environnement pour l'initialisation
ENV POSTGRES_DB=transcendence_db
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copier les scripts d'initialisation
COPY ./database.sql /docker-entrypoint-initdb.d/

# Exposer le port PostgreSQL
EXPOSE 5432