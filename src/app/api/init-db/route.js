import { NextResponse } from 'next/server';
import { openDB } from '../../../lib/db.js';

export async function POST() {
  try {
    const db = await openDB();
    
    // Check and only create "reports" table if not exists
    const reportsTable = await db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='reports';`
    );
    
    let reportsCreated = false;
    if (!reportsTable) {
      await db.exec(`
        CREATE TABLE reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          report TEXT NOT NULL,
          create_date TEXT NOT NULL
        )
      `);
      reportsCreated = true;
    }

    // Check and only create "sourceStandard" table if not exists
    const sourceStandardTable = await db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='sourceStandard';`
    );
    
    let sourceStandardCreated = false;
    if (!sourceStandardTable) {
      await db.exec(`
        CREATE TABLE sourceStandard (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          content TEXT NOT NULL,
          create_date TEXT NOT NULL
        )
      `);
      sourceStandardCreated = true;
    }

    await db.close();

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      details: {
        reportsTable: reportsCreated ? 'created' : 'already exists',
        sourceStandardTable: sourceStandardCreated ? 'created' : 'already exists'
      }
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to initialize database',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await openDB();
    
    // Check if tables exist
    const reportsTable = await db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='reports';`
    );
    
    const sourceStandardTable = await db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='sourceStandard';`
    );

    await db.close();

    return NextResponse.json({
      success: true,
      initialized: !!(reportsTable && sourceStandardTable),
      tables: {
        reports: !!reportsTable,
        sourceStandard: !!sourceStandardTable
      }
    });

  } catch (error) {
    console.error('Database status check error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check database status',
        error: error.message
      },
      { status: 500 }
    );
  }
}
