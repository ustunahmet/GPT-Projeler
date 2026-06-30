import { NextResponse } from 'next/server';
import { getPartCatalog } from '@/lib/parts';

export async function GET() {
  return NextResponse.json({ success: true, data: getPartCatalog() });
}
