# Linkdev Backend

## Desarrollo local

1. Copiá `../.env.example` como `../.env` y definí `SECRET_KEY`.
2. Levantá PostgreSQL y la API con `docker compose up --build` desde la raíz del repositorio.
3. El servicio aplica las migraciones automáticamente al iniciar.

Para ejecutar Django fuera de Docker, levantá primero PostgreSQL con `docker compose up -d db`, instalá `pip install -r requirements.txt`, verificá que `DATABASE_URL` apunte a `localhost:5432` y ejecutá `python manage.py migrate` seguido de `python manage.py runserver`.

La API está disponible en `http://localhost:8000/api` y su documentación en `/api/docs/`.

## OAuth de GitHub

Para que funcione la conexión con GitHub y la lectura de repositorios, definí estas variables en `.env`:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `FRONTEND_URL`

Registrá también este callback URL en la app de OAuth:

- `http://localhost:8000/api/auth/github/callback`

GitHub usa el token guardado para listar repositorios y commits.

## IA con Gemini

Para generar y mejorar publicaciones con IA, definí estas variables en `.env`:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` opcional, por defecto `gemini-3.5-flash`

Si la clave está presente, `POST /api/ai/generate` y `POST /api/ai/improve` usan Gemini. Si no, el backend cae a un generador local de respaldo para no romper el flujo.

## Deploy en Render

Si desplegás el backend en Render, definí al menos estas variables:

- `DATABASE_URL`
- `SECRET_KEY`
- `ALLOWED_HOSTS` con tu dominio de Render
- `FRONTEND_URL` con la URL pública del frontend
- `CORS_ALLOWED_ORIGINS` con la URL pública del frontend
- `CSRF_TRUSTED_ORIGINS` con la URL pública del frontend
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

El contenedor ya arranca con `gunicorn`, así que Render no debería apagarlo por falta de comando de inicio.
