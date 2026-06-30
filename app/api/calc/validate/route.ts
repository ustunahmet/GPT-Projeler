import { NextResponse } from 'next/server';
import { validateOnly } from '@/src/calculation-core';

export async function POST(req: Request) {
  try {
    return NextResponse.json(validateOnly(await req.json()));
  } catch {
    return NextResponse.json({ success: false, error: { code: 'ERR_INVALID_JSON', message: 'Geçerli JSON gönderilmelidir.', details: [] } }, { status: 400 });
  }
}
