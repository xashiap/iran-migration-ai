import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "کوچ‌یار هوشمند | نقشه راه جامع مهاجرت از ایران با هوش مصنوعی",
  description: "سامانه ارزیابی هوشمند پرونده مهاجرتی شهروندان مقیم ایران با هوش مصنوعی، تحلیل موانع اختصاصی (نظام وظیفه، سجاد، تمکن، وقت سفارت) و ارائه رودمپ گام‌به‌گام از نقطه صفر تا پرواز.",
  keywords: ["مهاجرت از ایران", "هوش مصنوعی مهاجرت", "کارت شانس آلمان", "بورسیه استانی ایتالیا", "اکسپرس اینتری کانادا", "سامانه سجاد", "نظام وظیفه مهاجرت"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
