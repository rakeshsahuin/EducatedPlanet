import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Test route hit successfully');
  return NextResponse.json({ message: 'Test route working', timestamp: new Date().toISOString() });
}