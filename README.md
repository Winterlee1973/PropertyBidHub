# PropertyBidHub

A full‑stack real‑estate bidding platform powered by **Express + React + Vite** and **PostgreSQL (Drizzle ORM)**. Out of the box it runs locally in VS Code *and* in Replit with zero config.

---

## 🚀 Quick Start (local / VS Code)

```bash
# 1. Clone & install
git clone https://github.com/yourname/PropertyBidHub.git
cd PropertyBidHub
npm install              # installs server + client + dev deps

# 2. Configure environment
cp .env.example .env
# → edit .env and set:
# DATABASE_URL=postgres://user:password@localhost:5432/propertybid

# 3. Prepare the database
npm run db:push          # creates tables via Drizzle
npm run db:seed          # (optional) load demo data

# 4. Launch the dev server
npm run dev              # http://localhost:5000 (Vite + Express)
```

### One‑click launch in VS Code
1. Open the folder (`code PropertyBidHub`).
2. Install the suggested extensions (ESLint, Tailwind CSS IntelliSense, Prettier).
3. Press **F5** or click **Run ▶** ▸ *Launch Dev Server*.

---

## ⚙️  Running on Replit
This repo ships with a `.replit` file and Nix manifest.

| Action | What happens |
|--------|--------------|
| **Run** button | Executes `npm run dev` inside a Node 20 + PostgreSQL 16 container |
| **Secrets**    | Add `DATABASE_URL`, `JWT_SECRET`, etc. |
| **Deploy**     | Uses the `build` + `start` commands defined under `[deployment]` |

> **Tip:** Replit Postgres spins up automatically. Copy the generated connection string into `DATABASE_URL`, then run `npm run db:push` once.

---

## 🗂️  Directory structure

```
/
├─ client/              # React front‑end (Vite + shadcn/ui + Tailwind)
├─ server/              # Express API & SSR entry
├─ db/                  # Drizzle schemas & seed scripts
├─ shared/              # Isomorphic utilities & types
├─ .replit              # Replit runtime config
├─ drizzle.config.ts    # Drizzle migration settings
└─ tailwind.config.ts   # Design system tokens
```

---

## 📦  Prerequisites

| Tool        | Version            | Notes                                   |
|-------------|--------------------|-----------------------------------------|
| Node.js     | 18 LTS or higher (20 tested) | Required for server & client         |
| npm         | 9+ (bundled with Node)       |                                       |
| PostgreSQL  | 14+ **OR** Neon Serverless   | Connection string in `DATABASE_URL`   |
| Git         | any                          |                                       |
| (optional)  | VS Code extensions           | ESLint, Prettier, Tailwind IntelliSense, Prisma extension (works for Drizzle) |

---

## 📝  Environment variables

Create an `.env` file (ignored by Git) with at least:

```
DATABASE_URL=postgres://user:pass@host:port/db
PORT=5000              # optional — defaults to 5000
NODE_ENV=development   # or production
```

Add the same keys in Replit under **Secrets** ➜ *Environment*.

---

## 🔧  Useful npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev`      | Hot‑reload server (tsx) + Vite client |
| `npm run build`    | Bundle client & server for production  |
| `npm run start`    | Start the compiled build (`dist/`)     |
| `npm run check`    | Type‑check with `tsc`                  |
| `npm run db:push`  | Push the current Drizzle schema        |
| `npm run db:seed`  | Seed the DB with sample data           |

---

## 🏗️  Production build / Docker

```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . . 
RUN npm ci --omit=dev && npm run build
EXPOSE 5000
CMD ["npm","run","start"]
```

Or build locally then copy only the `dist` folder and minimal `package.json`:

```bash
npm run build
npm prune --omit=dev
node dist/index.js
```

---

## 💡  Project goals
* Provide a simple codebase to experiment with full‑stack TypeScript.
* Run unmodified in both **VS Code** and **Replit**.
* Showcase Drizzle ORM + Radix UI + Tailwind + Vite SSR.

Feel free to fork and tweak—PRs welcome! 🎉
