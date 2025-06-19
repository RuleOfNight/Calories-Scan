import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const conn = await connectDB();
    return NextResponse.json({ 
      message: "MongoDB Connected Successfully!", 
      dbName: conn.connection.db.databaseName 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: "Failed to connect to MongoDB" }, { status: 500 });
  }
}