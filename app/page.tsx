import { supabase } from "@/lib/db";
import OilExplorer from "./components/OilExplorer"; 
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 1. ดึงข้อมูลจาก Supabase โดยตรง (ไม่ผ่าน Prisma แล้ว)
  const { data: oilPrices, error } = await supabase
    .from('OilPrice')
    .select('*')
    .order('updatedAt', { ascending: false });

  // กรณีเกิด Error ในการดึงข้อมูล
  if (error) {
    console.error("Supabase Fetch Error:", error.message);
  }

  const hasData = oilPrices && oilPrices.length > 0;

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-10">

        {/* --- Header Area --- */}
        <header className="mb-12 mt-6 text-center border-b border-slate-100 pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            OilToday <span className="text-blue-600">⛽</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            เปรียบเทียบราคาน้ำมันวันนี้ ทุกปั๊มทั่วไทย หาที่ที่ถูกที่สุดใกล้คุณ ดึงข้อมูลตรงจาก EPPO
          </p>
        </header>

        {/* --- Content Area --- */}
        {!hasData ? (
          // กรณีไม่มีข้อมูล แสดง UI สวยๆ บอกให้ไปดึงข้อมูลก่อน
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm">
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-4xl">
              🛢️
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">ยังไม่มีข้อมูลในฐานข้อมูล</h3>
            <p className="text-slate-500 mb-6">
              ระบบยังไม่ได้ดึงราคาน้ำมันล่าสุดมาแสดงผล
            </p>
            <p className="text-sm text-slate-400 bg-slate-50 p-4 rounded-xl inline-block border border-slate-100">
              กรุณารัน <code className="bg-white px-2 py-1 rounded text-pink-600 font-mono shadow-inner border border-slate-200">/api/scrape-eppo</code> ผ่าน Browser เพื่อดึงข้อมูลก่อนครับ
            </p>
          </div>
        ) : (
          // ✨ กรณีมีข้อมูล ส่งให้ Client Component (OilExplorer) จัดการต่อ
          <OilExplorer initialData={oilPrices} />
        )}

      </div>

      {/* --- Footer Area --- */}
      <footer className="mt-16 mb-8 pt-8 border-t border-slate-200 text-center space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-slate-500 text-sm">
          <p>ข้อมูลราคาน้ำมันขายปลีกในเขตกรุงเทพฯ และปริมณฑล</p>
          <span className="hidden md:inline text-slate-300">|</span>
          <div className="flex items-center gap-1">
            <span>ขอบคุณข้อมูลจาก:</span>
            <a
              href="https://www.eppo.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              สำนักงานนโยบายและแผนพลังงาน (สนพ.)
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl mx-auto italic">
          * ราคาที่แสดงเป็นราคามาตรฐานที่รวบรวมเพื่อการเปรียบเทียบเท่านั้น
          โปรดตรวจสอบความถูกต้องที่หน้าสถานีบริการน้ำมันอีกครั้ง
        </p>
      </footer>
    </main>
  );
}