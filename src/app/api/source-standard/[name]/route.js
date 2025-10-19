import { dbHelper } from '@/lib/dbHelper.js';

export const dynamic = 'force-dynamic';
export const fetchCache = "default-no-store"

export async function GET(_request, { params }) {
  const { name } = params;
  const sourceStandard = await dbHelper.get('SELECT * FROM sourceStandard WHERE name = ?', [name]);

  // check sourceStandard
  if (!sourceStandard) {
    return Response.json({ error: 'Source standard not found' }, { status: 404 });
  }

  return Response.json(sourceStandard, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
