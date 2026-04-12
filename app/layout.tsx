import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";


const sarabun = Sarabun({ 
  weight: ['400', '700', '800'], 
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
      <body className={`${sarabun.className} min-h-full flex flex-col bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}