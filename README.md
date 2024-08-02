# Pokemon Finder

This project is a full-stack React App that utilizes Django Rest Framework API. Pokémon markers are displayed on a map of California that feature popups containing their stats. Additional Pokémon can be uploaded through use of .csv files.

## Installation:

1. Clone the repository

```bash
git clone https://github.com/ethanbresk/pokemon-finder.git
```

2. Install node packages

```bash
cd pokemon-finder/frontend
npm install
```

3. Build docker images

```bash
cd ..
docker compose build
```

4. Migrate the Postgres database

```bash
docker compose exec backend python manage.py migrate
```

## Running:

To run the containers, use `docker compose up` - to stop the containers use `docker compose down`