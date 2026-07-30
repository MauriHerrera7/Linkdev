# linkdev

> Construí tu marca personal con IA.

`linkdev` ayuda a desarrolladores y perfiles tech a generar publicaciones con Gemini, sacar ideas y configurar su perfil de trabajo.

## Qué incluye hoy

- **Generar**: crea publicaciones desde una idea, un repo de GitHub, una URL o texto libre.
- **Ideas**: explora y guarda ideas por categoría.
- **Configuración**: ajusta profesión, tecnologías, objetivo, tono, idioma y conexión con GitHub.

## Requisitos

- Python 3.11+
- Node.js 20+
- PostgreSQL

## Variables de entorno

### Backend

- `SECRET_KEY`
- `DATABASE_URL`
- `FRONTEND_URL`
- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

### Frontend

- `NEXT_PUBLIC_API_URL`

## Desarrollo local

1. Copiá `.env.example` a `.env`.
2. Levantá PostgreSQL.
3. Ejecutá el backend con Django.
4. Ejecutá el frontend con `npm run dev`.

## API principal

- `POST /api/ai/generate`
- `POST /api/ai/improve`
- `POST /api/ai/ideas`
- `GET /api/ai/ideas/daily`
- `GET|POST /api/posts`
- `GET|PATCH|DELETE /api/posts/{id}`
- `GET /api/integrations`
- `GET /api/github/repositories`

## Gemini

Si `GEMINI_API_KEY` está configurada, la app usa Gemini para generar y mejorar publicaciones. Si no, usa un fallback local para no cortar el flujo.

## GitHub

GitHub se usa como fuente de contexto para repositorios y commits.

## Deploy

En Render, definí las variables de entorno del backend, especialmente `DATABASE_URL`, `SECRET_KEY`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `GEMINI_API_KEY` y las credenciales de GitHub.
