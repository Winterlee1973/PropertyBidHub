# 🏠 PropertyBidHub - Real Estate Bidding Platform

A dynamic real estate bidding platform that enables users to view properties, place competitive bids, and manage property visits with enhanced mobile compatibility.

## Features

- **Search Functionality**: Find properties by location with autocomplete suggestions
- **Real-time Property Bidding**: Place competitive bids on available properties
- **User Authentication**: Secure login and registration system
- **Property Details**: Comprehensive information including images, descriptions, and specifications
- **Visit Scheduling**: Book property visits at convenient times
- **Responsive Design**: Fully compatible with all device sizes

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js
- **Styling**: Tailwind CSS with shadcn/ui components

## 🔧 Local Setup (VSCode)

1. **Clone the repo:**

   ```bash
   git clone https://github.com/Winterlee1973/PropertyBidHub.git
   cd PropertyBidHub
   ```

2. **Install Node.js LTS (v20 recommended)** using [nvm](https://github.com/nvm-sh/nvm):

   ```bash
   nvm install 20
   nvm use 20
   ```

3. **Install dependencies & build:**

   ```bash
   npm install
   npx tsc
   ```

4. **Create a `.env` file:**

   ```env
   DATABASE_URL=your_postgres_url_here
   SESSION_SECRET=your_secret_here
   PORT=5000
   ```

5. **Run the server:**

   ```bash
   npm run dev
   ```

## ☁️ Replit Setup

1. **Pull latest from GitHub (if needed):**

   ```bash
   git pull origin main
   ```

2. **Install dotenv using Replit tool:**

   ```bash
   packager_tool install nodejs ["dotenv"]
   ```

3. **Set secrets (🔒 Secrets tab in Replit):**

   * `DATABASE_URL`
   * `SESSION_SECRET`

4. **Start the server:**

   ```bash
   npm run dev
   ```

You should see:

```bash
> rest-express@1.0.0 dev
> tsx server/index.ts
[express] serving on port 5000
```

## 🔄 GitHub Sync Tips

* **From VSCode to Replit:**

  ```bash
  git add .
  git commit -m "My changes"
  git push origin main
  ```

  Then in Replit:

  ```bash
  git pull origin main
  ```

* **From Replit to VSCode:**
  Commit and push in Replit UI or shell, then in VSCode:

  ```bash
  git pull origin main
  ```

## 🛠️ Need to roll back?

* Use VSCode Git Graph or `git checkout <commit-id>` to safely explore older versions.
* Always push to GitHub after confirming you're on the right commit/branch.

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Shared types and schemas
- `/db` - Database configuration and migrations

## API Endpoints

- **Authentication**
  - `POST /api/register` - Register a new user
  - `POST /api/login` - Log in an existing user
  - `POST /api/logout` - Log out the current user
  - `GET /api/user` - Get the current user's profile

- **Properties**
  - `GET /api/properties` - Get all properties
  - `GET /api/properties/:id` - Get a specific property
  - `POST /api/properties/:id/bids` - Place a bid on a property
  - `POST /api/properties/:id/visits` - Schedule a visit to a property

- **User Data**
  - `GET /api/user/bids` - Get all bids placed by the current user
  - `GET /api/user/visits` - Get all visits scheduled by the current user

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Shadcn UI for the component library
- TanStack Query for data fetching
- Drizzle ORM for database operations