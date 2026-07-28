# API

Base URL: `/api`. Los endpoints privados requieren `Authorization: Bearer <access_token>`.

## Auth

- `POST /auth/register` — `{ name, email, password }` → `{ access, refresh, user }`.
- `POST /auth/login` — `{ email, password }` → `{ access, refresh, user }`.
- `POST /auth/refresh` — `{ refresh }` → `{ access, refresh? }`.
- `GET /auth/github`, `GET /auth/linkedin` — inicio OAuth; se habilitan al configurar credenciales.

## Perfil y contenido

- `GET|PATCH /users/me` — perfil y datos de onboarding.
- `GET|POST /posts` — acepta filtros `status` y `limit`.
- `GET|PATCH|DELETE /posts/{id}` — solo el propietario.
- `GET /dashboard/stats` — resumen del usuario autenticado.
- `GET /calendar?month=YYYY-MM` — publicaciones programadas/publicadas del mes.

## IA local

- `POST /ai/generate` — `mode`, `source_content?`, `url?`, `tone`, `length`, `emoji_count`, `post_type`, `call_to_action?`.
- `POST /ai/improve` — `{ content, instruction }`.
- `POST /ai/ideas` — `{ category? }`.
- `GET /ai/ideas/daily` — tres ideas del usuario.
- `POST /ai/analytics-insight` — `{ post_ids }`.

## Insights e integraciones

- `GET /analytics?period=7d|30d|90d`, `GET /analytics/posts`.
- `GET /integrations`, `GET /github/repositories`.
- OpenAPI: `GET /schema/`; Swagger UI: `GET /docs/`.

Los errores siguen el formato `{ "detail": "...", "code"?: "...", "errors"?: {} }`.
