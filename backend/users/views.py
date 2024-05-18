from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.response import Response
from .models import UserProfile, Pokemon, UploadedPokemon
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib import auth
from uuid import uuid4
import json
import csv
import io
import os

import logging
logger = logging.getLogger(__name__)

@api_view(['GET'])
def send_some_data(request):
    return Response({
        "data": "Hello from django backend!"
    })

@api_view(['GET'])
def login(request, format=None):
    username = request.GET.get('username', '')
    password = request.GET.get('password', '')

    try:
        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            user_profile = UserProfile.objects.get(username=username)

            return Response({ 'success': 'user authenticated', 'username': user.username, 'token': user_profile.token })
        else:
            return Response({ 'error': 'error authenticating user' })
    except:
        return Response({ 'error': 'error logging in' })
    
@api_view(['GET'])
def logout(request, format=None):
    username = request.GET.get('username', '')

    try:
        user = User.objects.get(username=username)
        auth.logout(request)
        return Response({ 'success': 'logging out' })
    except:
        return Response({ 'error': 'error logging out' })

@api_view(['GET'])
def register(request, format=None):
    username = request.GET.get('username', '')
    password = request.GET.get('password', '')

    try:
        if User.objects.filter(username=username).exists():
            return Response({ 'error': 'username already exists' })
        else:
            user = User.objects.create_user(username=username, password=password)
            user.save()
            # user = User.objects.get(id=user.id)
            # generate auth token
            token = uuid4()
            user_profile = UserProfile.objects.create(user=user, username=username, token=token)
            user_profile.save()
            # get current directory
            module_dir = os.path.dirname(__file__)
            file_path = os.path.join(module_dir, '..', 'generated-pokemon')
            logger.warning(file_path)
            with open(file_path, mode='r') as f:
                data = json.load(f)
                for i in range(len(data)):
                    p = data[i]
                    Pokemon.objects.create(stats=p['stats'], name=p['name'], moves=p['moves'], location=p['location'], identifier=p['identifier'], user_profile=user_profile, latitude=p['latitude'], longitude=p['longitude'])
            return Response({ 'success': 'user registered successfully', 'token': user_profile.token })
    except:
            return Response({ 'error': 'error registering account' })
    
@api_view(['GET'])
def check_auth(request, format=None):
    username = request.GET.get('username', '')
    request_token = request.GET.get('token', '')
    
    try:
        user_profile = UserProfile.objects.get(username=username)

        if request_token == user_profile.token:
            return Response({ 'is_authenticated': 'true' })
        else:
            return Response({ 'is_authenticated': 'false' })
    except:
        return Response({ 'error': 'error checking auth status' })
    
@api_view(['GET'])
def get_pokemon(request, format=None):
    username = request.GET.get('username', '')
    try:
        user_profile = UserProfile.objects.get(username=username)
        data = list(Pokemon.objects.filter(user_profile=user_profile).values())
        return JsonResponse(data, safe=False)
    except:
        return Response({ 'error': 'error fetching pokemon' })

@api_view(['GET'])
def get_uploaded_pokemon(request, format=None):
    username = request.GET.get('username', '')
    try:
        user_profile = UserProfile.objects.get(username=username)
        data = list(UploadedPokemon.objects.filter(user_profile=user_profile).values())
        return JsonResponse(data, safe=False)
    except:
        return Response({ 'error': 'error fetching pokemon' })
    
@api_view(['POST'])
def upload_pokemon(request, format=None):
    username = request.GET.get('username', '')

    try:
        with io.TextIOWrapper(request.FILES["file"], encoding="utf-8", newline='\n') as text_file:
            data = [{key: val for key, val in row.items()}
                for row in csv.DictReader(text_file, skipinitialspace=True)]
            user_profile = UserProfile.objects.get(username=username)
            
            moves_list = data[0]["Latest Moves"].split(' ')
            for i in range(0, len(moves_list)):
                moves_list[i] = moves_list[i].replace(',', '')
                moves_list[i] = moves_list[i].replace('[', '')
                moves_list[i] = moves_list[i].replace(']', '')
                moves_list[i] = moves_list[i].replace('-', ' ')
            token = uuid4()
            p = UploadedPokemon.objects.create(
                name=data[0]["Pokemon"], 
                type=data[0]["Type"], 
                location=data[0]["Location"],
                moves=moves_list, 
                sprite_url=data[0]["Sprite"], 
                identifier=token, 
                user_profile=user_profile, 
                latitude=data[0]["Lat"], 
                longitude=data[0]["Long"],
            )
            
            return Response({ 'success': 'pokemon uploaded successfully' })
    except:
        return Response({ 'error': 'error uploading pokemon' })
    
@api_view(['GET'])
def delete_pokemon(request, format=None):
    username = request.GET.get('username', '')
    pokemon_identifier = request.GET.get('pokemon_identifier', '')

    try:
        user_profile = UserProfile.objects.get(username=username)
        pokemon = Pokemon.objects.get(user_profile=user_profile, identifier=pokemon_identifier)
        pokemon.delete()
        return Response({ 'success': 'pokemon deleted successfully' })
    except:
        return Response({ 'error': 'error deleting pokemon' })
    
@api_view(['GET'])
def delete_uploaded_pokemon(request, format=None):
    username = request.GET.get('username', '')
    pokemon_identifier = request.GET.get('pokemon_identifier', '')

    try:
        user_profile = UserProfile.objects.get(username=username)
        pokemon = UploadedPokemon.objects.get(user_profile=user_profile, identifier=pokemon_identifier)
        pokemon.delete()
        return Response({ 'success': 'pokemon deleted successfully' })
    except:
        return Response({ 'error': 'error deleting pokemon' })

@api_view(['GET'])
def favorite_pokemon(request, format=None):
    username = request.GET.get('username', '')
    pokemon_identifier = request.GET.get('pokemon_identifier', '')

    try:
        user_profile = UserProfile.objects.get(username=username)
        pokemon = Pokemon.objects.get(user_profile=user_profile, identifier=pokemon_identifier)
        current_rating = pokemon.favorited
        new_rating = not current_rating
        pokemon.favorited=new_rating
        pokemon.save()
        return Response({ 'success': 'pokemon rating updated successfully' })
    except:
        return Response({ 'error': 'error favoriting pokemon' })
    
@api_view(['GET'])
def favorite_uploaded_pokemon(request, format=None):
    username = request.GET.get('username', '')
    pokemon_identifier = request.GET.get('pokemon_identifier', '')

    try:
        user_profile = UserProfile.objects.get(username=username)
        pokemon = UploadedPokemon.objects.get(user_profile=user_profile, identifier=pokemon_identifier)
        current_rating = pokemon.favorited
        new_rating = not current_rating
        pokemon.favorited=new_rating
        pokemon.save()
        return Response({ 'success': 'pokemon rating updated successfully' })
    except:
        return Response({ 'error': 'error favoriting pokemon' })