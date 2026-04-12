// import type { Metadata } from "next";
// import { Sarabun } from "next/font/google";
// import "./globals.css";


// const sarabun = Sarabun({ 
//   weight: ['400', '700', '800'], 
//   subsets: ["thai", "latin"],
//   display: 'swap',
// });

// export const metadata: Metadata = {
//   title: "OilToday - เช็คราคาน้ำมันวันนี้",
//   description: "เปรียบเทียบราคาน้ำมันที่ถูกที่สุด ส่งตรงจาก EPPO",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="th" className="h-full antialiased">
//       <body className={`${sarabun.className} min-h-full flex flex-col bg-slate-50`}>
//         {children}
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const prompt = Sarabun({ subsets: ["latin", "thai"], weight: ["300", "400", "500", "700"] });

// โซนตั้งค่า SEO และ Meta Tags ทั้งหมดของเว็บ 🟢
export const metadata: Metadata = {

  title: "OilToday | เช็คราคาน้ำมันวันนี้ อัปเดตล่าสุดทุกปั๊ม รู้ก่อนใคร",
  

  description: "เช็คราคาน้ำมันวันนี้ อัปเดตล่าสุดรวดเร็วที่สุด เปรียบเทียบราคาน้ำมันทุกปั๊ม ปตท, บางจาก, เชลล์ ทั้งเบนซิน ดีเซล แก๊สโซฮอล์ 95 แจ้งเตือนเมื่อน้ำมันขึ้นราคาหรือลดราคา",
  
  // คีย์เวิร์ดสำหรับการค้นหา (SEO)
  keywords: [
    "ราคาน้ำมัน",
    "ราคาน้ำมันวันนี้",
    "เช็คราคาน้ำมัน",
    "อัปเดตราคาน้ำมัน",
    "ราคาน้ำมันพรุ่งนี้",
    "ดีเซลเท่าไหร่",
    "ราคาน้ำมันดีเซล",
    "ราคาน้ำมัน แก๊สโซฮอล์ 95",
    "ราคาน้ำมันเบนซิน",
    "ราคาน้ำมัน ปตท",
    "ราคาน้ำมัน บางจาก",
    "น้ำมันขึ้นราคา",
    "น้ำมันลดราคา",
    "ประเทศไทยน้ำมัน",
    "เปรียบเทียบราคาน้ำมัน",
    "Thailand oil price"
  ],

  // ตั้งค่าเพื่อรองรับคนแชร์เว็บลง LINE หรือ Facebook (Open Graph)
  openGraph: {
    title: "OilToday | เช็คราคาน้ำมันวันนี้",
    description: "เช็คราคาน้ำมันล่าสุด เปรียบเทียบทุกปั๊ม รวดเร็ว แม่นยำ",
    url: "https://oil-today-kj3e.vercel.app/", // เปลี่ยนเป็น URL จริงของบอส
    siteName: "OilToday",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "OilToday - ราคาน้ำมันวันนี้",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "OilToday | เช็คราคาน้ำมันวันนี้",
    description: "เช็คราคาน้ำมันวันนี้ อัปเดตล่าสุดรวดเร็วที่สุด",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={prompt.className}>{children}</body>
    </html>
  );
}