import { NextRequest, NextResponse } from 'next/server';
import { saveConsultationBooking } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, service, preferredTime, notes, telegramId, profile } = body;

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: 'وارد کردن شماره تماس الزامی است.' }, { status: 400 });
    }

    const record = await saveConsultationBooking({
      fullName,
      phone,
      service: service || 'مشاوره تلفنی تخصصی ۴۵ دقیقه‌ای',
      preferredTime,
      notes,
      telegramId,
      profile,
    });

    return NextResponse.json({
      success: true,
      message: 'درخواست مشاوره تخصصی شما با موفقیت ثبت گردید. کارشناسان ما ظرف ۲۴ ساعت آینده جهت هماهنگی تماس خواهند گرفت.',
      recordId: record.id,
    });
  } catch (error: unknown) {
    console.error('Error in consultation booking endpoint:', error);
    return NextResponse.json({ error: 'خطا در ثبت نوبت مشاوره.' }, { status: 500 });
  }
}
