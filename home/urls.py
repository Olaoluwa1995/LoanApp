from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from core.api.views import (
    UserRegistrationView, 
    AdminRegistrationView, 
    UserLoginView,
    AdminLoginView
)

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    # path('rest-auth/', include('rest_auth.urls')),
    path('registration/', UserRegistrationView.as_view(), name='registration'),
    path('admin-registration/', AdminRegistrationView.as_view(), name='admin-registration'),
    path('user-login/', UserLoginView.as_view(), name='user-login'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/', admin.site.urls),
    path('api/', include('core.api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)


if not settings.DEBUG:
    urlpatterns += [re_path(r'^.*',
                            TemplateView.as_view(template_name='index.html'))]
