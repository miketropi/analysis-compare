import { dbHelper } from '@/lib/dbHelper.js';

export const dynamic = 'force-dynamic';
export const fetchCache = "default-no-store"

export async function GET() {
  // get all 
  const reports = await dbHelper.all('SELECT * FROM reports ORDER BY id DESC');
  return Response.json({ success: true, data: reports }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}