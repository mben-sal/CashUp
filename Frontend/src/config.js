const getEnvVariable = (key) => {
  // For Vite
  if (import.meta?.env) {
    return import.meta.env[`VITE_${key}`];
  }
  // For Create React App
  if (window.ENV) {
    return window.ENV[key];
  }
  // Fallback
  return "";
};

export const AUTH_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_42_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_42_REDIRECT_URI,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  GOOGLE_CLIENT_ID: '476252811405-0vsnu3r5g4ogdj8iddduft34tardllic.apps.googleusercontent.com',
};

export const API_BASE_URL = "https://localhost/api";
export const WS_BASE_URL = "wss://localhost/ws";