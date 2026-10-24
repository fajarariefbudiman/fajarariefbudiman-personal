/** DiGiat cross-domain pageview integration. No credentials are exposed in this client. */
const ENDPOINT = import.meta.env.VITE_DIGIAT_TRACKING_URL as
  | string
  | "https://digiatgroup.com/api/track.php";
const VISITOR_KEY = "fajar_digiat_visitor_v1";
const SESSION_KEY = "fajar_digiat_session_v1";
const SESSION_TTL = 30 * 60 * 1000;
const UUID_RE =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

const newId = () => crypto.randomUUID();
let fallbackVisitor: string | undefined;
let fallbackSession: { id: string; last: number } | undefined;
let initialPage = true;

function visitorId(): string {
  try {
    const current = localStorage.getItem(VISITOR_KEY);
    if (current && UUID_RE.test(current)) return current;
    const id = newId();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return (fallbackVisitor ??= newId());
  }
}

function sessionId(): string {
  const now = Date.now();
  let current = fallbackSession;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (
        parsed &&
        typeof parsed === "object" &&
        "id" in parsed &&
        "last" in parsed &&
        typeof parsed.id === "string" &&
        UUID_RE.test(parsed.id) &&
        typeof parsed.last === "number"
      ) {
        current = { id: parsed.id, last: parsed.last };
      }
    }
  } catch {
    /* storage may be blocked */
  }
  if (
    !current ||
    now - current.last > SESSION_TTL ||
    current.last > now + 60000
  ) {
    current = { id: newId(), last: now };
  }
  current.last = now;
  fallbackSession = current;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(current));
  } catch {
    /* optional */
  }
  return current.id;
}

export function trackFajarPageview(path: string): void {
  if (import.meta.env.DEV || !ENDPOINT || typeof window === "undefined") return;
  if (
    !path.startsWith("/") ||
    path.startsWith("/admin") ||
    path.startsWith("/client/dashboard")
  )
    return;
  const ref = initialPage ? document.referrer : "";
  initialPage = false;
  try {
    void fetch(ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      keepalive: true,
      body: JSON.stringify({ vid: visitorId(), sid: sessionId(), path, ref }),
    }).catch(() => undefined);
  } catch {
    /* analytics must never break UI */
  }
}
