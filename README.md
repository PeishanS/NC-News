# NC News

> This project seeds databases and builds an API to programmatically access application data.

## Hosted Version

The live version of the API is available at:  
[https://nc-news-wfs6.onrender.com/api](https://nc-news-wfs6.onrender.com/api)

## Project Summary

This project is a backend API service developed with Node.js and Express, using PostgreSQL as the database. The database is hosted on Supabase, and the API server is deployed on Render. The application provides endpoints for managing and retrieving data efficiently.

## Getting Started

### Clone the repository

```bash
git clone https://github.com/PeishanS/NC-News.git
cd NC-News
```

### Install dependencies

```bash
npm install
```

### Environment Variables Setup

You need to create two environment variable files for your databases:

- `.env.development` (for the development database):

```env
PGDATABASE=nc_news
```

- `.env.test` (for the test database):

```env
PGDATABASE=nc_news_test
```

Make sure your `.gitignore` includes the line `.env.*` to prevent these files from being pushed to GitHub.

For production deployment, create a `.env.production` file with the following content:

```env
DATABASE_URL=postgresql://postgres.byexljidoexahnfffwxa:p1iLD3Mp8e4kRtEM@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
```

### Database Seeding

To set up the databases locally, run:

```bash
npm run setup-dbs
```

To seed the local development database, run:

```bash
npm run seed-dev
```

To seed the production database hosted on Supabase, run:

```bash
npm run seed-prod
```

### Running the Application

Start the server in development mode:

```bash
npm start
```

For production mode (typically managed by Render):

```bash
NODE_ENV=production npm start
```

### Running Tests

To run tests against the test database, run:

```bash
npm test
```

To run only seed-related tests, run:
```bash
npm test-seed
```

## Requirements

- Node.js version >= 23.8.0  
- PostgreSQL version >= 17.5 (anything >= 12.x should be supported)

## Checking Your Local Node.js / PostgreSQL Version

To check your Node.js / PostgreSQL version, run these commands in your terminal:

```bash
node --version
```

```bash
psql --version
```

## Additional Notes

- This project uses `pg` for PostgreSQL integration and `dotenv` to manage environment variables.  
- The PostgreSQL databases are hosted locally for development and tests, and Supabase for production.  
- The API server is deployed on Render.  
- For detailed info, check the code comments and configuration files.

## Credits

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

---
