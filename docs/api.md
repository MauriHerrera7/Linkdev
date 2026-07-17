# API

## Authentication

POST /api/auth/login

POST /api/auth/register

POST /api/auth/refresh

---

## Users

GET /api/users/me

PATCH /api/users/me

---

## Posts

GET /api/posts

POST /api/posts

PATCH /api/posts/:id

DELETE /api/posts/:id

---

## AI

POST /api/ai/generate

POST /api/ai/improve

POST /api/ai/ideas

POST /api/ai/rewrite

---

## GitHub

POST /api/github/connect

GET /api/github/repositories

POST /api/github/analyze

---

## LinkedIn

POST /api/linkedin/connect

POST /api/linkedin/publish

POST /api/linkedin/schedule

---

## Analytics

GET /api/analytics

GET /api/analytics/posts