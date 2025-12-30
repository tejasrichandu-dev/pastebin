# Pastebin-Lite

A simple, lightweight pastebin application for creating and sharing text pastes with optional expiration and view limits.

## Technologies Used

- **Next.js 14.2.15**: React framework for full-stack web development
- **React 18**: UI library for building interactive interfaces
- **TypeScript 5**: Typed JavaScript for better code quality
- **Prisma 5.0.0**: ORM for database management with SQLite
- **nanoid**: Library for generating unique paste IDs
- **ESLint**: Code linting tool

## Features

- Create and share text pastes
- Optional time-to-live (TTL) for automatic expiration
- Optional maximum view count before deletion
- Unique URLs for each paste
- RESTful API for programmatic access

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pastebin-lite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Web Interface

- Visit the homepage to create a new paste.
- Enter your text, set optional TTL and max views.
- Share the generated URL.

### API Endpoints

- `GET /api/healthz`: Health check
- `POST /api/pastes`: Create a new paste
- `GET /api/pastes/[id]`: Retrieve a paste by ID

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push database schema

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.