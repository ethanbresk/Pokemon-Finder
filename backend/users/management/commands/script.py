from django.core.management import BaseCommand
from ...models import UserProfile, Pokemon
from uuid import uuid4
import requests
import random
import json
import os

class Command(BaseCommand):

    help = "generate 100 random pokemon"

    def handle(self, *argv, **options):

        module_dir = os.path.dirname(__file__)  # get current directory
        file_path_a_j = os.path.join(module_dir, 'A-J')
        file_path_k_z = os.path.join(module_dir, 'K-Z')

        # extract coordinates for A-J
        coords_a_j = []
        with open(file_path_a_j, mode='r') as file:
            data = json.load(file)
            # extract polyline coordinates
            coords = data['coordinates']
            for i in range(len(coords)):
                for j in range(len(coords[i])):
                    coords_a_j.append(coords[i][j])
            
        # extract coordinates for K-Z
        coords_k_z = []
        with open(file_path_k_z, mode='r') as file:
            data = json.load(file)
            # extract polyline coordinates
            coords = data['coordinates']
            for i in range(len(coords)):
                for j in range(len(coords[i])):
                    coords_k_z.append(coords[i][j])
        
        # add to list
        list_of_pokemon = []

        # loop 100 times
        for i in range(100):
            # get random pokemon
            rand_id = random.randint(1, 151)
            res = requests.get('https://pokeapi.co/api/v2/pokemon/' + str(rand_id)).json()

            # extract pokemon attributes
            name = res.get('name')
            moves_list = res.get('moves')
            moves_dict = {}
            for i in range(len(moves_list)):
                move_name = moves_list[i].get('move').get('name')
                level_learned_at = moves_list[i].get('version_group_details')[0].get('level_learned_at')
                moves_dict[move_name] = level_learned_at
            
            # extract last 4 moves
            counter = 0
            four_moves = []
            for key, value in sorted(moves_dict.items(), key=lambda x: x[1], reverse=True):
                four_moves.append(str(key))
                counter += 1
                if counter > 3:
                    break
            for i in range(0, len(four_moves)):
                four_moves[i] = four_moves[i].replace('-', ' ')

            # generate token
            token = uuid4()

            # get location
            location_res = requests.get('https://pokeapi.co/api/v2/pokemon/' + str(rand_id) + '/encounters').json()
            if (len(location_res) > 0):
                location = location_res[0].get('location_area').get('name')
                location = location.replace('-', ' ')
            else:
                location = "No location listed"

            # generate points along the polyline(s)
            if name[0] > 'j':
                rand_coord = random.randint(0, len(coords_k_z))
                lng = coords_k_z[rand_coord][0]
                lat = coords_k_z[rand_coord][1]
            else:
                rand_coord = random.randint(0, len(coords_a_j))
                lng = coords_a_j[rand_coord][0]
                lat = coords_a_j[rand_coord][1]

            pokemon_values = { 'stats': res, 'name': name, 'moves': four_moves, 'location': location, 'identifier': str(token), 'latitude': lat, 'longitude': lng}
            list_of_pokemon.append(pokemon_values)
            print(name)
        
        # output json
        with open('generated-pokemon', 'w') as f:
            json.dump(list_of_pokemon, f)  