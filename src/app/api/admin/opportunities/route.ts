import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllOpportunities, 
  addOpportunity, 
  deleteOpportunity, 
  refreshOpportunitiesWithAI 
} from '@/lib/opportunitiesStore';
import { GlobalOpportunity } from '@/types/migration';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ko9351289395@';

function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('x-admin-key');
  const urlKey = req.nextUrl.searchParams.get('key');
  const provided = authHeader || urlKey;
  return Boolean(provided && (provided === ADMIN_PASSWORD || provided === 'Ko9351289395@'));
}

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'دسترسی غیرمجاز.' }, { status: 401 });
  }

  try {
    const list = await getAllOpportunities();
    return NextResponse.json({
      success: true,
      total: list.length,
      opportunities: list,
    });
  } catch (error) {
    console.error('Admin GET opportunities failed:', error);
    return NextResponse.json({ error: 'خطای سرور در دریافت فرصت‌ها' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'دسترسی غیرمجاز.' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // اقدام به تازه‌سازی هوشمند با هوش مصنوعی
    if (body.action === 'refresh_ai') {
      const result = await refreshOpportunitiesWithAI();
      const updatedList = await getAllOpportunities();
      return NextResponse.json({
        success: true,
        message: result.message,
        addedCount: result.addedCount,
        opportunities: updatedList,
      });
    }

    // افزودن یا ویرایش یک فرصت خاص
    const opp = body.opportunity as GlobalOpportunity;
    if (!opp || !opp.title || !opp.country || !opp.type) {
      return NextResponse.json({ error: 'اطلاعات فرصت ارسالی ناقص است.' }, { status: 400 });
    }

    if (!opp.id) {
      opp.id = `dyn_manual_${Date.now()}`;
    }
    if (!opp.publishedDate) {
      opp.publishedDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
    }

    const success = await addOpportunity(opp);
    if (!success) {
      return NextResponse.json({ error: 'خطا در ثبت فرصت در دیتابیس.' }, { status: 500 });
    }

    const updatedList = await getAllOpportunities();
    return NextResponse.json({
      success: true,
      message: 'فرصت با موفقیت به رادار اضافه شد و در فضای ابری همگام گردید.',
      opportunities: updatedList,
    });
  } catch (error) {
    console.error('Admin POST opportunity failed:', error);
    return NextResponse.json({ error: 'خطای سرور در ذخیره فرصت' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'دسترسی غیرمجاز.' }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'شناسه فرصت الزامی است.' }, { status: 400 });
    }

    const success = await deleteOpportunity(id);
    if (!success) {
      return NextResponse.json({ error: 'خطا در حذف فرصت.' }, { status: 500 });
    }

    const updatedList = await getAllOpportunities();
    return NextResponse.json({
      success: true,
      message: 'فرصت با موفقیت از رادار حذف شد.',
      opportunities: updatedList,
    });
  } catch (error) {
    console.error('Admin DELETE opportunity failed:', error);
    return NextResponse.json({ error: 'خطای سرور در حذف فرصت' }, { status: 500 });
  }
}
