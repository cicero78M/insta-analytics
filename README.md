# Insta Analytics

A full-stack application for analyzing Instagram activity. It features a TypeScript/Node.js backend that ingests posts and comments through RapidAPI and stores metrics in PostgreSQL, alongside a Next.js frontend to visualize the collected data.

## Project Structure

```
backend/  # Express API, ingest jobs, PostgreSQL access
frontend/ # Next.js dashboard for metrics visualization
```

## Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Build the TypeScript sources:
   ```bash
   npm run build
   ```
3. Provide environment variables in `backend/.env`:
   - `RAPIDAPI_KEY` – RapidAPI key for Instagram provider
   - `RAPIDAPI_HOST` – (optional) override provider host
   - `PROVIDER_PROFILE` – (optional) provider profile name, defaults to `social-api4`
   - `BRAND_ALIASES` – comma-separated list of hashtags/usernames to track
   - standard `pg` settings for PostgreSQL (`PGHOST`, `PGDATABASE`, `PGUSER`, etc.)
4. Start the API server:
   ```bash
   npm run dev
   ```
5. Run the ingest job (optional):
   ```bash
   npm run ingest
   ```

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend expects the backend API to be running on `http://localhost:4001`.

## License

Distributed under the MIT License. See `LICENSE` for more information.
