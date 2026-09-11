# Life Pilot

Personal budget, expense, routine, timer and notes workspace with a Next.js frontend and a NestJS/PostgreSQL backend.

## Local development

1. Run `pnpm install` in both repositories.
2. Configure the backend `.env`, run `pnpm db:migrate`, and start the backend with `pnpm dev` on port 4000.
3. Copy this frontend's `.env.example` to `.env` and set `API_BASE_URL=http://127.0.0.1:4000/api`.
4. Run `pnpm dev` here and open http://localhost:3000.

`API_BASE_URL` is a server-side runtime setting. The older `NEXT_PUBLIC_API_BASE_URL` is accepted as a fallback. Browser requests always use same-origin `/api`.

## Authentication and persistence

Only `/login` and `/register` are public pages. `/` redirects to `/dashboard`. Next.js Proxy checks sessions before private pages render; the NestJS global guard authorizes protected API requests.

Login/register establish an HttpOnly, SameSite=Lax session cookie, Secure over HTTPS. Bearer tokens and workspace data are not stored in localStorage. Old shared browser data is ignored and never automatically uploaded. Auth changes propagate across tabs using an event marker without credentials.

Each collection loads from its own API. Mutations use focused CRUD endpoints, update Redux after success, and show failures without clearing forms. Writes are serialized within the workspace. Whole-state replacement is used only for confirmed backup import/reset. Different devices can still conflict when editing the same record; there is no offline write queue.

| UI                                                       | Backend routes under `/api`                                 |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| Login/register/logout                                    | `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout` |
| Categories and budget                                    | `/life-os/categories`, `/:id`, `/:id/limit`                 |
| Expenses and receipt text                                | `/life-os/expenses`, `/bulk`, `/:id`                        |
| Tasks and routine                                        | `/life-os/tasks`, `/:id`, `/:id/status`, `/reorder`         |
| Timer history                                            | `/life-os/timer-sessions`                                   |
| Notes, shopping, health, family, goals, meals, reminders | `/life-os/notes` with collection tags                       |
| Preferences and account profile                          | `/life-os/settings`, `/account/profile`                     |
| Backup/export/import/reset                               | `/life-os/state`, `/life-os/reset`                          |
| Connection status                                        | `/health`, `/health/db`                                     |

Dashboard, reports and calendar derive values from authenticated collections. New accounts start empty. Currency follows the saved preference; changing currency changes display units and does not convert historical amounts.

## Available integrations

Receipt text parsing and planning/notes assistants use local rules. Image OCR, external AI providers and OAuth are not connected. Password recovery calls the backend, which returns HTTP 501 until email delivery and reset completion are implemented. Browser routine notifications run while the routine page is open; they are not background push notifications.

## Validation

- `pnpm lint`
- `pnpm build` in both repositories
- `pnpm exec playwright install chromium`, or set `TEST_BROWSER_CHANNEL=chrome` to use installed Chrome
- `pnpm test:integration`

Integration tests use the PostgreSQL configured in the backend `.env` and require permission to create temporary schemas. They prepare an isolated schema, apply migrations there, launch the built backend on 4100 and standalone frontend on 3100, test real browser/API flows, and remove that schema afterward. Existing user data is untouched. Ports can be overridden with `TEST_API_PORT` and `TEST_WEB_PORT`. Logs/screenshots go to ignored `.tmp/`.

## Docker

`docker compose up --build` runs the frontend on port 3000. Set `API_BASE_URL` to the backend address reachable from its container; the default is `http://host.docker.internal:4000/api`. The backend repository supplies its own API/PostgreSQL Compose stack.
