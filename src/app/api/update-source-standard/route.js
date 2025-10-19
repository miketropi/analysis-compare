import { dbHelper } from '@/lib/dbHelper.js';

export async function POST(request) {
  const data = await request.json();

  // find sourceStandard by name 
  const sourceStandard = await dbHelper.get('SELECT * FROM sourceStandard WHERE name = ?', [data.name]);

  // if sourceStandard exists then update content or not exists add new 
  if (sourceStandard) {
    await dbHelper.update('sourceStandard', { content: JSON.stringify(data.report) }, 'name = ?', [data.name]);
  } else {
    await dbHelper.insert('sourceStandard', { name: data.name, content: JSON.stringify(data.report), create_date: new Date().toISOString() });
  }

  return Response.json({
    success: true,
    message: 'Source standard updated successfully',
    data: data
  }, { status: 200 });
}