/** Dashboard settings from the environment (server only). Empty client id = dashboard off. */

const clean = (v: string | undefined) => (v ?? "").trim();

export const authConfig = {
  storeSlug: clean(process.env.NEXT_PUBLIC_SSS_STORE_SLUG) || "benediction-barber",
  apiUrl: (clean(process.env.NEXT_PUBLIC_SSS_API_URL) || "https://sss-api.fpswagg.site").replace(/\/+$/, ""),
  siteUrl: (clean(process.env.SITE_URL) || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") || "http://localhost:3000").replace(/\/+$/, ""),
  oauthClientId: clean(process.env.SSS_OAUTH_CLIENT_ID),
  oauthClientSecret: clean(process.env.SSS_OAUTH_CLIENT_SECRET),
  oauthScope: clean(process.env.SSS_OAUTH_SCOPE) || "profile email business",
  /** Encrypts the sign-in cookie: at least 32 random characters in production. */
  sessionSecret: clean(process.env.SESSION_SECRET),
  /** The SSS app, linked from the dashboard. */
  appUrl: (clean(process.env.SSS_APP_URL) || "https://sss.fpswagg.site").replace(/\/+$/, ""),
};

/** Cache tag on every SSS fetch of the public site: dashboard edits clear it. */
export const SSS_TAG = "sss";
