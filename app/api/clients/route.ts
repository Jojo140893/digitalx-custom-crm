import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  const clients = crmStore.getClients();
  return NextResponse.json({ success: true, data: clients });
}
