# TWBooks - Your Book Timeline

A Twitter-like interface for books where you can follow your favorite books and see their quotes in a social media timeline format.

## Features

- 🔍 **Book Search**: Search for books using the Open Library API
- 📚 **Follow Books**: Follow books like you would follow people on Twitter
- 💬 **Book Quotes**: Each book displays inspirational quotes in tweet format
- 🌓 **Dark Mode**: Full dark mode support with system preference detection
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔗 **External Links**: Direct links to Amazon, Kindle, and Goodreads
- 📊 **Reading Profile**: View your reading statistics and preferences

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Twitter-like theme
- **Database**: SQLite (local) / Vercel KV (production)
- **Data Fetching**: SWR for client-side data management
- **Icons**: React Icons (Feather)
- **External APIs**: Open Library for book search

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd twbooks2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deploying to Vercel

For production deployment on Vercel with persistent storage:

1. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

2. Set up Vercel KV database:
   - Go to your Vercel project dashboard
   - Navigate to Storage → Create Database → KV
   - Follow the setup wizard
   - Environment variables will be automatically configured

3. Redeploy your application

See [VERCEL_KV_SETUP.md](./VERCEL_KV_SETUP.md) for detailed instructions.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── search/            # Search page
│   ├── profile/           # Profile page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── db/               # Database interfaces and implementations
│   ├── api/              # External API integrations
│   └── utils/            # Helper functions
├── types/                 # TypeScript type definitions
├── public/               # Static assets
└── data/                 # SQLite database storage
```

## API Endpoints

- `GET /api/books` - Get all followed books
- `POST /api/books` - Follow a new book
- `DELETE /api/books/[id]` - Unfollow a book
- `GET /api/search` - Search for books
- `GET /api/books/[id]/quote` - Get a fresh quote for a book

## Database Schema

The application uses a flexible database abstraction that supports:
- **SQLite** (local development)
- **Vercel KV** (production on Vercel)

Both implementations use the same schema structure:

### Books Table
- `id` - Primary key (UUID)
- `title` - Book title
- `author` - Author name(s)
- `isbn` - ISBN number (optional)
- `cover_url` - Book cover image URL
- `quote` - Featured quote
- `amazon_id` - Amazon affiliate link
- `followed_at` - Timestamp when book was followed
- `description` - Book description (optional)
- `published_date` - Publication date (optional)
- `page_count` - Number of pages (optional)
- `goodreads_id` - Goodreads ID (optional)

### Database Switching Logic

The application automatically detects the environment and uses the appropriate database:

- **Local Development**: Uses SQLite database stored in `data/twbooks.db`
- **Vercel Production**: Uses Vercel KV when environment variables are present
- **Automatic Fallback**: Falls back to SQLite if KV is not properly configured

Environment variables required for KV:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Open Library API for book data
- Tailwind CSS for styling
- Next.js team for the amazing framework
- React Icons for the beautiful icons