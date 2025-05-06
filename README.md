
# PropertyBidHub

PropertyBidHub is a web platform designed to facilitate online property bidding. This monorepo contains all the components needed for the application, including the client frontend, server backend, and database setup.

## Project Structure

```
PropertyBidHub-main/
├── client/           # Frontend built with React and TypeScript
├── server/           # Backend APIs and authentication
├── db/               # Drizzle ORM database config and migrations
├── shared/           # Shared schema and utilities
├── attached_assets/  # Screenshots and design references
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- Git
- VS Code or Replit account

---

## ⚙️ Setup Instructions

### In VS Code

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Winterlee1973/PropertyBidHub.git
   cd PropertyBidHub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the app locally**:
   ```bash
   npm run dev
   ```

4. **Database setup**:
   - Ensure SQLite is available.
   - Apply migrations using:
     ```bash
     npm run db:push
     ```

---

### In Replit

1. **Import from GitHub**:
   - Use the Replit "Import from GitHub" option and paste the repo URL.

2. **Configure `.replit`**:
   Ensure your `.replit` and `replit.nix` (if applicable) are set up to:
   - Install dependencies
   - Run the dev server using `npm run dev`

3. **Environment Variables**:
   Use Replit secrets to store any sensitive information (e.g., API keys, database paths).

4. **Database**:
   - Use Replit's filesystem (SQLite should work out of the box).
   - Run migrations manually using the Replit shell.

---

## 🧪 Testing

TBD – include testing setup and commands here if needed.

---

## 🔧 Troubleshooting

- **Replit dev server not launching**: Ensure correct start command in `.replit`
- **VS Code issues**: Make sure correct Node version and dependencies are installed
- **Database errors**: Check SQLite file path and migration status

---

## 📄 License

This project is licensed under the MIT License.
