export const BATCH = 100;

export function nameMatchesQuery(query: string, first: string, last: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const full = `${first} ${last}`.toLowerCase();
  if (full.includes(q)) return true;
  const parts = q.split(/\s+/).filter(Boolean);
  return parts.length > 0 && parts.every((p) => full.includes(p));
}