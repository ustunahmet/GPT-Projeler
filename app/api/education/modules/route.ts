import { NextResponse } from 'next/server';import { modules } from '@/lib/data';export async function GET(){return NextResponse.json({success:true,data:modules})}
