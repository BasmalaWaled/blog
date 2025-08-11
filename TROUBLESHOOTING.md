# Blog Refactoring - Troubleshooting Guide & Setup Instructions

## 🚨 Errors Encountered & Solutions

### 1. **PrismaClientInitializationError: Environment variable not found: DATABASE_URL**

**Error:**
```
Invalid `prisma.post.deleteMany()` invocation
error: Environment variable not found: DATABASE_URL.
```

**Why it occurred:**
- The `.env` file was missing or didn't contain the `DATABASE_URL` variable
- Prisma requires a database connection string to initialize the client

**How it was fixed:**
1. Created `.env` file in the project root
2. Added PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://postgres:1234@localhost:5432/blogdb"
   ```

---

### 2. **Prisma Schema Provider Mismatch**

**Error:**
Initially configured for SQLite but needed PostgreSQL

**Why it occurred:**
- Started with SQLite for quick testing but requirements specified PostgreSQL
- Schema provider didn't match the database URL

**How it was fixed:**
1. Updated `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

---

### 3. **Server-Side Rendering Fetch Issues**

**Error:**
```
Failed to fetch posts: Server error
```

**Why it occurred:**
- Next.js App Router server components can't fetch from `localhost` during SSR
- The page was trying to fetch from `http://localhost:3000/api/posts` during build time

**How it was fixed:**
1. Initially tried direct Prisma calls in server component
2. Later converted to client component with proper state management:
   ```tsx
   'use client';
   import { useState, useEffect } from 'react';
   
   const fetchPosts = async () => {
     const res = await fetch('/api/posts');
     // ... handle response
   };
   ```

---

### 4. **Prisma Client Generation Issues**

**Error:**
```
EPERM: operation not permitted, rename 'query_engine-windows.dll.node.tmp'
```

**Why it occurred:**
- Windows file permission issues during Prisma client generation
- Antivirus or file locks preventing file operations

**How it was fixed:**
1. Ran `npx prisma generate` separately
2. Used `npx prisma db push` instead of migrations for development
3. Cleared `node_modules/.prisma` when needed

---

### 5. **React Hook Usage Error**

**Error:**
Incorrect `useState` usage for side effects

**Why it occurred:**
- Mistakenly used `useState(() => {}, [])` instead of `useEffect`
- Copy-paste error during refactoring

**How it was fixed:**
```tsx
// Wrong:
useState(() => {
  fetchPosts();
}, []);

// Correct:
useEffect(() => {
  fetchPosts();
}, []);
```

---

## 🛠️ Setup Instructions for New Developers

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database running locally
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd basmalablog
npm install
```

### 2. Database Setup

**Option A: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create database:
   ```sql
   CREATE DATABASE blogdb;
   ```
3. Create `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blogdb"
   ```

**Option B: Docker PostgreSQL**
```bash
docker run --name postgres-blog \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=blogdb \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Database Migration & Seeding
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
node prisma/seed.js
```

### 4. Start Development Server
```bash
npm run dev
```

Application will be available at: `http://localhost:3000`

---

## 🔧 Common Commands

### Database Operations
```bash
# View database in browser
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Push schema changes without migration
npx prisma db push

# Generate Prisma client after schema changes
npx prisma generate
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## 📁 Project Structure

```
basmalablog/
├── app/
│   ├── api/posts/          # Posts API endpoints
│   ├── page.tsx            # Home page with posts list
│   └── layout.tsx          # Root layout
├── components/
│   └── header/             # Header components
├── lib/
│   ├── prisma.ts           # Prisma client setup
│   └── seed.ts             # TypeScript seed file
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.js             # JavaScript seed file
│   └── migrations/         # Database migrations
├── utils/
│   ├── types.ts            # TypeScript type definitions
│   ├── dtos.ts             # Data transfer objects
│   └── data.ts             # Static data (unused)
├── .env                    # Environment variables
└── package.json            # Dependencies
```

---

## 🎯 API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/[id]` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Example API Usage
```javascript
// Create post
fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Post',
    content: 'Post content',
    authorId: 1
  })
})

// Delete post
fetch('/api/posts/1', {
  method: 'DELETE'
})
```

---

## 🐛 Debugging Tips

1. **Database Connection Issues:**
   - Check PostgreSQL is running: `pg_isready`
   - Verify `.env` file exists and has correct DATABASE_URL
   - Test connection: `npx prisma db pull`

2. **Prisma Issues:**
   - Clear generated client: `rm -rf node_modules/.prisma`
   - Regenerate: `npx prisma generate`
   - Check schema syntax: `npx prisma validate`

3. **Next.js Issues:**
   - Clear Next.js cache: `rm -rf .next`
   - Check for TypeScript errors: `npx tsc --noEmit`
   - Restart development server

4. **Port Already in Use:**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Or use different port
   npm run dev -- -p 3001
   ```

---

## 📝 Notes

- The project uses Next.js 15 with App Router
- Prisma ORM for database operations
- PostgreSQL as the primary database
- Tailwind CSS for styling
- TypeScript for type safety

**Last Updated:** January 2025