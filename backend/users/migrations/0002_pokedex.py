# Generated by Django 4.2.13 on 2024-05-12 10:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pokedex',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stats', models.JSONField(null=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
    ]
