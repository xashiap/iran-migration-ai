import { UserProfile, AnalysisResult } from '../types/migration';

export async function generateGeminiInsights(
  profile: UserProfile, 
  baseResult: AnalysisResult,
  customApiKey?: string
): Promise<string> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `
شما یک مشاور ارشد و کارشناس مهاجرت بین‌المللی ویژه ایرانیان هستید.
اطلاعات متقاضی ایرانی به شرح زیر است:
- سن: ${profile.personal.age} سال
- وضعیت تاهل: ${profile.personal.maritalStatus}
- وضعیت خدمت نظام وظیفه (آقایان): ${profile.personal.militaryStatus}
- رشته و مقطع تحصیلی: ${profile.education.degree} در رشته ${profile.education.field} (دانشگاه ${profile.education.universityType}، معدل ${profile.education.gpa})
- وضعیت آزادسازی مدرک و سجاد: ${profile.education.isDegreeReleased ? 'آزاد شده' : 'هنوز آزاد نشده / در گرو آموزش رایگان'}
- سابقه کار: ${profile.work.yearsExperience} سال در عنوان «${profile.work.jobTitle}» (بیمه تامین اجتماعی: ${profile.work.hasOfficialInsurance ? 'دارد' : 'ندارد'})
- سطح زبان انگلیسی: ${profile.languages.englishLevel} (آزمون: ${profile.languages.englishExam} نمره: ${profile.languages.englishScore || 'ندارد'})
- زبان‌های دیگر: آلمانی (${profile.languages.germanLevel})، فرانسه (${profile.languages.frenchLevel})
- سرمایه نقدی دلاری: ${profile.finances.liquidBudgetUSD} دلار
- توانایی ارائه تمکن ریالی در ایران: ${profile.finances.canProvideBankStatement ? 'بله' : 'خیر'}
- هدف اصلی: ${profile.preferences.primaryGoal}
- کشور پیشنهادی اول توسط الگوریتم: ${baseResult.topCountries[0]?.countryName} (${baseResult.topCountries[0]?.recommendedPathway})

لطفاً در ۴ الی ۵ بند منسجم، تحلیلی عمیق، شفاف، دلسوزانه و اختصاصی ارائه دهید:
۱. تحلیل اختصاصی وضعیت متقاضی و شانس واقعی در شرایط فعلی.
۲. شاه‌کلید موفقیت پرونده (آن کاری که اگر انجام دهد مسیرش هموار می‌شود).
۳. تله‌ها و ریسک‌های پنهان ویژه شهروندان ایرانی (مثل گپ تحصیلی، گواهی عدم سوءپیشینه، اصالت سوابق بیمه یا تمکن مالی).
۴. استراتژی ۳ ماه اول جهت شروع از نقطه صفر.
متن را با لحنی حرفه‌ای، انگیزه‌بخش و بدون تعارف بنویسید.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1200
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generated) return generated;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to expert system:', err);
    }
  }

  // تحلیل هوشمند محلی بر پایه داده‌های متقاضی
  return generateExpertLocalInsights(profile, baseResult);
}

function generateExpertLocalInsights(profile: UserProfile, baseResult: AnalysisResult): string {
  const top = baseResult.topCountries[0];
  const isMale = profile.personal.gender === 'male';

  const paragraphs: string[] = [];

  // ۱. تحلیل اختصاصی پرونده
  paragraphs.push(
    `بر اساس داده‌های ارزیابی شده، شما با داشتن مدرک ${profile.education.degree === 'master' ? 'کارشناسی ارشد' : 'کارشناسی'} و سابقه فعالیت در زمینه «${profile.work.jobTitle || 'تخصصی'}»، شرایط بسیار مناسبی برای اقدام از طریق ${top?.countryName || 'اروپا'} دارید. نمره انطباق پرونده شما (${top?.matchScore} از ۱۰۰) نشان می‌دهد که اگر مراحل اداری و زبانی را با برنامه جلو ببرید، احتمال ریجکتی پرونده شما در حداقل ممکن خواهد بود.`
  );

  // ۲. شاه‌کلید موفقیت
  if (profile.languages.englishLevel !== 'advanced' && profile.languages.englishLevel !== 'fluent' && profile.languages.germanLevel === 'none') {
    paragraphs.push(
      `🎯 **شاه‌کلید پیشرفت پرونده شما:** در حال حاضر مهم‌ترین اهرم جهش پرونده شما، دریافت یک مدرک زبان استاندارد در حداقل زمان ممکن است. تفاوت بین فردی که صرفاً قصد مهاجرت دارد و کسی که ویزا می‌گیرد، در داشتن مدرک رسمی زبان (آیلتس ۶.۵+ یا آلمانی B1+) نهفته است. اگر روزانه ۲ تا ۳ ساعت مطالعه مستمر اختصاص دهید، طی ۴ تا ۶ ماه به این هدف خواهید رسید.`
    );
  } else {
    paragraphs.push(
      `🎯 **شاه‌کلید پیشرفت پرونده شما:** تسلط به زبان یکی از مهم‌ترین برگ‌های برنده شماست. حال باید تمرکز ۱۰۰ درصدی خود را بر «استانداردسازی رزومه و تطبیق دقیق سوابق کاری» بگذارید. تنظیم رزومه به فرمت استاندارد کشور مقصد و ارتباط مستقیم با شبکه‌های حرفه‌ای در لینکدین، شانس دریافت آفر یا پذیرش شما را دوچندان می‌کند.`
    );
  }

  // ۳. هشدارهای حقوقی و اداری در ایران
  const iranTips: string[] = [];
  if (isMale && profile.personal.militaryStatus === 'completed') {
    iranTips.push('کارت پایان خدمت هوشمند ملی خود را آماده و ترجمه رسمی کنید.');
  }
  if (!profile.education.isDegreeReleased) {
    iranTips.push('فرآیند آزادسازی مدرک از دانشگاه دولتی و ثبت در سامانه سجاد را قبل از هر اقدام هزینه‌بر دیگر آغاز کنید تا در زمان وقت سفارت با بن‌بست کمبود زمان مواجه نشوید.');
  }
  if (profile.work.hasOfficialInsurance) {
    iranTips.push('گواهی سوابق تامین اجتماعی با کد پیگیری و بارکد رسمی یکی از محکم‌ترین اسناد اثبات واقعی بودن اشتغال شما برای اداره مهاجرت خواهد بود.');
  }
  iranTips.push('در خصوص تمکن بانکی، از جابجایی ناگهانی مبالغ درشت و بدون توجیه قبل از صدور نامه تمکن جداً خودداری فرمایید.');

  paragraphs.push(`⚠️ **نکات حیاتی اداری در مبدا ایران:**\n` + iranTips.map(t => `• ${t}`).join('\n'));

  // ۴. استراتژی ۹۰ روز اول
  paragraphs.push(
    `🚀 **استراتژی ۹۰ روز نخست (از همین امروز):**\n` +
    `۱. ماه اول: اقدام برای استعلام و آزادسازی دانشنامه در سامانه سجاد + تعیین وقت آزمون زبان و شروع روتین روزانه.\n` +
    `۲. ماه دوم: تحویل مدارک پایه به دارالترجمه رسمی + ساخت رزومه بین‌المللی با فرمت استاندارد.\n` +
    `۳. ماه سوم: ثبت نام و شرکت در آزمون زبان + بررسی نهایی مدارک مالی و آماده‌سازی جهت آغاز اپلای و ثبت نام در پورتال مربوطه.`
  );

  return paragraphs.join('\n\n');
}
