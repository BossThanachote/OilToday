import type { Metadata } from "next";
import { Sarabun } from "next/font/google"; // 1. นำเข้า Sarabun
import "./globals.css";

// 2. ตั้งค่าฟอนต์ Sarabun (กำหนดน้ำหนักที่ต้องใช้)
const sarabun = Sarabun({ 
  weight: ['400', '700', '800'], // 400 คือปกติ, 700-800 คือตัวหนา
  subsets: ["thai", "latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "OilToday - เช็คราคาน้ำมันวันนี้",
  description: "เปรียบเทียบราคาน้ำมันที่ถูกที่สุด ส่งตรงจาก EPPO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      {/* 3. ใช้ sarabun.className ที่ body เพื่อให้มีผลทั้งหน้าเว็บ */}
      <body className={`${sarabun.className} min-h-full flex flex-col bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}