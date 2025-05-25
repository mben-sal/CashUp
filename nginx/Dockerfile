FROM nginx:latest

RUN apt-get update && apt-get install -y openssl

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy certificate generation script
COPY generate-certs.sh /docker-entrypoint.d/40-generate-certs.sh
RUN chmod +x /docker-entrypoint.d/40-generate-certs.sh

# Create directory for certificates
RUN mkdir -p /etc/nginx/certs

CMD ["nginx", "-g", "daemon off;"]