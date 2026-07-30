# API

Base URL: `/api`. Los endpoints privados requieren `Authorization: Bearer <access_token>`.

## Auth

- `POST /auth/register` — `{ name, email, password }` → `{ access, refresh, user }`.
- `POST /auth/login` — `{ email, password }` → `{ access, refresh, user }`.
- `POST /auth/refresh` — `{ refresh }` → `{ access, refresh? }`.
- `GET /auth/github` — inicio OAuth; se habilita al configurar credenciales.

## Perfil y contenido

- `GET|PATCH /users/me` — perfil y datos de onboarding.
- `GET|POST /posts` — acepta filtros `status` y `limit`.
- `GET|PATCH|DELETE /posts/{id}` — solo el propietario.

## IA local

- `POST /ai/generate` — `mode`, `source_content?`, `url?`, `tone`, `length`, `emoji_count`, `post_type`, `call_to_action?`.
- `POST /ai/improve` — `{ content, instruction }`.
- `POST /ai/ideas` — `{ category? }`.
- `GET /ai/ideas/daily` — tres ideas del usuario.

## Insights e integraciones

- `GET /integrations`, `GET /github/repositories`.
- OpenAPI: `GET /schema/`; Swagger UI: `GET /docs/`.

Los errores siguen el formato `{ "detail": "...", "code"?: "...", "errors"?: {} }`.
