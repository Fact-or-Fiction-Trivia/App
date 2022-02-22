# Fact or Fiction

## Getting Started

This is a React / Express monorepo built with Yarn 2 and currently served on Heroku.

To get started, pull a fresh version of the `main` branch. If you don't already have [Yarn 2 installed](https://yarnpkg.com/getting-started/install) in your local environment, you will need to upgrade your version of yarn and then [set the version](https://yarnpkg.com/getting-started/migration) for this project:

`npm install -g yarn`
`yarn set version berry`

Yarn 2 allows us to access the `workspaces` functionality, which lets us run the `server` and `client` separately in development mode while supporting a single-port version in production.

You will need to run `yarn` in the main project folder, and inside both the `server` and `client` folders, since each piece of the codebase has its own dependencies.

### Running the Server

Locally, the server serves a minified version of our React frontend on `localhost:8080`.

To run the server on its own, you can run `yarn run start` from the main directory.

To populate your local database with seed data, run `yarn run seed` from the main directory, or from the server directory.

### Running the Client

In order to access the full functionality of the client in development, you will need to run the client and the server concurrently to be able to pull in data from a local database.

To do so, run `yarn run start:concurrently` in the main directory.

**Note: ** This will run the server on `localhost:8080`, and will run a development build of the React app on `localhost:3000`

### Installing Dependencies

When installing dependencies, please install them in the respective server or client folder where they are used so that we can keep the `package.json` for each part of the application as clean as possible.

### Deployment

Our current test server is deployed on Heroku at https://fact-or-fiction-dev-server.herokuapp.com. It is deployed automatically from the `main` branch.
