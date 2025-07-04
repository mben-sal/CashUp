from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from authen.views import FortyTwoCallbackView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="transendence API Documentation",
        default_version='v1',
        description="Documentation de l'API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="votre_email@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authen.urls')),
    path('api/', include('game.urls')),
    path('api/', include('chat.urls')),
	path('api/', include('calculater.urls')),
    path('api/callback/', FortyTwoCallbackView.as_view(), name='ft_callback'),  # Ajoutez cette ligne
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)