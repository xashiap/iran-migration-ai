import { NextRequest, NextResponse } from 'next/server';
import { UserProfile } from '@/types/migration';
import { evaluateImmigrationProfile } from '@/lib/scoringEngine';
import { generateGeminiInsights } from '@/lib/geminiAI';
import { saveApplicant } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: UserProfile = body.profile;
    const customApiKey: string | undefined = body.apiKey;

    if (!profile || !profile.personal || !profile.education || !profile.work) {
      return NextResponse.json(
        { error: 'اطلاعات ارسالی متقاضی ناقص است. لطفاً فرم را کامل کنید.' },
        { status: 400 }
      );
    }

    // ۱. ارزیابی الگوریتمی و حقوقی مهاجرت
    const analysisResult = evaluateImmigrationProfile(profile);

    // ۲. تحلیل تکمیلی عمیق هوش مصنوعی
    const aiInsights = await generateGeminiInsights(profile, analysisResult, customApiKey);
    analysisResult.aiGeneratedAdvice = aiInsights;

    // ۳. ثبت پرونده در بانک داده جامعه آماری
    try {
      saveApplicant(profile, analysisResult);
    } catch (dbErr) {
      console.warn('Failed to persist applicant record:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'خطایی در پردازش پرونده مهاجرتی رخ داد. لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}
