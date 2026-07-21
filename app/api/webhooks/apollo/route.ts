import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    crmStore.simulateWebhook('Apollo.io', payload);
    return NextResponse.json({ success: true, message: 'Apollo webhook processed & lead ingested.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
