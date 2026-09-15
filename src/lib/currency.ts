export interface CurrencyData {
  usdRial: number;
  usdToman: number;
  eurRial: number;
  eurToman: number;
  formattedUsdToman: string;
  formattedEurToman: string;
  sourceUrl: string;
  sourceName: string;
  updatedAt: string;
  isFallback?: boolean;
}

export const DEFAULT_CURRENCY: CurrencyData = {
  usdRial: 2313000,
  usdToman: 231300,
  eurRial: 2681300,
  eurToman: 268130,
  formattedUsdToman: '۲۳۱,۳۰۰',
  formattedEurToman: '۲۶۸,۱۳۰',
  sourceUrl: 'https://www.tgju.org/',
  sourceName: 'شبکه اطلاع‌رسانی طلا، سکه و ارز (TGJU)',
  updatedAt: '۱۰:۱۵',
};

/**
 * تبدیل مبالغ عددی دلاری به متن خوانای تومان (میلیون یا میلیارد)
 */
export function convertUsdToTomanText(usdAmount: number, usdTomanRate: number): string {
  if (!usdAmount || usdAmount <= 0) return '۰ تومان';
  const totalToman = Math.round(usdAmount * usdTomanRate);

  if (totalToman >= 1_000_000_000) {
    const milliards = totalToman / 1_000_000_000;
    const roundedMilliards = milliards >= 10 ? milliards.toFixed(1) : milliards.toFixed(2);
    return `حدود ${parseFloat(roundedMilliards).toLocaleString('fa-IR')} میلیارد تومان`;
  } else if (totalToman >= 1_000_000) {
    const millions = Math.round(totalToman / 1_000_000);
    return `حدود ${millions.toLocaleString('fa-IR')} میلیون تومان`;
  } else {
    return `${totalToman.toLocaleString('fa-IR')} تومان`;
  }
}

/**
 * تبدیل مبالغ عددی یورویی به متن خوانای تومان
 */
export function convertEurToTomanText(eurAmount: number, eurTomanRate: number): string {
  if (!eurAmount || eurAmount <= 0) return '۰ تومان';
  const totalToman = Math.round(eurAmount * eurTomanRate);

  if (totalToman >= 1_000_000_000) {
    const milliards = totalToman / 1_000_000_000;
    const roundedMilliards = milliards >= 10 ? milliards.toFixed(1) : milliards.toFixed(2);
    return `حدود ${parseFloat(roundedMilliards).toLocaleString('fa-IR')} میلیارد تومان`;
  } else if (totalToman >= 1_000_000) {
    const millions = Math.round(totalToman / 1_000_000);
    return `حدود ${millions.toLocaleString('fa-IR')} میلیون تومان`;
  } else {
    return `${totalToman.toLocaleString('fa-IR')} تومان`;
  }
}

/**
 * استخراج اعداد دلاری از متن‌های ترکیبی (مانند "14,000 $") و بازگرداندن معادل تومانی
 */
export function formatCostStringWithToman(costStr: string, usdTomanRate: number, eurTomanRate: number): string {
  if (!costStr) return '';

  // اگر یورو است (شامل € یا یورو)
  const isEur = costStr.includes('€') || costStr.includes('یورو');
  const rate = isEur ? eurTomanRate : usdTomanRate;

  // استخراج اولین عدد معتبر از رشته (مثلاً 14,000 یا 13500)
  const numbers = costStr.match(/[\d,]+/g);
  if (!numbers || numbers.length === 0) return costStr;

  // پاک کردن کاما و تبدیل به عدد
  const parsedNum = parseInt(numbers[0].replace(/,/g, ''));
  if (isNaN(parsedNum) || parsedNum <= 0) return costStr;

  const tomanText = isEur 
    ? convertEurToTomanText(parsedNum, rate)
    : convertUsdToTomanText(parsedNum, rate);

  return `${costStr} (${tomanText})`;
}
