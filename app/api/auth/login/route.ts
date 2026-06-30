import { NextResponse } from 'next/server';export async function POST(){return NextResponse.json({success:true,data:{id:'demo-user',email:'demo@ecalculator.local',role:'user'}})}
