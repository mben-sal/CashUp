FROM nginx:latest

RUN apt-get update && apt-get install -y openssl

# Copier la configuration au bon endroit
COPY nginx.conf /etc/nginx/nginx.conf

# Ne pas surcharger le point de montage pour les certificats
# RUN mkdir -p /etc/nginx/certs
# Les commandes pour générer les certificats peuvent être déplacées 
# dans un script d'initialisation

# Fichier d'initialisation pour générer les certificats si besoin
COPY generate-certs.sh /docker-entrypoint.d/40-generate-certs.sh
RUN chmod +x /docker-entrypoint.d/40-generate-certs.sh

CMD ["nginx", "-g", "daemon off;"]