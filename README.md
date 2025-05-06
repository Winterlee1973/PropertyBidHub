# PropertyBidHub

> **Real‑estate bidding made hackable.**  
> Built with **TypeScript + Express + React (Vite)** & **PostgreSQL (Drizzle ORM)**.

---

## 🚀 **Beginner Quick Start** (one‑copy‑paste)

> Works on macOS, Windows, Linux & Replit.

```bash
# 1. Install Node (18 LTS+) & Git first – skip if already done
# ▸ macOS:  brew install node git
# ▸ Windows: https://nodejs.org  +  https://git-scm.com

# 2. Grab the code & fire it up ⚡️
git clone https://github.com/yourname/PropertyBidHub.git   && cd PropertyBidHub   && npm install   && npm run dev

# Done! Open http://localhost:5000 ✨
# (If the browser didn’t open automatically.)
```

**That’s it.**  No database tweaks, no environment files—everything runs with an in‑memory SQLite fallback so beginners can play immediately. When you’re ready for a real Postgres database, jump to the advanced section.

---

## 🧰 **What’s Inside**

| Layer | Tech | Notes |
|-------|------|-------|
| Front‑end | React + Vite + shadcn/ui | Hot‑reload, Tailwind, TypeScript |
| API / SSR | Express & Vite middleware | Unified dev server |
| Database | Drizzle ORM (PostgreSQL / SQLite) | Zero‑pain migrations |
| Auth | JWT + bcrypt | Simple helpers in `/server/auth` |

---

## 🐣 **Beginner Cheatsheet**

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start dev server | `npm run dev` |
| Check code style | `npm run lint` |
| Build for prod | `npm run build` |

> ℹ️  All commands are run from the project root (`PropertyBidHub/`).

---

## 🔬 **Advanced / Hardcore Setup**

Feel like tweaking the stack? Here are the details.

### 1. Environment variables

Copy, then edit:
```bash
cp .env.example .env
```

Minimum required keys:
```
DATABASE_URL=postgres://user:pass@host:5432/propertybid
JWT_SECRET=change_me
PORT=5000
NODE_ENV=development
```

### 2. PostgreSQL & migrations
```bash
npm run db:push   # create/update tables
npm run db:seed   # optional – sample listings & bids
```

### 3. Useful npm scripts

| Script | Purpose |
|--------|---------|
| `npm run check` | Type‑checks the entire mono‑repo |
| `npm run test`  | Runs unit tests with Vitest |
| `npm run prisma`| (if using Prisma instead of Drizzle) |
| `npm run start` | Launches the compiled build (`dist/`) |

### 4. Replit specifics
* `.replit` sets `run = "npm run dev"` so the **Run** button just works.
* `replit.nix` installs Node 20, PostgreSQL 16 & `pnpm`.
* Use Replit **Secrets** to add `DATABASE_URL`, `JWT_SECRET` etc.

### 5. Docker
```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --omit=dev && npm run build
EXPOSE 5000
CMD ["npm","run","start"]
```

Build & run:
```bash
docker build -t propertybid .
docker run -p 5000:5000 --env-file .env propertybid
```

---

## 📂 **Project Structure**

```
/
├─ client/              React UI (Vite)
│  ├─ components/       Shared UI primitives (shadcn/ui)
│  └─ pages/            Route‑based code‑splitting
├─ server/              Express API & server‑side rendering
│  ├─ routes/
│  └─ auth/
├─ db/                  Drizzle schemas & seeders
├─ shared/              Isomorphic helpers & Zod types
└─ .replit, replit.nix  Replit runtime config
```

---

## 🤖 **For AI Assistants / Future Maintainers**

* **Tech stack:** TypeScript monorepo, pnpm workspaces optional. Front‑end uses React 18 streaming with Vite SSR plugin. DB layer is abstracted behind Drizzle but swappable.
* **Folder conventions:** Any file ending in `.route.ts` inside `server/routes` auto‑registers with Express. Front‑end routes live in `client/pages` and map to React Router paths.
* **CI:** GitHub Actions runs lint ⟫ tsc ⟫ vitest on every PR. Deployment pipeline (optional) in `/.github/workflows/deploy.yml` pushes Docker image to GHCR.
* **Testing hooks:** `pre-commit` = ESLint & Prettier; `pre-push` = Vitest.
* **Extensibility:** Swap Tailwind for Chakra or Mantine by editing `tailwind.config.ts` and component imports. Replace Drizzle with Prisma by removing `db/` and adding `schema.prisma`; scripts expect a `npm run prisma:migrate`.

---

## 💬 FAQ

**Q: It says “port 5000 already in use”.**  
A: Change `PORT` in `.env` or kill the other process (`lsof -i :5000`).

**Q: SQLite vs Postgres?**  
A: Beginners can ignore Postgres and just hack away—Drizzle will default to a local `dev.db`. Production requires Postgres.

**Q: Windows PowerShell gives weird caret symbols (`^`).**  
A: Use Git Bash, WSL, or remove the line continuations (`\`).

---

### Made with 🧡  – PRs & issues welcome!
