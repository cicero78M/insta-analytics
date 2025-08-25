export async function api(path: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:4001';
  const r = await fetch(`${base}${path}`, { cache: 'no-store' });
  return r.json();
}
