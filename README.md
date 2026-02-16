# avsar

The Operating System for Modern Events.

## Setup

1. Install dependencies

```bash
npm install
```

2. Create your environment file

```bash
cp .env.example .env.local
```

3. Start Convex dev backend

```bash
npx convex dev
```

4. Start Next.js app

```bash
npm run dev
```

## Environment Variables

Add the following values in `.env.local`:

```env
# From `npx convex dev` output
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# From Clerk dashboard -> API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Clerk routes (keep as-is unless you changed auth routes)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# From Clerk dashboard -> JWT Templates / domain config
CLERK_JWT_ISSUER_DOMAIN=

# From Unsplash developer app access key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=

# From Google AI Studio (Gemini API key)
GEMINI_API_KEY=
```

## Where to find each value

- `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`: run `npx convex dev` in project root and copy from terminal output.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`: Clerk Dashboard -> your application -> API Keys.
- `CLERK_JWT_ISSUER_DOMAIN`: Clerk Dashboard -> JWT settings/templates (issuer/domain value).
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`: Unsplash Developers -> Your App -> Access Key.
- `GEMINI_API_KEY`: Google AI Studio -> API Keys.

## Other required things

- Node.js `20+` recommended.
- Valid accounts/services: Convex, Clerk, Unsplash, Google AI Studio.
- If auth does not work, verify Clerk redirect URLs include your local URL (for example `http://localhost:3000`).
