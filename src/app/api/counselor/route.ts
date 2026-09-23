import { NextRequest, NextResponse } from 'next/server';
import { UserProfile } from '@/types/migration';

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, question, history = [], apiKey: customApiKey } = body as {
      profile: UserProfile;
      question: string;
      history?: ChatMessage[];
      apiKey?: string;
    };

    if (!question || !question.trim()) {
      return NextResponse.json({ error: 'متن سوال الزامی است.' }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    const systemContext = `
شما «مستشار ارشد هوش مصنوعی کوچ‌یار (IraMigrate AI Counselor)» هستید؛ یک مشاور حقوقی و استراتژیست مهاجرت بسیار کارکشته و مسلط به قوانین روز مهاجرتی شهروندان مقیم ایران (سال ۲۰۲۶).
شما پرونده کامل این متقاضی را در اختیار دارید:
- مشخصات فردی: ${profile.personal?.age || 26} ساله، جنسیت: ${profile.personal?.gender === 'female' ? 'خانم' : 'آقا'}، وضعیت تاهل: ${profile.personal?.maritalStatus}
- وضعیت خدمت نظام وظیفه (برای آقایان): ${profile.personal?.militaryStatus}
- سابقه تحصیلی: مدرک ${profile.education?.degree} در رشته «${profile.education?.field || 'نامشخص'}» از دانشگاه ${profile.education?.universityType} (معدل: ${profile.education?.gpa})
- وضعیت دانشنامه و سامانه سجاد: ${profile.education?.isDegreeReleased ? 'آزاد شده و قابل ترجمه رسمی' : 'در گرو آموزش رایگان و نیازمند لغو تعهد سجاد'}
- سوابق شغلی: ${profile.work?.yearsExperience || 0} سال در عنوان «${profile.work?.jobTitle || 'تخصصی'}» (بیمه تامین اجتماعی: ${profile.work?.hasOfficialInsurance ? `دارد - ${profile.work?.insuranceYears} سال` : 'فاقد سابقه بیمه'})
- زبان‌ها: انگلیسی سطح ${profile.languages?.englishLevel}، آلمانی ${profile.languages?.germanLevel}، فرانسه ${profile.languages?.frenchLevel}
- سرمایه نقدی دلاری: ${profile.finances?.liquidBudgetUSD || 0} دلار (امکان تمکن ریالی: ${profile.finances?.canProvideBankStatement ? 'دارد' : 'ندارد'})
- هدف اصلی: ${profile.preferences?.primaryGoal} (کشورهای مورد علاقه: ${(profile.preferences?.preferredCountries || []).join('، ')})

قوانین و لحن پاسخ‌دهی شما:
۱. پاسخ کوتاه، صریح، کاملاً مستند و دلسوزانه باشد (حداکثر ۳ الی ۴ پاراگراف کوتاه با بولت‌پوینت).
۲. دقیقاً به سوال کاربر و ارتباط آن با شرایط پرونده او پاسخ دهید.
۳. در صورت وجود چالش (مثل نظام وظیفه، تمکن، گپ تحصیلی یا آزادسازی مدرک)، راهکار عملی، میان‌بر قانونی و تکنیک‌های مصاحبه سفارت را بگویید.
۴. لحن حرفه‌ای و پرانرژی داشته باشید و از کلی‌گویی و انشاهای طولانی بپرهیزید.
`;

    if (apiKey) {
      try {
        // ساخت کانتنت برای Gemini
        const contents = [
          {
            role: 'user',
            parts: [{ text: systemContext + '\n\nسلام. من متقاضی این پرونده هستم. لطفاً به سوالات من دقیق پاسخ دهید.' }]
          },
          {
            role: 'model',
            parts: [{ text: 'سلام و درود! پرونده و مشخصات شما را دقیق بررسی کرده‌ام. هر سوالی در خصوص مسیر مهاجرتی، سفارت، تمکن، مدارک و مراحل دارید در خدمتم.' }]
          }
        ];

        // اضافه کردن تاریخچه گفتگو (حداکثر ۴ پیام قبلی)
        const recentHistory = history.slice(-4);
        for (const msg of recentHistory) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }

        // اضافه کردن سوال فعلی
        contents.push({
          role: 'user',
          parts: [{ text: question }]
        });

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 800,
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ success: true, reply: replyText });
          }
        }
      } catch (err) {
        console.warn('Counselor Gemini call failed:', err);
      }
    }

    // پاسخ هوشمند محلی (Local Fallback) در صورت در دسترس نبودن کلید یا خطای شبکه
    const fallbackReply = generateFallbackReply(question, profile);
    return NextResponse.json({ success: true, reply: fallbackReply });

  } catch (error: unknown) {
    console.error('Error in counselor endpoint:', error);
    return NextResponse.json({ error: 'خطای سرور در پردازش سوال.' }, { status: 500 });
  }
}

