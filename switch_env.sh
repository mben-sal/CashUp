#!/bin/bash
# switch_env.sh

if [ "$1" == "local" ]; then
  echo "Switching to localhost configuration..."
  
  # Mettre à jour config.js
  sed -i 's|export const API_BASE_URL.*|export const API_BASE_URL = "https://localhost/api";|' ./Frontend/src/config.js
  sed -i 's|export const WS_BASE_URL.*|export const WS_BASE_URL = "wss://localhost/ws";|' ./Frontend/src/config.js
  
  echo "Redémarrage des conteneurs..."
  docker-compose down
  docker-compose up -d
  
  echo "Configuration localhost activée"
  
elif [ "$1" == "mobile" ]; then
  echo "Switching to mobile configuration..."
  
  # Mettre à jour config.js
  sed -i 's|export const API_BASE_URL.*|export const API_BASE_URL = "https://10.32.121.74/api";|' ./Frontend/src/config.js
  sed -i 's|export const WS_BASE_URL.*|export const WS_BASE_URL = "wss://10.32.121.74/ws";|' ./Frontend/src/config.js
  
  echo "Redémarrage des conteneurs..."
  docker-compose down
  docker-compose up -d
  
  echo "Configuration mobile activée"
  
else
  echo "Usage: ./switch_env.sh [local|mobile]"
fi