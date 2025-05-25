"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path

# Définir la variable d'environnement pour les paramètres Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Importer l'application ASGI
django_asgi_app = get_asgi_application()

# Configuration des routes WebSocket (à personnaliser selon vos besoins)
# Vous pourriez avoir besoin d'importer vos consommateurs WebSocket ici
# from myapp.consumers import MyConsumer

# websocket_urlpatterns = [
#     path('ws/some_path/', MyConsumer.as_asgi()),
# ]

# Application ASGI avec routage pour HTTP et WebSocket
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    # "websocket": AuthMiddlewareStack(
    #     URLRouter(
    #         websocket_urlpatterns
    #     )
    # ),
})