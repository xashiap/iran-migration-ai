import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/db';
import { UserProfile } from '@/types/migration';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: UserProfile = body.profile;

    if (!profile?.personal?.fullName || !profile?.personal?.phone) {
      return NextResponse.json({ error: 'نام و شماره تماس الزامی است' }, { status: 400 });
    }

    const record = await saveLead(profile);

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        fullName: record.fullName,
        phone: record.phone,
        status: record.status,
      }
    });
  } catch (error) {
    console.warn('Error saving lead:', error);
    return NextResponse.json({ success: false, error: 'خطا در ثبت لید' }, { status: 500 });
  }
}
