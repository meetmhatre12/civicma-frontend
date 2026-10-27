# CivicMap Palghar Frontend — Vercel Deployment

This is the frontend-only package. Keep the existing Render backend and MySQL database unchanged.

## Vercel project settings

- Framework preset: **Vite**
- Root Directory: the directory containing this `package.json` (the `frontend` folder if uploaded inside the original full repository; repository root if using this frontend-only package)
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: **`build`** (intentionally not `dist`)
- Include `vercel.json` so client-side routes resolve to `index.html`.

## Environment variable

Set `VITE_API_BASE_URL` to the existing Render backend origin, for example `https://your-service.onrender.com`, without a trailing slash. Do not guess the actual service URL; copy the existing Render service's public URL.

The frontend fetches public Supabase OAuth configuration from the existing backend endpoint `/api/system/public-config`. Keep Supabase service-role keys, database passwords, SMTP credentials, and JWT signing secrets only in Render's server environment. Never put them in Vercel variables or this frontend package.

## Verify after deployment

1. Open the Vercel deployment URL and refresh `/map`, `/report`, `/login`, and `/dashboard` directly.
2. Confirm the browser can reach `${VITE_API_BASE_URL}/api/system/health`.
3. Test category and study-area loading on `/report`.
4. Test Google sign-in using the existing Supabase provider and configured redirect URLs.
5. Test GPS with browser permission and a real authenticated account.
6. Submit a test observation only when authorised and permitted, then verify its returned ID and evidence uploads.

A successful Vercel build does not by itself verify backend connectivity, OAuth, GPS permission, or evidence storage.
