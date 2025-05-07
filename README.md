# PropertyBidHub

![PropertyBidHub Key Logo](./attached_assets/Screenshot_20250510-073426.png)

> **Real‑estate bidding made hackable.**  
> Built with **TypeScript + Express + React (Vite)** & **PostgreSQL (Drizzle ORM)**.

---

## 🚀 **Beginner Quick Start** (One Copy-Paste)

> Get up and running in minutes on macOS, Windows, Linux & Replit.

```bash
# 1. Install Prerequisites: Node.js (18 LTS+) & Git
#    Skip if you already have them installed.
#    ▸ macOS: brew install node git
#    ▸ Windows: Download from https://nodejs.org & https://git-scm.com

# 2. Clone the Repository & Navigate Into It
git clone https://github.com/yourname/PropertyBidHub.git
cd PropertyBidHub

# 3. Install Dependencies & Start the Development Server ⚡️
npm install && npm run dev

# Done! Open http://localhost:5001 ✨
# (If the browser didn't open automatically.)


That’s it! The npm run dev command starts both the backend API and the frontend dev server together.

💡 No Database Setup Needed (Initially): The quick start uses a file-based SQLite database (dev.db) as a fallback if no DATABASE_URL is set in your environment. This lets you explore and modify the code immediately. When you're ready for persistent data or production, switch to PostgreSQL using the advanced setup below. You might also see a warning about SESSION_SECRET not being set – this is okay for initial local testing.

🧰 What’s Inside
Layer	Tech	Notes
Frontend	React + Vite + shadcn/ui	TypeScript, Tailwind CSS, Hot Module Replacement (HMR)
API / SSR	Express.js (run via tsx) & Vite Middleware	Unified dev server (npm run dev), JSON API endpoints
Database	Drizzle ORM (PostgreSQL / SQLite Fallback)	Type-safe queries, zero-pain migrations (db:push)
Auth	Passport.js (Local Strategy) + bcrypt	Simple helpers in /server/auth.ts, session management
Sessions	express-session + connect-pg-simple	In-memory for dev (no DB), Postgres-backed for persistent
Validation	Zod	Shared schemas (/shared/schema.ts) for client & server
🐣 Beginner Cheatsheet
Task	Command	Notes
Install Dependencies	npm install	Run this first after cloning.
Start Dev Server	npm run dev	Runs backend & frontend on localhost:5001.
Check TypeScript Types	npm run check	Verifies type safety across the project.
Build for Production	npm run build	Creates optimized files in dist/.
Start Production Build	npm run start	Runs the app from the dist/ folder.
Apply Database Migrations	npm run db:push	Updates DB schema (requires Postgres).
Seed Database (Optional)	npm run db:seed	Adds sample data (requires Postgres).

ℹ️ All commands are run from the project root (PropertyBidHub/).

🔬 Advanced / Production Setup

Ready to use a real database and configure the environment?

1. Environment Variables

Note: A .env file is not required for the basic Quick Start.

If you want to use PostgreSQL or configure secrets, copy the example environment file:

cp .env.example .env
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Then, edit the .env file. Minimum keys for PostgreSQL setup:

# Database Connection (Required for Postgres)
# Example: postgres://<user>:<password>@<host>:<port>/<database>
DATABASE_URL=postgres://user:pass@localhost:5432/propertybidhub

# Session Secret (Required for security - generate a strong random string)
# Example: openssl rand -hex 32
SESSION_SECRET=replace_this_with_a_very_strong_random_secret

# Server Port (Default is 5001)
PORT=5001

# Node Environment (Set to 'production' for optimized builds/runtime)
NODE_ENV=development
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Dotenv
IGNORE_WHEN_COPYING_END
2. PostgreSQL Setup

Install PostgreSQL: If you haven't already.

Create Database & User:

-- Example commands (adjust as needed)
CREATE DATABASE propertybidhub;
CREATE USER propertybiduser WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE propertybidhub TO propertybiduser;
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
SQL
IGNORE_WHEN_COPYING_END

Set DATABASE_URL: Update your .env file with the correct connection string.

Apply Schema: Create or update the database tables based on the Drizzle schema.

npm run db:push
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Seed Data (Optional): Populate the database with sample listings.

npm run db:seed
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END
3. Useful npm Scripts
Script	Purpose
npm run dev	Start dev server (API + Vite HMR)
npm run check	Type-checks the entire project with tsc
npm run build	Build optimized frontend and backend for prod
npm run start	Launches the compiled build (dist/)
npm run test	Runs unit/integration tests with Vitest (if configured)
npm run db:push	Create/update database tables via Drizzle Kit
npm run db:seed	Populate database with sample data
4. Replit Specifics

.replit sets run = "npm run dev" so the Run button works out-of-the-box.

replit.nix installs Node.js 20, PostgreSQL 16, and potentially pnpm. While pnpm might be used internally by Replit, npm install should still work for manual setup.

Use Replit Secrets (Tools > Secrets) to securely add DATABASE_URL, SESSION_SECRET, etc., instead of using a .env file.

5. Docker

A basic Dockerfile is provided for containerization:

# Use Node.js 20 Alpine as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm-lock.yaml)
COPY package*.json ./
# If using pnpm, uncomment the following line and comment out npm ci
# COPY pnpm-lock.yaml ./

# Install dependencies (use --omit=dev for production)
RUN npm ci --omit=dev
# If using pnpm:
# RUN npm install -g pnpm && pnpm install --prod

# Copy the rest of the application code
COPY . .

# Build the application (frontend + backend)
RUN npm run build

# Expose the port the application will run on (ensure this matches .env or default)
EXPOSE 5001

# Command to run the application
CMD ["npm", "run", "start"]
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Dockerfile
IGNORE_WHEN_COPYING_END

Build & Run:

# Build the Docker image
docker build -t propertybidhub .

# Run the container, mapping port 5001 and using the .env file
# Ensure a PostgreSQL database is accessible from the container
docker run -p 5001:5001 --env-file .env propertybidhub
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Note: The Docker container needs access to a PostgreSQL database. You'll need to either:
a) Configure DATABASE_URL in your .env file to point to a host accessible from the container (e.g., host.docker.internal on Docker Desktop, or a cloud DB).
b) Use Docker Compose to run both the app and a Postgres container together.

📂 Project Structure
/
├─ attached_assets/     Static image assets used in the app/readme
├─ client/              React Frontend (Vite)
│  ├─ public/           Static assets served by Vite
│  ├─ src/
│  │  ├─ components/    UI components (reusable & shadcn/ui)
│  │  ├─ hooks/         Custom React hooks (e.g., useAuth)
│  │  ├─ lib/           Client-side libraries & utilities
│  │  ├─ pages/         Page components (mapped to routes)
│  │  ├─ App.tsx        Main application component, router setup
│  │  ├─ main.tsx       Client entry point
│  │  └─ index.css      Tailwind base styles & custom CSS
│  └─ index.html        HTML entry point
├─ db/                  Database related files
│  ├─ migrations/       Drizzle ORM migration files
│  ├─ index.ts          Drizzle client setup (connects to DB)
│  └─ seed.ts           Script to populate DB with sample data
├─ dist/                Production build output (generated by `npm run build`)
├─ server/              Express Backend API
│  ├─ auth.ts           Authentication setup (Passport.js)
│  ├─ routes.ts         API route definitions
│  ├─ storage.ts        Database interaction logic (using Drizzle)
│  ├─ vite.ts           Vite dev server integration & static serving
│  └─ index.ts          Server entry point
├─ shared/              Code shared between Client & Server
│  └─ schema.ts         Drizzle ORM & Zod validation schemas
├─ .env.example         Example environment variables file
├─ .gitignore           Git ignore rules
├─ .replit              Replit run configuration
├─ components.json      shadcn/ui configuration
├─ drizzle.config.ts    Drizzle Kit configuration for migrations
├─ Dockerfile           Instructions to build a Docker image
├─ package.json         Project dependencies and scripts
├─ package-lock.json    Locked dependency versions
├─ README.md            This file
├─ replit.nix           Replit environment setup (Nix)
├─ tailwind.config.ts   Tailwind CSS configuration
└─ tsconfig.json        TypeScript compiler configuration
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
🤖 For AI Assistants / Future Maintainers

Tech Stack: TypeScript monorepo structure (client/server/shared). Backend uses Express run with tsx in dev. Frontend uses React 18 with Vite. Database is PostgreSQL with Drizzle ORM. Sessions via express-session and connect-pg-simple. Auth via Passport.js.

Folder Conventions: API routes are defined directly in server/routes.ts. Frontend routes are managed by wouter in client/src/App.tsx, mapping paths to components in client/pages. Shared types/schemas are in shared/schema.ts.

Running Locally: Use npm run dev (starts API & Vite client on port 5001). Uses SQLite file (dev.db) if DATABASE_URL is not set.

Database Migrations: Managed by Drizzle Kit. Use npm run db:push to apply schema changes (destructive in dev, use drizzle-kit generate + migrate script for production workflows if needed).

Authentication Flow: Uses Passport's local strategy with email/password. Session data stored in Postgres (via connect-pg-simple) when DATABASE_URL is configured, otherwise likely in memory. User data fetched via /api/user. Login/Register/Logout via /api/login, /api/register, /api/logout.

Extensibility: Drizzle ORM abstracts database interactions in server/storage.ts. Swapping DBs (like to Prisma) would involve replacing db/, drizzle.config.ts, shared/schema.ts, and rewriting server/storage.ts and potentially parts of server/auth.ts (session store).

💡 FAQ

Q: It says “port 5001 already in use”.
A: Another process is using port 5001. Change PORT in your .env file (if using one) or find and stop the other process (e.g., lsof -i :5001 on macOS/Linux, then kill <PID>).

Q: I see a dev.db file created. What is it?
A: That's the fallback SQLite database used when you run npm run dev without setting up a DATABASE_URL environment variable. It's for quick local development. For persistent data or production, set up PostgreSQL.

Q: I see a warning "No SESSION_SECRET environment variable set..."
A: This means a temporary secret is being used for sessions, which is insecure. For development, it's usually fine. For production or persistent logins across server restarts, set a strong, unique SESSION_SECRET in your .env file or environment variables.

Q: Windows PowerShell gives weird caret symbols (^) in the README command.
A: The quick start command uses && for chaining. If you're copying line by line or having issues, try Git Bash, WSL (Windows Subsystem for Linux), or just run the commands individually: git clone ..., cd ..., npm install, npm run dev.

Made with 🧡 – Contributions, PRs & issues welcome!
