# React PERN Github App

A simple Github application study with Postgres, Express, React and Node.

## Requirements

* PostgreSQL(v12.6) installed.
* Node(v15.3.0) and Npm(7.11.2) installed.
* Create a [Github OAuth App](https://github.com/settings/developers):
  1) *Homepage URL* must be `http:localhost:3000`
  2) *Authorization callback URL* must be `http://localhost:8003/github/github-auth-callback`
  3) Generate a Client Secret and save both *Client ID* and *Client Secret* for use later.

## Install API (backend)

First we need to create a `.env` file and update its variables with your local Postgres configs and Github APP *Client ID* and *Client Secret*:

```bash
cp .env.sample .env
```

Install Node dependencies
```bash
npm install
```
## Database Setup

Update the `knexfile.js` in the project's root folder with your Postgres local configs.

Create a database:
```bash
createdb github-app 
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

Do the same with the client side, inside the client folder create a `.env` file and update if necessary.
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

## Live version

https://steniols-pern-github-app.herokuapp.com/
