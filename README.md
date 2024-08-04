# Pokemon Finder

This project is a full-stack React App that utilizes Django Rest Framework API. Pokémon markers are displayed on a map of California that feature popups containing their stats.

![172276284111726639](https://github.com/user-attachments/assets/71de3461-0846-4d7a-9d33-015b7a40ee73)

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

To run the containers, use `docker compose up` and to stop the containers, use `docker compose down`
