# Vercel KV Setup Guide for TWBooks

This guide explains how to set up Vercel KV storage for the TWBooks application to make it work properly when deployed to Vercel.

## Why KV Storage?

Vercel's serverless environment doesn't support persistent file storage, which means SQLite databases are reset between deployments. Vercel KV (Key-Value storage) provides a Redis-compatible database that persists data across deployments.

## Setup Instructions

### 1. Create a Vercel KV Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to the **Storage** tab
4. Click **Create Database**
5. Choose **KV** (Key-Value Database)
6. Give it a name (e.g., "twbooks-kv")
7. Select the same region as your app for better performance
8. Click **Create**

### 2. Configure Environment Variables

After creating the KV database:

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. The KV database should have automatically added these variables:
   - `KV_URL`
   - `KV_REST_API_URL` 
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN` (optional)

If they weren't added automatically:
1. Go to **Storage** → **[Your KV Database]** → **Settings**
2. Copy the environment variables from the **Environment Variables** section
3. Add them to your project's environment variables

### 3. Deploy Your App

1. Commit and push your code to your repository
2. Vercel will automatically redeploy your app
3. The app will now use KV storage instead of SQLite

## Local Development

### Option 1: Use SQLite (Recommended)
- No setup required
- Database file stored at `data/twbooks.db`
- Perfect for development and testing

### Option 2: Use KV Locally
If you want to test with KV storage locally:

1. Create a `.env.local` file in your project root
2. Copy the KV environment variables from your Vercel dashboard
3. Add them to `.env.local`:
   ```env
   KV_URL=redis://your-kv-url
   KV_REST_API_URL=https://your-rest-api-url
   KV_REST_API_TOKEN=your-auth-token
   KV_REST_API_READ_ONLY_TOKEN=your-readonly-token
   ```
4. Restart your development server

## How It Works

The app automatically detects the environment and chooses the appropriate database:

- **Local Development**: Uses SQLite by default
- **Vercel Production**: Uses KV when environment variables are present
- **Fallback**: Always falls back to SQLite if KV is not properly configured

## Database Switching Logic

```typescript
// Checks for these environment variables:
const hasKvUrl = !!process.env.KV_URL;
const hasKvRestUrl = !!process.env.KV_REST_API_URL; 
const hasKvToken = !!process.env.KV_REST_API_TOKEN;

// Uses KV if all three are present, otherwise uses SQLite
const useKV = hasKvUrl && hasKvRestUrl && hasKvToken;
```

## Data Migration

**Important**: When switching from SQLite to KV, your existing books will not be automatically migrated. This is expected behavior for the initial deployment.

If you need to preserve existing data:
1. Export your books data from the SQLite database
2. Import it manually after setting up KV storage

## Troubleshooting

### App Works Locally But Not on Vercel
- Check that KV environment variables are properly set in Vercel dashboard
- Verify the KV database is in the same region as your app
- Check Vercel function logs for specific error messages

### "Database not initialized" Errors
- Ensure all three required KV environment variables are present
- Try redeploying your app after setting up the variables

### Performance Issues
- Make sure your KV database is in the same region as your Vercel app
- Consider implementing caching for frequently accessed data

## Cost Considerations

Vercel KV pricing is based on:
- **Storage**: Amount of data stored
- **Requests**: Number of database operations
- **Bandwidth**: Data transferred

For a personal book tracking app, the free tier should be sufficient. Monitor your usage in the Vercel dashboard.

## Support

If you encounter issues:
1. Check the [Vercel KV documentation](https://vercel.com/docs/storage/vercel-kv)
2. Review your Vercel function logs
3. Ensure all environment variables are correctly set