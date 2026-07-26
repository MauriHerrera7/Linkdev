# Linkdev Backend

## Desarrollo local

1. Copiar `../.env.example` como `../.env` y definir `SECRET_KEY`.
2. Levantar PostgreSQL y la API: `docker compose up --build` desde la raíz del repositorio.
3. El servicio aplica las migraciones automáticamente al iniciar.

Para ejecutar Django fuera de Docker, levantá primero PostgreSQL con `docker compose up -d db`, instalá `pip install -r requirements.txt`, verificá que `DATABASE_URL` apunte a `localhost:5432` y ejecutá `python manage.py migrate` seguido de `python manage.py runserver`.

La API está disponible en `http://localhost:8000/api` y su documentación en `/api/docs/`.
