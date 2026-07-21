import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    crmStore.simulateWebhook('GoHighLevel', payload);
    return NextResponse.json({ success: true, message: 'GoHighLevel webhook processed.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
