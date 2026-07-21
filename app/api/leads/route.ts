import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  const leads = crmStore.getLeads();
  return NextResponse.json({ success: true, data: leads });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = crmStore.addLead(body);
    return NextResponse.json({ success: true, data: lead });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
