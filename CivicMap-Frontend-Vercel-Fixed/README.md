# CivicMap Palghar — Frontend

Responsive React + Vite frontend for the existing CivicMap Palghar civic-observation platform. Uses the existing backend API; it does not include or redeploy the backend or database.

## Local development

1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_API_BASE_URL` to the existing Render backend URL.
4. Run `npm install`.
5. Run `npm run dev`.
6. Run `npm run build` for a production build. Output is `build/` (not `dist/`).

## Main routes

- `/` overview
- `/map` interactive observation map
- `/report` report form, browser GPS location, and evidence uploads
- `/infrastructure` observation records
- `/dashboard` metrics from the connected API
- `/login`, `/forgot-password`, `/verify-email`, `/reset-password`
- `/profile` account page
- `/about`, `/help`, `/contact`, `/privacy`, `/terms`, `/accessibility`

## Security

Only public configuration belongs in the frontend. Never add `SUPABASE_SERVICE_ROLE_KEY`, database credentials, SMTP passwords, or JWT signing secrets to Vite environment variables. Vite `VITE_*` values are included in the browser bundle.

See `VERCEL-DEPLOY.md` for deployment configuration and verification steps.


## Profile, report history and backend integration notes

- The profile page reads the authenticated account from `/api/auth/me`, updates supported fields through `PATCH /api/users/me`, and requests account-owned reports from `/api/issues?mine=true`.
- Report history requests evidence metadata from `/api/evidence/issue/:issueId`; the API applies its owner/public visibility rules.
- Dashboard counts are derived from issue records returned by the API, not from sample values.
- The supplied backend currently does **not** expose a profile-avatar upload endpoint. The profile therefore does not show a misleading upload control or pretend that a profile image has been saved. Add persistent avatar storage and a backend endpoint before enabling that feature.
- Set `VITE_API_BASE_URL` to the Render service origin only (for example, `https://civicmap-backend-1.onrender.com`), without `/api` at the end. The frontend adds `/api` to requests itself.
- A production build was not verified in this environment because dependency installation timed out. Run `npm install` and `npm run build` before deploying.
