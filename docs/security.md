# Seguridad y operación

- JWT Bearer: acceso de 15 minutos, refresh de 7 días, rotación y blacklist.
- Autenticación obligatoria y filtrado de recursos por usuario propietario.
- Validación de contraseñas Django y mínimo de 12 caracteres.
- Límite de login/registro: 5/minuto; IA: 20/hora.
- ORM Django sin SQL crudo, CORS por allowlist y errores sin stack traces.
- Headers `nosniff`, `X-Frame-Options: DENY`, cookies `HttpOnly`, SSL/HSTS configurables.

Producción: usar `DEBUG=False`, HTTPS, `check --deploy`, secretos gestionados externamente, backups cifrados y logs centralizados. No registrar contraseñas, JWT ni credenciales OAuth.

GitHub y LinkedIn devuelven `503 integration_not_configured` hasta contar con credenciales y callback OAuth aprobados; no se simulan integraciones.
