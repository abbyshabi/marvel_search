# Marvel Search

A small two-part project: a React frontend (`marvel-app`) that searches Marvel characters and a Go backend (`marvel-backend`) that proxies requests to the official Marvel API (adds required auth hash and keys). This README explains how to run both parts locally, environment variables, and useful notes for development.

## Table of contents

- Project overview
- Repo structure
- Prerequisites
- Backend (marvel-backend)
  - Environment variables
  - Run locally
  - Tests
- Frontend (marvel-app)
  - Run locally
  - Common scripts
- Development notes
- Troubleshooting
- License & acknowledgements

## Project overview

This repository contains a lightweight React application that queries a local Go backend. The backend acts as a thin proxy to the Marvel Developer API and handles the MD5 hashing and required timestamp + API key parameters so that the client doesn't need to embed private keys.

Key features

- Search Marvel characters with pagination
- Autocomplete / suggestions endpoint
- Small, easy-to-run development setup

## Repo structure

- marvel-app/ — React frontend (Create React App)
  - src/ — source files (components, API client)
  - public/ — static assets
- marvel-backend/ — Go API server (Gin)
  - main.go — server routes and logic
  - notes.go, main_test.go — supporting files and tests

## Prerequisites

- Node.js (recommended: 18+) and npm or yarn for the frontend
- Go 1.20+ for the backend
- Marvel Developer account to obtain API public and private keys: https://developer.marvel.com/

## Backend (marvel-backend)

The backend is a single Go server that listens on port 8080 and exposes two endpoints used by the frontend:

- GET /characters — forwards queries to the Marvel API and returns the response
- GET /characters/suggestions — fetches characters and returns a reduced suggestions list

Environment variables

Create a `.env` file in `marvel-backend/` (or set environment variables in your shell) with the following keys:

```
publicKey=YOUR_MARVEL_PUBLIC_KEY
privateKey=YOUR_MARVEL_PRIVATE_KEY
```

Notes:
- The code expects environment variables named `publicKey` and `privateKey` (case-sensitive). The server will log a warning if `.env` is missing and will try to read the values from the environment.

Run locally

From the repository root you can run the backend like this:

```bash
cd marvel-backend
go run main.go
```

The server will bind to port 8080 by default. If needed, run with `GODEBUG` or inside a container and map ports.

Tests

There is a `main_test.go` file in the backend. Run tests with:

```bash
cd marvel-backend
go test ./...
```

## Frontend (marvel-app)

The frontend is a Create React App project. It expects the backend to be available at `http://localhost:8080` (see `src/api.js`).

Install dependencies and run:

```bash
cd marvel-app
npm install
npm start
```

Available scripts (from `package.json`):

- `npm start` — runs the dev server on default CRA port (3000)
- `npm test` — runs tests
- `npm run build` — creates a production build

If your backend runs on a different host/port, update the base URL in `marvel-app/src/api.js`.

## Development notes

- API client: `marvel-app/src/api.js` uses axios and points to `http://localhost:8080` by default.
- Backend hashing: `marvel-backend/main.go` computes an MD5 hash of `ts + privateKey + publicKey` to satisfy Marvel API auth.
- CORS: backend registers `cors.Default()` to allow local development from the CRA dev server.

Edge cases & suggestions

- The backend uses a 10s HTTP client timeout. If you expect longer responses, increase the timeout in `defaultHTTPClient()`.
- The server URL includes query-escaped `name` to handle spaces/special characters.

## Troubleshooting

- 401 Unauthorized from Marvel API: verify `publicKey` and `privateKey` values and that the keys are active on your Marvel developer account.
- Frontend 404/Network errors: confirm the backend is running on port 8080 and `src/api.js` baseURL matches.
- If `.env` variables aren't picked up, ensure `github.com/joho/godotenv` is available (the module is in `go.mod`) or set the variables in your shell before starting.

## License & acknowledgements

This project is a simple demo / learning project integrating the Marvel API. Replace keys and configuration for production use, and follow Marvel's API Terms of Use.

---

If you'd like, I can also add a small example `.env.example` file, update the frontend to read backend baseURL from an env variable (Create React App: `REACT_APP_API_URL`), or create a Docker Compose file for single-command setup. Tell me which you'd prefer next.
