import { NextResponse } from 'next/server';
import { calculateFullProject } from '@/src/calculation-core';

export async function POST(req: Request) {
  try {
    const input = await req.json();
    const result = calculateFullProject(input);
    return NextResponse.json(result, { status: result.status === 'error' || result.status === 'unsupported' ? 400 : 200 });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'ERR_INVALID_JSON', message: 'Geçerli JSON gönderilmelidir.', details: [] } }, { status: 400 });
  }
}
