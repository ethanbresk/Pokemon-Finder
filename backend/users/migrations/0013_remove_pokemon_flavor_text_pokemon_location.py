# Generated by Django 4.2.13 on 2024-05-17 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_pokemon_moves'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pokemon',
            name='flavor_text',
        ),
        migrations.AddField(
            model_name='pokemon',
            name='location',
            field=models.CharField(default='', max_length=255),
        ),
    ]
