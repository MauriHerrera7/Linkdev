# Arquitectura

El frontend Next.js consume la API REST Django en `/api`. Django REST Framework valida JWT, permisos y datos; PostgreSQL 17 persiste el estado. Docker Compose coordina la API y la base en desarrollo.

| App | Responsabilidad |
|---|---|
| `accounts` | Registro, login, refresh JWT y onboarding. |
| `content` | Posts, calendario y dashboard. |
| `ideas` | Ideas persistidas y generador local. |
| `insights` | Generación/mejora con Gemini y analytics. |
| `integrations` | Estado e inicio OAuth. |
| `common` | Errores API consistentes. |

```mermaid
flowchart LR
  FE[Next.js] -->|Bearer JWT| API[Django REST Framework]
  API --> Domain[Apps de dominio]
  Domain --> PG[(PostgreSQL)]
  API --> Schema[OpenAPI / Swagger]
```

La IA usa Gemini cuando `GEMINI_API_KEY` está configurada y cae a un fallback local si no hay clave. La sincronización externa, Redis y las tareas en cola no están implementadas; no deben asumirse como capacidades operativas.
