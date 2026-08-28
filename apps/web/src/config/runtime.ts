/**
 * Runtime configuration for the web app.
 *
 * The API base URL is read from a Vite-injected env var
 * (`VITE_API_BASE_URL`) and falls back to the live worker URL so the
 * production build works out of the box.
 */
const FALLBACK_API_BASE = "https://vishal-enterprises-api.gujaratsamachar.workers.dev";

export const runtimeConfig = {
  apiBaseUrl:
    (import.meta.env.VITE_API_BASE_URL as string | undefined) || FALLBACK_API_BASE,
};
