# TestAPI

A simple Node.js API for managing user messages, with PostgreSQL database integration.

## Project Structure

- `index.js` - Main entry point for the API server.
- `database.js` - Database connection and query logic (PostgreSQL).
- `messageService.js` - Message-related business logic.
- `backup.sh` - Script to backup the database.
- `deploy.sh` - Script to deploy the application.
- `docker-compose.yml` - Docker setup for local development.
- `backups/` - Contains database backup files.

## Run locally

**Configure PostgreSQL:**
 Update connection details in `.env` if needed.

**Run the API locally:**
   ```bash
   node index.js
   ```
   eventually you can use `nodemon` for auto-reloading during development:
   ```bash
   npx nodemon index.js
   ```

**Run the database with Docker:**
```bash
docker-compose up -d
```
## Deploy on server

**Prerequisites:**
- Ensure you have SSH access to the server. (Remember firewall rules)
- Node.js (v22 or later)
- Docker
- PM2

**Configure PostgreSQL:**
Update connection details in `.env` if needed.

### Deploy
   ```bash
   ./deploy.sh
   ```
To run the app and database using Docker (On mac remember to start up Rancher Desktop (GUI) first):

## Backup the database
   ```bash
   ./backup.sh
   ```





