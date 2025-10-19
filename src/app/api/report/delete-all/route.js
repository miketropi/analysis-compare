import { dbHelper } from '@/lib/dbHelper.js';

export async function DELETE(_) {
  await dbHelper.deleteAll('reports');
  return Response.json({ success: true, message: 'All reports deleted ✅' });
}