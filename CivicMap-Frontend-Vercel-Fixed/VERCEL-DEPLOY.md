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

The existing Render service shown in your deployment logs is `https://civicmap-backend-1.onrender.com`. The frontend package includes this as its production default in `.env.production`. If you set a Vercel environment variable, use `VITE_API_BASE_URL=https://civicmap-backend-1.onrender.com` (no `/api` suffix and no trailing slash), then redeploy.

The frontend fetches public Supabase OAuth configuration from the existing backend endpoint `/api/system/public-config`. Keep Supabase service-role keys, database passwords, SMTP credentials, and JWT signing secrets only in Render's server environment. Never put them in Vercel variables or this frontend package.

## Required Render CORS setting

In Render → the existing `civicmap-backend-1` service → Environment, set `CLIENT_URL` to the exact deployed Vercel origin (for example `https://your-project.vercel.app`) and include the same origin in `CORS_ORIGINS`. If more than one frontend origin is used, separate origins with commas. Do not include a page path or trailing slash. Save and allow Render to restart.

## Verify after deployment

1. Open the Vercel deployment URL and refresh `/map`, `/report`, `/login`, and `/dashboard` directly.
2. Confirm the browser can reach `${VITE_API_BASE_URL}/api/system/health`.
3. Test category and study-area loading on `/report`.
4. Test Google sign-in using the existing Supabase provider and configured redirect URLs.
5. Test GPS with browser permission and a real authenticated account.
6. Submit a test observation only when authorised and permitted, then verify its returned ID and evidence uploads.

A successful Vercel build does not by itself verify backend connectivity, OAuth, GPS permission, or evidence storage.
