# React PERN GitHub App

A simple GitHub application study with Postgres, Express, React and Node.

## Requirements

* Docker(v20.10.6) installed.
* PostgreSQL(v12.6) installed.
* Node(v15.3.0) and Npm(7.11.2) installed.
* Create a [GitHub OAuth App](https://github.com/settings/developers):
  1) *Homepage URL* must be `http://localhost:3000`
  2) *Authorization callback URL* must be `http://localhost:8003/github/github-auth-callback`
  3) Generate a *Client Secret* and save both *Client ID* and *Client Secret* for use later.

## Install API (backend)

First we need to create a `.env` file and update some things:

```bash
cp .env.sample .env
```

Update this variables below with your GitHub credentials:

```bash
CLIENT_ID=<GITHUB-CLIENT-ID>
CLIENT_SECRET=<GITHUB-SECRET-KEY>
```

Install Node dependencies

```bash
npm install
```

## Database Setup

Run the command below that will create the database inside a Docker image:

```bash
docker run -d -p 5432:5432 -e POSTGRES_USERNAME=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=github-app postgres:12.6
```

Run all migrations (create all tables):

```bash
npx knex migrate:latest 
```

## Start API

```bash
npm start
```

## Install Client (frontend)

Do the same with the client side, enter the client folder create a `.env` file and update if necessary.

```bash
cd client
cp .env.sample .env
```

Install Node dependencies

```
npm install
```

## Start Client
```bash
npm start
```

## E2E Tests

Create a `cypress.json` file and update it with GitHub App's Client ID and any GitHub login and password.

```bash
cp cypress.json.sample .cypress.json
```

This test uses the command below, which will:

* Delete the `github-app-test` database if exists and create a new one with the same name;
* Run the migrations to insert the tables in this new database;
* Change the `NODE_ENV` to 'test' to run the server using this test database;
* Run backend and frontend;
* Run Cypress.

```bash
npm run cypress-test
```

## Live version

https://steniols-pern-github-app.herokuapp.com/
