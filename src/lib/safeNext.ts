/**
 * Only allow redirecting to an internal path from a `?next=` query param,
 * never to an absolute/external URL (open-redirect protection).
 */
export function getSafeNextPath(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;

  return value;
}
