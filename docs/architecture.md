# Architecture

## Frontend

- Next.js
- React
- TailwindCSS
- Shadcn UI

Responsible for:

- Authentication
- Dashboard
- Editor
- Calendar
- Analytics

---

## Backend

Django REST Framework

Responsibilities

- Authentication
- AI Requests
- LinkedIn API
- GitHub API
- Scheduling
- Analytics

---

## Database

PostgreSQL

Stores

- Users
- Posts
- Drafts
- Integrations
- Analytics
- AI Memory

---

## Cache

Redis

Used for

- Celery
- Sessions
- Cache

---

## AI Layer

OpenAI

LangChain

LangGraph

Responsible for

- Post generation

- Style adaptation

- Prompt engineering

- Memory

- Analytics explanation

---

## Background Jobs

Celery

- Publish scheduled posts

- Analytics synchronization

- GitHub synchronization

- Notifications