# RTickles API

Welcome to the RTickles API! This backend service provides programmatic access to application data, akin to platforms like Reddit. Built with Node.js and PostgreSQL, it offers endpoints to interact with various resources such as topics, articles, comments, and users.

View the API here: https://chili-news.onrender.com/api/

## Installation

To get started locally, follow these steps:

1. Clone the repository:
git clone https://github.com/justanotherchili/RTickles-API.git

3. Navigate into the project directory:
cd forums-api

4. Install dependencies:
npm install

4. Create necessary environment files:
- Create a `.env.development` file in the parent directory for development environment variables and link it to the development database.
- Create a `.env.test` file in the parent directory for test environment variables and link it to the test database.
(See `.env-example` for reference)

5. Setup your local PSQL database and seed it with initial data:
npm run setup-dbs

## Running Tests

To run tests, use the following command:
npm test

Minimum Requirements
Ensure the following minimum versions are installed:

Node.js: v21.5 or higher
PostgreSQL: v14.1.0 or higher
