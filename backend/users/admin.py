from django.contrib import admin
from .models import UserProfile, Pokemon, UploadedPokemon

admin.site.register(UserProfile)
admin.site.register(UploadedPokemon)
admin.site.register(Pokemon)