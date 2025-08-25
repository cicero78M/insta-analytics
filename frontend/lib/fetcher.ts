export async function api(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
  const res = await fetch(`${base}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  return res.json();
}