function generateFallbackReply(question: string, profile: UserProfile): string {
  const q = question.toLowerCase();

  if (q.includes('همسر') || q.includes('فرزند') || q.includes('همراه') || q.includes('خانواده')) {
    return `در خصوص ویزای همراه (Dependent Visa) برای پرونده شما:\n\n• در مسیرهای کاری (مانند آلمان، جاب‌آفر دبی یا عمان)، به محض دریافت قرارداد رسمی و تاییدیه مسکن، همسر شما حق همراهی و کار تمام‌وقت در کشور مقصد را خواهد داشت.\n• در مسیر تحصیلی کانادا و اروپا، تمکن مالی اضافی (برای همسر حدود ۴ تا ۶ هزار دلار و برای هر فرزند حدود ۳ هزار دلار) در نامه حساب بانکی الزامی است.\n• با توجه به سن و شرایط شما، توصیه می‌کنیم پرونده اصلی ابتدا سابمیت شده و مدارک هویتی همسر ترجمه و همزمان یا با فاصله حداکثر یک ماه اقدام شود.`;
  }

  if (q.includes('تمکن') || q.includes('پول') || q.includes('بانک') || q.includes('هزینه') || q.includes('حساب')) {
    return `تحلیل منابع مالی برای پرونده شما:\n\n• بر اساس بودجه اعلامی (${profile.finances?.liquidBudgetUSD || 0} دلار)، برای کشورهای بدون شهریه مانند ایتالیا (با بورسیه DSU) یا دوره‌های آوسبیلدونگ با حقوق آلمان در نقطه امن قرار دارید.\n• نامه تمکن بانکی در ایران باید به نرخ ارز رسمی مرکز مبادله (ETS) صادر شود. از واریزهای ناگهانی سنگین در ۴۸ ساعت قبل از صدور نامه پرهیز کنید؛ سابقه میانگین مانده ۳ ماهه برای آفیسر مهم است.\n• در صورت کسری بودجه، استفاده از ساپورتر مالی درجه یک (پدر یا مادر با فیش حقوقی یا سند ملکی) کاملاً مورد تایید سفارت است.`;
  }

  if (q.includes('سربازی') || q.includes('نظام وظیفه') || q.includes('معافیت') || q.includes('وثیقه')) {
    if (profile.personal?.gender === 'female') {
      return 'با توجه به اینکه شما خانم هستید، موضوع نظام وظیفه تاثیری در پرونده شما ندارد و دریافت پاسپورت و خروج از کشور صرفاً منوط به مدارک هویتی استاندارد است.';
    }
    return `بررسی وضعیت نظام وظیفه در پرونده شما:\n\n• وضعیت فعلی شما: «${profile.personal?.militaryStatus}». اگر معافیت تحصیلی دارید، خروج از کشور با سپردن وثیقه در سامانه سخا (epolice.ir) و ثبت پذیرش در سجاد میسر است.\n• برای کشورهای اروپایی و کانادا، کارت پایان خدمت باید هوشمند و دارای بارکد اصالت باشد.\n• اگر قصد جاب‌آفر فوری دارید، پیش از امضای قرارداد نهایی باید فرجه قانونی یا معافیت دائم را تثبیت کنید تا دچار ممنوع‌الخروجی نشوید.`;
  }

  if (q.includes('زبان') || q.includes('آیلتس') || q.includes('آلمانی') || q.includes('دولینگو') || q.includes('مدرک')) {
    return `استراتژی زبانی مناسب پرونده شما:\n\n• سطح فعلی شما در انگلیسی: ${profile.languages?.englishLevel} و آلمانی: ${profile.languages?.germanLevel}.\n• برای کشورهای اروپایی، رسیدن به نمره آیلتس ۶.۵ آکادمیک یا دولینگو ۱۰۵ در کمتر از ۴ ماه تلاش پیوسته دست‌یافتنی است.\n• برای آلمان، داشتن مدرک B1 گوته یک امتیاز حیاتی است که هم در جاب‌آفر و هم در تاییدیه کارت شانس اولویت اول را به پرونده شما می‌دهد.`;
  }

  return `با توجه به بررسی موشکافانه سوابق شما در رشته «${profile.education?.field || 'تخصصی'}» و سوابق کاری در عنوان «${profile.work?.jobTitle || 'تخصصی'}»:\n\n• پیشنهاد استراتژیک این است که ابتدا روی سامانه سجاد و دریافت تاییدیه اصالت مدارک تحصیلی متمرکز شوید تا معطلی دارالترجمه نداشته باشید.\n• برای ارتقای شانس جاب‌آفر، رزومه خود را بر اساس فرمت استاندارد کشور مقصد بازنویسی کنید و مهارت‌های کلیدی متناسب با پوزیشن‌های فعال را برجسته نمایید.\n• پرونده شما پتانسیل بالایی دارد و با زمان‌بندی منظم برای وقت‌های سفارت به موفقیت خواهد رسید.`;
}
