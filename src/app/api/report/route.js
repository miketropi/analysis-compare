import { dbHelper } from '@/lib/dbHelper.js';

export async function GET() {
  // get all 
  const reports = await dbHelper.all('SELECT * FROM reports ORDER BY id DESC');
  return Response.json({ success: true, data: reports });
}