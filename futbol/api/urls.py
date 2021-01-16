from django.urls import path
from . import views


urlpatterns = [
    path(route='documentation/', view=views.get_documentation, name='documentation'),
]