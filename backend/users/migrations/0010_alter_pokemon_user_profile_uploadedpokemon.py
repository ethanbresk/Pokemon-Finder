# Generated by Django 4.2.13 on 2024-05-17 04:32

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_remove_userprofile_pokemon_pokemon'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pokemon',
            name='user_profile',
            field=models.ForeignKey(default=users.models.UserProfile.get_default_pk, on_delete=django.db.models.deletion.CASCADE, related_name='pokemon', to='users.userprofile'),
        ),
        migrations.CreateModel(
            name='UploadedPokemon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('type', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=255)),
                ('moves', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), default=list, size=None)),
                ('sprite_url', models.CharField(max_length=255)),
                ('identifier', models.CharField(default='', max_length=255)),
                ('favorited', models.BooleanField(default=False)),
                ('latitude', models.DecimalField(decimal_places=14, max_digits=17)),
                ('longitude', models.DecimalField(decimal_places=14, max_digits=17)),
                ('user_profile', models.ForeignKey(default=users.models.UserProfile.get_default_pk, on_delete=django.db.models.deletion.CASCADE, related_name='uploaded_pokemon', to='users.userprofile')),
            ],
        ),
    ]
