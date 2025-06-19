#!/bin/bash
set -e

# Vérifier si les certificats existent déjà
if [ ! -f /etc/nginx/certs/cert.pem ] || [ ! -f /etc/nginx/certs/privkey.pem ]; then
    echo "Generating SSL certificates..."
    mkdir -p /etc/nginx/certs
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/privkey.pem \
    -out /etc/nginx/certs/cert.pem \
    -subj "/C=MA/ST=Beni Mellal/L=Khouribga/O=Organization/OU=Department/CN=localhost" \
    -addext "subjectAltName = DNS:localhost,IP:10.32.121.74"
    echo "SSL certificates generated successfully."
else
    echo "SSL certificates already exist, skipping generation."
fi