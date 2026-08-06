# Employee Management System

A learning-focused full-stack application built with React, TypeScript, Django,
PostgreSQL, and Django REST Framework.

## Project structure

```text
newpro/
├── backend/             Django REST API and database logic
│   ├── config/          Project-wide Django settings and URLs
│   ├── core/            Shared API functionality
│   ├── manage.py        Django command-line entry point
│   └── requirements.txt Python dependencies
└── frontend/            React and TypeScript user interface
    ├── src/             React source code
    └── vite.config.ts   Development server configuration
```

## First-time database setup

The project runs PostgreSQL in Docker so local development uses the same
database engine as production.

```bash
cd /Users/arnoldshaju/Desktop/newpro
cp .env.example .env
# Edit .env and set a private development password.
docker compose up -d database
```

Wait until `docker compose ps` reports that the database is healthy, then run
the Django migrations:

```bash
cd backend
source .venv/bin/activate
python manage.py migrate
```

## Run the project

Open two terminal windows.

### Terminal 1: Django backend

```bash
cd /Users/arnoldshaju/Desktop/newpro/backend
source .venv/bin/activate
python manage.py migrate
python manage.py runserver
```

The API is available at <http://127.0.0.1:8000/api/health/>.

### Terminal 2: React frontend

```bash
cd /Users/arnoldshaju/Desktop/newpro/frontend
npm run dev
```

Open <http://localhost:5173> in a browser.

Stop PostgreSQL without deleting its stored data:

```bash
docker compose stop database
```

The `.env` file and PostgreSQL data are deliberately excluded from Git. Commit
`.env.example`, but never commit the real `.env` file.

## Useful checks

```bash
# Backend tests
cd backend
.venv/bin/python manage.py test

# Frontend lint and production build
cd frontend
npm run lint
npm run build
```

## Planned modules

1. ✅ Custom users and roles: Admin, HR, Manager, Employee
2. Authentication and protected React pages
3. Departments and employee profiles
4. Leave requests and approvals
5. Attendance
6. Notifications and document uploads
7. Reporting and deployment

## Current user roles

- **Admin:** system-wide administration
- **HR:** employee and people-operation management
- **Manager:** team-level management and approvals
- **Employee:** personal profile and employee self-service

New users receive the Employee role unless an authorized administrator assigns
another role.
