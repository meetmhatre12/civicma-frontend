# CivicMap frontend — Vercel deployment

This ZIP contains the **frontend only**. It keeps the existing Render API and MySQL backend.

## Vercel project settings
- Framework preset: Vite
- Root Directory: repository root (the folder containing `package.json`)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

The Vite config now builds into `dist`, fixing the prior “No Output Directory named dist” failure.

## Public frontend configuration
The included `.env.production` sets the known Render API origin and Supabase project URL/publishable key. These are browser-visible values; the publishable key is not a secret. The Supabase service-role key, database password, SMTP password and JWT signing secret must **never** be placed in this frontend. Keep those in Render environment variables only.

For future environment changes, set these in Vercel → Settings → Environment Variables and redeploy:
- `VITE_API_BASE_URL` = `https://civicmap-backend-1.onrender.com`
- `VITE_SUPABASE_URL` = `https://byfohuggawhkzgnikwcw.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable key

## Google sign-in
The frontend starts Google OAuth through Supabase and exchanges the resulting Supabase access token with Render at `/api/auth/supabase-login`. In Supabase Authentication → URL Configuration, add the exact deployed Vercel/production origin to **Site URL / Redirect URLs** (for example `https://YOUR-DOMAIN.vercel.app/login`). Google must be enabled as a provider in Supabase with the Google OAuth client ID/secret already configured in Google Cloud. Google Cloud authorized redirect URI must be the Supabase callback URL shown in the Supabase provider settings.

## Evidence uploads
The report form creates the observation through Render first, then attaches selected photo/video files through `/api/evidence/upload`. Upload requires a signed-in account, the issue record ID returned by Render, and configured Supabase Storage on the backend. The frontend cannot enable persistent storage by itself.

## Important
Do not upload backend files into this frontend repository. This package intentionally contains only the Vite frontend. After upload, inspect the Vercel build log and test `/api/system/health`, Google sign-in, GPS permission, record creation and evidence upload. A successful frontend build alone does not prove backend/database/storage readiness.
