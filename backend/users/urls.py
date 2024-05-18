from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.send_some_data),
    path('login/', views.login),
    path('logout/', views.logout),
    path('register/', views.register),
    path('check-auth/', views.check_auth),
    path('get-pokemon/', views.get_pokemon),
    path('get-uploaded-pokemon/', views.get_uploaded_pokemon),
    path('upload-pokemon/', views.upload_pokemon),
    path('delete-pokemon/', views.delete_pokemon),
    path('delete-uploaded-pokemon/', views.delete_uploaded_pokemon),
    path('favorite-pokemon/', views.favorite_pokemon),
    path('favorite-uploaded-pokemon/', views.favorite_uploaded_pokemon),
]