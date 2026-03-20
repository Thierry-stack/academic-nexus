/**
 * True when MONGODB_URI is missing or blank (Next.js reads .env.local at dev server startup).
 */
export function isMongoUriMissing(): boolean {
  return !process.env.MONGODB_URI?.trim();
}

export const MONGO_URI_MISSING_MESSAGE =
  'MONGODB_URI is not set. In the folder that contains package.json, create a file named .env.local, add: MONGODB_URI=mongodb+srv://... (your Atlas string), save, then stop and restart npm run dev.';

export const MONGO_CONNECT_FAILED_MESSAGE =
  'Could not connect to MongoDB Atlas. Check: (1) Network Access allows your IP (or 0.0.0.0/0 while testing); (2) Database user and password in Atlas; (3) If the password has @ : / ? # $ % & + characters, use URL encoding in the URI (e.g. @ → %40, $ → %24, & → %26, + → %2B); (4) Restart npm run dev after editing .env.local.';

/** In development, prepend the real driver error so you see the exact failure. */
export function mongoConnectFailedBody(error: unknown): string {
  if (process.env.NODE_ENV === 'production') {
    return MONGO_CONNECT_FAILED_MESSAGE;
  }
  if (error instanceof Error && error.message?.trim()) {
    return `${error.message}\n\n—\n${MONGO_CONNECT_FAILED_MESSAGE}`;
  }
  return MONGO_CONNECT_FAILED_MESSAGE;
}

export function isMongoConfigErrorMessage(message: string): boolean {
  const m = message.toLowerCase();
  return m.includes('missing mongodb_uri') || m.includes('mongodb_uri is not set');
}

export function isMongoConnectivityFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (isMongoConfigErrorMessage(error.message)) return false;
  const m = error.message.toLowerCase();
  return (
    m.includes('mongo') ||
    m.includes('econnrefused') ||
    m.includes('enotfound') ||
    m.includes('querySrv') ||
    m.includes('ssl') ||
    m.includes('tls') ||
    m.includes('authentication failed') ||
    m.includes('bad auth') ||
    m.includes('server selection timed') ||
    m.includes('ip that isn') ||
    m.includes('whitelist') ||
    m.includes('not authorized')
  );
}
