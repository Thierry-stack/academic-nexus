/**
 * Reads API error text from fetch Response (JSON { error } or fallback for HTML/plain).
 */
export async function parseApiErrorMessage(res: Response): Promise<string> {
  const text = await res.text();

  if (text) {
    try {
      const data = JSON.parse(text) as { error?: unknown; message?: unknown };
      if (typeof data.error === 'string' && data.error.trim()) return data.error;
      if (typeof data.message === 'string' && data.message.trim()) return data.message;
    } catch {
      const condensed = text.replace(/\s+/g, ' ').trim().slice(0, 200);
      if (condensed.startsWith('<!') || condensed.startsWith('<html')) {
        return `Server error (${res.status}). Open the terminal where "npm run dev" is running and look for a stack trace.`;
      }
      if (condensed) return condensed;
    }
  }

  if (res.status === 404) {
    return `Not found (${res.status}). Confirm the dev server URL matches this page (same port as in the address bar).`;
  }

  return `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ''}).`;
}
