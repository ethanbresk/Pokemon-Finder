#test
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from uuid import uuid4

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    token = models.CharField(max_length=255)
    #pokemon = ArrayField(models.JSONField(null=True), default=list)

    @classmethod
    def get_default_pk(cls):
        generated_usernamed = str(uuid4())
        user_object = User.objects.create_user(username=generated_usernamed, password=str(uuid4()))
        user_profile, created = cls.objects.get_or_create(
            user=user_object,
            username=generated_usernamed,
            token=uuid4()
        )
        return user_profile.pk

    def __str__(self):
        return self.username
    
class Pokemon(models.Model):
    user_profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="pokemon", default=UserProfile.get_default_pk
    )
    stats = models.JSONField(null=True)
    name = models.CharField(max_length=255)
    identifier = models.CharField(max_length=255, default='')
    favorited = models.BooleanField(default=False)
    moves = ArrayField(models.CharField(max_length=255), default=list)
    location = models.CharField(max_length=255, default='')
    latitude = models.DecimalField(max_digits=17, decimal_places=14)
    longitude = models.DecimalField(max_digits=17, decimal_places=14)

    def __str__(self):
        return self.name
    
class UploadedPokemon(models.Model):
    user_profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="uploaded_pokemon", default=UserProfile.get_default_pk
    )
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    moves = ArrayField(models.CharField(max_length=255), default=list)
    sprite_url = models.CharField(max_length=255)
    identifier = models.CharField(max_length=255, default='')
    favorited = models.BooleanField(default=False)
    latitude = models.DecimalField(max_digits=17, decimal_places=14)
    longitude = models.DecimalField(max_digits=17, decimal_places=14)

    def __str__(self):
        return self.name