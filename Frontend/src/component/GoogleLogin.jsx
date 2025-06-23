// GoogleLogin.jsx - Nouveau composant pour l'authentification Google
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import api from '../api/axios';

const GoogleLogin = ({ onError, setIsLoading }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useUser();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Charger le script Google
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        setIsGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => setIsGoogleLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Google script');
        onError('Failed to load Google authentication');
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, [onError]);

  // Initialiser Google Sign-In
  useEffect(() => {
    if (isGoogleLoaded && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: '476252811405-0vsnu3r5g4ogdj8iddduft34tardllic.apps.googleusercontent.com',
          callback: handleGoogleResponse,
          auto_select: false,
        });

        // Nettoyer le conteneur avant de rendre le bouton
        const container = document.getElementById('google-signin-button');
        if (container) {
          container.innerHTML = '';
          
          // Render le bouton
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          });
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        onError('Failed to initialize Google authentication');
      }
    }
  }, [isGoogleLoaded, onError]);

  const handleGoogleResponse = async (response) => {
    if (setIsLoading) setIsLoading(true);
    
    try {
      const result = await api.post('/auth/google/login/', {
        token: response.credential
      });

      if (result.data.requires_2fa) {
        // Rediriger vers la page 2FA
        navigate('/auth/two-factor', {
          state: {
            email: result.data.email,
            tempToken: result.data.temp_token
          }
        });
      } else {
        // Connexion réussie
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('refresh_token', result.data.refresh_token);
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to login with Google';
      onError(errorMessage);
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  return (
    <div className="google-login-container">
      <div id="google-signin-button" style={{ width: '100%' }}>
        {!isGoogleLoaded && (
          <div className="loading-placeholder">
            Loading Google Sign-In...
          </div>
        )}
      </div>
    </div>
  );
};
GoogleLogin.propTypes = {
  onError: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func,
};

export default GoogleLogin;