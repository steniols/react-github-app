# PERN GitHub App

A simple GitHub application study with Postgres, Express, React and Node.
Log in with GitHub, list your repositories and organize them with your own tags.

**Stack:** Node 20+, Express 4, Knex 3, PostgreSQL, React 18, Vite, Bootstrap 4.

## Live version

https://steniols-github-app.onrender.com/

Hosted on [Render](https://render.com) (free plan) with the database on [Neon](https://neon.com).
The free instance sleeps when idle, so the first access may take up to a minute.

## Requirements

* Node **20.19+** (tested with Node 22).
* A [GitHub OAuth App](https://github.com/settings/developers)
  (`Settings > Developer settings > OAuth Apps > New OAuth App`):
  * *Application name*: `PERN GitHub App`
  * *Homepage URL*: `http://localhost:3000`
  * *Authorization callback URL*: `http://localhost:8003/github/github-auth-callback`
  * Generate a *Client Secret* and save both *Client ID* and *Client Secret*.

PostgreSQL does **not** need to be installed: `npm run db` runs a local server
from npm (data is kept in `.pgdata/`). If you prefer Docker, use
`docker compose up -d` instead.

## Setup

```bash
cp .env.sample .env       # then fill CLIENT_ID and CLIENT_SECRET
npm run setup             # installs API and client dependencies
```

## Running

In one terminal, start the database (keep it running):

```bash
npm run db
```

In another terminal, create the tables (only needed once, or after new migrations) and start the app:

```bash
npm run migrate
npm run dev
```

`npm run dev` starts the API on <http://localhost:8003> and the client on
<http://localhost:3000> (with auto reload). The client proxies `/github` and
`/tags` to the API, so no extra configuration is needed.

> The client port comes from `APP_URL` in `.env`. If port 3000 is busy, change
> `APP_URL` **and** the OAuth App's *Homepage URL* to the same new port.

## Production build

```bash
npm run build                          # builds the client into client/dist
NODE_ENV=production npm start          # API also serves the built client
```

In production the API reads `DATABASE_URL` (or the `PG_*` variables).

## Environment variables

| Variable | Description |
| --- | --- |
| `APP_URL` | Client URL, where the user is sent back after login (development) |
| `CLIENT_ID` / `CLIENT_SECRET` | GitHub OAuth App credentials |
| `PG_USER`, `PG_PASSWORD`, `PG_HOST`, `PG_PORT` | PostgreSQL connection |
| `PG_DATABASE` / `PG_DATABASE_TEST` | Development and test databases |
| `client/.env` → `VITE_API_URL` | Optional, only when the API is on another origin |

## API

All routes except the login ones require an `Authorization: Bearer <token>`
header with the token received after the GitHub login.

| Method | Route | Description |
| --- | --- | --- |
| GET | `/github` | Redirects to the GitHub login |
| GET | `/github/github-auth-callback` | OAuth callback |
| GET | `/github/github-get-userdata` | Logged user data |
| POST | `/github/github-logout-user` | Logout |
| POST | `/github/github-repositories` | Syncs and lists the repositories (`{ search }`) |
| GET | `/github/github-repository/:name` | Repository detail |
| POST | `/github/rel-tags` | Sets the tags of a repository (`{ repoId, tags }`) |
| GET | `/tags` | Lists the tags |
| GET | `/tags/:id` | Tag detail |
| POST | `/tags/save` | Creates a tag |
| PUT | `/tags/save/:id` | Updates a tag |
| DELETE | `/tags/:id` | Deletes a tag |

## E2E Tests

End-to-end tests use [Playwright](https://playwright.dev). They start their own API
and client (ports 8013 and 3010) using the `github-app-test` database, so your
development servers and data are not affected.

Instead of automating the GitHub login page (which does not work with 2FA), the
tests use a GitHub token, taken from:

1. `E2E_GITHUB_TOKEN` in `.env`: a [personal access token](https://github.com/settings/tokens) with the `repo` scope; or
2. if it is empty, the token of your last login in the app (`npm run dev`).

With `npm run db` running:

```bash
npx playwright install chromium   # only once
npm run test:e2e                  # or npm run test:e2e:ui for the interactive mode
```

The HTML report is saved in `playwright-report/` (`npx playwright show-report`).
