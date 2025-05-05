# PropertyBid - Real Estate Bidding Platform

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

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Start the development server:
   ```
   npm run dev
   ```

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