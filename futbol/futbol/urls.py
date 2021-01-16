from django.contrib import admin
from django.urls import path, include

from futbol import config


urlpatterns = [
    path(route='admin/', view=admin.site.urls),
    path(route=f"{config.API_VERSION}/", view=include(arg='api.urls')),
    path(route=f"{config.API_VERSION}/leagues/", view=include(arg='leagues.urls')),
]