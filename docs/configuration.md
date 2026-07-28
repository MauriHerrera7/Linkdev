# Configuración y PostgreSQL

1. Copiar `.env.example` a `.env`.
2. Definir `SECRET_KEY` aleatoria y segura.
3. Ejecutar `docker compose up --build`.

El compose levanta PostgreSQL 17 con el volumen `postgres_data` y el backend. Espera el healthcheck de PostgreSQL y aplica migraciones antes de iniciar.

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | `postgresql://usuario:clave@host:5432/base`. |
| `DATABASE_CONN_MAX_AGE` | Reutilización de conexión; por defecto 60 segundos. |
| `DEBUG` | Sólo `True` en desarrollo. |
| `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` | Listas separadas por coma. |
| `SECRET_KEY` | Nunca versionar ni reutilizar. |
| `GITHUB_*`, `LINKEDIN_*` | Credenciales OAuth cuando se habiliten. |

Sin Docker: levantar PostgreSQL, instalar `pip install -r backend/requirements.txt`, ejecutar `python manage.py migrate` desde `backend/` y luego `python manage.py runserver`.
