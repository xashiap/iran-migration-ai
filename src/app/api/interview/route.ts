import { NextRequest, NextResponse } from 'next/server';
import { UserProfile } from '@/types/migration';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { country, questionText, userAnswer, profile, apiKey: customApiKey } = body as {
      country: string;
      questionText: string;
      userAnswer: string;
      profile: UserProfile;
      apiKey?: string;
    };

    if (!userAnswer || !userAnswer.trim()) {
      return NextResponse.json({ error: 'پاسخ متقاضی الزامی است.' }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `
شما یک کنسولار و آفیسر ارشد مصاحبه ویزای سفارت ${country} هستید.
متقاضی یک شهروند ایرانی با مشخصات زیر است:
- سن: ${profile?.personal?.age || 26} سال
- تحصیلات: ${profile?.education?.degree} در رشته ${profile?.education?.field}
- سابقه کار: ${profile?.work?.yearsExperience} سال در زمینه ${profile?.work?.jobTitle}
- تمکن مالی: ${profile?.finances?.liquidBudgetUSD} دلار

سوال مطرح‌شده توسط شما (آفیسر): «${questionText}»
پاسخ داده‌شده توسط متقاضی: «${userAnswer}»

به عنوان آفیسر سفارت، پاسخ متقاضی را با دقت بسیار بالا ارزیابی کنید و خروجی را دقیقاً در قالب فرمت JSON زیر برگردانید (هیچ متن اضافه‌ای قبل یا بعد از JSON نیاورید):
{
  "score": عدد بین ۰ تا ۱۰۰,
  "strengths": ["نکته مثبت ۱ در پاسخ متقاضی", "نکته مثبت ۲"],
  "redFlags": ["اگر در پاسخ جمله مشکوک یا خطر ریجکت ویزا وجود دارد این بخش بنویسید (در غیر این صورت آرایه خالی)"],
  "winningAnswer": "متن پاسخ طلایی و استاندارد پیشنهادی به زبان فارسی که آفیسر را قانع می‌کند"
}
`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 600,
                responseMimeType: 'application/json',
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            return NextResponse.json({ success: true, evaluation: parsed });
          }
        }
      } catch (err) {
        console.warn('Interview Gemini call failed, using fallback:', err);
      }
    }

    // ارزیابی هوشمند محلی
    const evaluation = generateLocalInterviewEvaluation(questionText, userAnswer, country);
    return NextResponse.json({ success: true, evaluation });

  } catch (error: unknown) {
    console.error('Error in interview evaluation endpoint:', error);
    return NextResponse.json({ error: 'خطای سرور در تحلیل مصاحبه.' }, { status: 500 });
  }
}

function generateLocalInterviewEvaluation(question: string, answer: string, country: string) {
  const ans = answer.toLowerCase();
  const strengths: string[] = [];
  const redFlags: string[] = [];
  let score = 75;

  // تحلیل علائم خطر (Red Flags)
  if (ans.includes('هرگز برنمی‌گردم') || ans.includes('دیگه به ایران برنمی‌گردم') || ans.includes('پناهندگی') || ans.includes('فرار')) {
    score -= 40;
    redFlags.push('خطر بسیار شدید ریجکت (بند عدم قصد بازگشت): ابراز صریح عدم تمایل به بازگشت یا کلمات مرتبط با پناهندگی باعث رد فوری ویزا توسط آفیسر می‌شود.');
  }

  if (ans.includes('پول قرض کردم') || ans.includes('حساب صوری') || ans.includes('وام فوری')) {
    score -= 30;
    redFlags.push('خطر عدم اثبات تمکن مالی: آفیسر به منابع تمکن صوری حساس است و باید گردش پایدار را نشان دهید.');
  }

  // تحلیل نقاط قوت
  if (ans.length > 50) {
    score += 10;
    strengths.push('توضیح تفصیلی و با اعتماد به نفس که آمادگی شما را نشان می‌دهد.');
  }

  if (ans.includes('تخصص') || ans.includes('پروژه') || ans.includes('تجربه') || ans.includes('مهارت') || ans.includes('تحصیل')) {
    score += 10;
    strengths.push('اشاره دقیق به سوابق تخصصی و انگیزه آکادمیک/حرفه‌ای متناسب با بازار هدف.');
  }

  if (ans.includes('خانواده') || ans.includes('املاک') || ans.includes('وابستگی') || ans.includes('برگشت')) {
    score += 10;
    strengths.push('تاکید هوشمندانه بر وابستگی‌های عاطفی و اقتصادی در ایران (Social & Economic Ties).');
  }

  score = Math.max(25, Math.min(98, score));

  let winningAnswer = `هدف من از انتخاب ${country}، تطابق بالای سوابق پژوهشی و مهارتی من با استانداردهای بین‌المللی این کشور است. من قصد دارم با تکمیل این دوره و کسب تجارب نوین، شبکه ارتباطی و فنی خود را گسترش دهم و کلیه هزینه‌های من توسط تمکن شخصی و سوابق شفاف پوشش داده شده است.`;

  if (question.includes('بازگشت') || question.includes('قصد') || question.includes('پلن بعد')) {
    winningAnswer = `من در ایران دارای وابستگی‌های عاطفی خانوادگی و سوابق کاری معتبر هستم. هدف من ارتقای سطح تخصصی و کسب رزومه بین‌المللی است تا در آینده به عنوان یک نیروی زبده موقعیت‌های مدیریتی و مشاوره‌ای پروژه‌ها را رهبری کنم.`;
  } else if (question.includes('چرا این کشور') || question.includes('چرا')) {
    winningAnswer = `کشور ${country} به دلیل داشتن اکوسیستم صنعتی و دانشگاهی پیشرو در حوزه تخصصی من، بهترین زیرساخت را برای رشد سریع فراهم می‌کند و برنامه مهاجرتی آن شفاف‌ترین مسیر قانونی را پیش‌روی متقاضی می‌گذارد.`;
  }

  return {
    score,
    strengths: strengths.length > 0 ? strengths : ['اعتماد به نفس مناسب در بیان پاسخ اولیه.'],
    redFlags,
    winningAnswer
  };
}
