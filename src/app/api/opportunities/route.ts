import { NextRequest, NextResponse } from 'next/server';
import { GLOBAL_OPPORTUNITIES_DATABASE } from '@/data/globalOpportunities';
import { WorldRegion, OpportunityType } from '@/types/migration';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const region = (searchParams.get('region') || 'all') as WorldRegion;
    const type = (searchParams.get('type') || 'all') as OpportunityType;
    const search = searchParams.get('search') || '';
    const hotOnly = searchParams.get('hot') === 'true';

    let list = [...GLOBAL_OPPORTUNITIES_DATABASE];

    if (region !== 'all') {
      list = list.filter((item) => item.region === region);
    }

    if (type !== 'all') {
      list = list.filter((item) => item.type === type);
    }

    if (hotOnly) {
      list = list.filter((item) => item.isHot);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          (item.city && item.city.toLowerCase().includes(q)) ||
          item.institutionOrCompany.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // آمار منطقه‌ای برای نمایش تب‌ها
    const regionalCounts = {
      all: GLOBAL_OPPORTUNITIES_DATABASE.length,
      americas: GLOBAL_OPPORTUNITIES_DATABASE.filter((i) => i.region === 'americas').length,
      gulf: GLOBAL_OPPORTUNITIES_DATABASE.filter((i) => i.region === 'gulf').length,
      asia_turkey: GLOBAL_OPPORTUNITIES_DATABASE.filter((i) => i.region === 'asia_turkey').length,
      europe: GLOBAL_OPPORTUNITIES_DATABASE.filter((i) => i.region === 'europe').length,
    };

    return NextResponse.json({
      success: true,
      total: list.length,
      regionalCounts,
      opportunities: list,
      lastUpdated: new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date()),
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در بارگذاری فرصت‌های مهاجرتی' },
      { status: 500 }
    );
  }
}
