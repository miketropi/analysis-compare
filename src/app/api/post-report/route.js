import { dbHelper } from '@/lib/dbHelper.js';

export async function POST(request) {
  try {
    const report = await request.json();

    for (const name of Object.keys(report)) {
      try {
        const reportItem = report[name]; // is array format

        // insert to DB 
        await dbHelper.insert('reports', { 
          name: name,
          report: JSON.stringify(reportItem),
          create_date: new Date().toISOString()
        });
      } catch (err) {
        console.error(`❌ Failed to insert report for ${name}:`, err);
        // You may choose to handle the error, break, or continue based on your use case
        // For now, let's continue with next report
      }
    }
    
    return Response.json(
      { message: 'Import reports successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}