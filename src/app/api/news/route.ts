import { NextRequest, NextResponse } from 'next/server';
import { IMMIGRATION_NEWS_DATABASE } from '@/data/immigrationNews';

export const dynamic = 'force-dynamic';
export const revalidate = 600; // کش ۱۰ دقیقه‌ای

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const category = searchParams.get('category');

    let news = [...IMMIGRATION_NEWS_DATABASE];

    if (country && country !== 'all') {
      news = news.filter((item) => item.country === country);
    }

    if (category && category !== 'all') {
      news = news.filter((item) => item.category === category);
    }

    return NextResponse.json({
      success: true,
      lastUpdatedDate: new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      count: news.length,
      data: news,
    });
  } catch (error: unknown) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت اخبار و بخشنامه‌ها' },
      { status: 500 }
    );
  }
}
