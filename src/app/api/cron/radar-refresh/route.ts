import { NextRequest, NextResponse } from 'next/server';
import { refreshOpportunitiesWithAI } from '@/lib/opportunitiesStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // امکان احراز هویت اختیاری با CRON_SECRET در صورت تعریف در متغیرهای محیطی
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
    }

    const result = await refreshOpportunitiesWithAI();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error('Error in radar cron refresh:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during radar refresh' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
