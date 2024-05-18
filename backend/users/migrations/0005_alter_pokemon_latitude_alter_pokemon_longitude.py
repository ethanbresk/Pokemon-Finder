# Generated by Django 4.2.13 on 2024-05-15 08:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_pokemon_latitude_pokemon_longitude'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pokemon',
            name='latitude',
            field=models.DecimalField(decimal_places=14, max_digits=17),
        ),
        migrations.AlterField(
            model_name='pokemon',
            name='longitude',
            field=models.DecimalField(decimal_places=14, max_digits=17),
        ),
    ]
