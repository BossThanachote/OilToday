import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { supabaseAdmin } from '@/lib/db';

// --- ฟังก์ชันส่ง Line Notify ---
async function sendLineNotify(message: string) {
  const token = process.env.LINE_TOKEN;
  if (!token) return;

  try {
    await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({ message }),
    });
  } catch (err) {
    console.error("Line Notify Error:", err);
  }
}

export async function GET(request: Request) {
  try {
    // 1. ความปลอดภัย: (คอมเมนต์ไว้ก่อนเพื่อกดมือทดสอบ)
    /*
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    */

    const url = 'https://www.eppo.go.th/epposite/templates/eppo_v15_mixed/eppo_oil/eppo_oil_gen_new.php';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store'
    });

    if (!response.ok) throw new Error(`EPPO Server Down: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    const brands = ["PTT", "Bangchak", "Shell", "Caltex", "IRPC", "PT", "Susco", "Pure", "SuscoDealers"];
    const oilNameMap: Record<string, string> = {
      'oil_name1.png': 'เบนซิน 95',
      'oil_name2.png': 'แก๊สโซฮอล์ 95',
      'oil_name3.png': 'แก๊สโซฮอล์ 91',
      'oil_name4.png': 'แก๊สโซฮอล์ E20',
      'oil_name5.png': 'แก๊สโซฮอล์ E85',
      'oil_name6v2.png': 'ดีเซล',
      'oil_name7.png': 'ดีเซล พรีเมียม',
      'oil_name10.png': 'ซูเปอร์พาวเวอร์ แก๊สโซฮอล์ 95',
      'b20.png': 'ดีเซล B20',
    };

    const scrapedData: any[] = [];

    $('.div_oil_price > div[class*="oil_price_colum_name_"]').each((i, row) => {
      const imgSrc = $(row).find('.oil_price_colum_name img').attr('src');
      let oilName = "";
      if (imgSrc) {
        const filename = imgSrc.split('/').pop() || "";
        oilName = oilNameMap[filename] || "";
      }

      const priceColumns = $(row).find('.oil_price_colum');
      priceColumns.each((index, col) => {
        const text = $(col).text().trim();
        const price = parseFloat(text);
        const brand = brands[index];
        
        // เก็บเฉพาะข้อมูลที่มีราคาจริงๆ และมีชื่อน้ำมัน
        if (brand && oilName && !isNaN(price) && price > 0) {
          scrapedData.push({ 
            brand, 
            name: oilName, 
            price,
            updatedAt: new Date().toISOString() // เพิ่มเวลาอัปเดต
          });
        }
      });
    });

    // 2. บันทึกลง Supabase ด้วย upsert (ใช้ supabaseAdmin เพื่อข้าม RLS)
    // หมายเหตุ: ในตาราง OilPrice ต้องตั้งค่า Unique Constraint ที่ column [brand, name] ไว้ด้วยครับ
    const { error: dbError } = await supabaseAdmin
      .from('OilPrice')
      .upsert(scrapedData, { onConflict: 'brand,name' });

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    // 3. ✨ ส่งสรุปราคาเข้า Line
    const gas95 = scrapedData.filter(o => o.name === 'แก๊สโซฮอล์ 95').sort((a,b) => a.price - b.price);
    const highlight = gas95[0];

    let lineMsg = `\n⛽ อัปเดตราคาน้ำมันสำเร็จ!\n📅 วันที่: ${new Date().toLocaleDateString('th-TH')}\n`;
    if (highlight) {
      lineMsg += `\n🎯 แนะนำวันนี้:\n${highlight.name} ถูกสุดคือ [${highlight.brand}] ราคา ${highlight.price} บาท`;
    }
    lineMsg += `\n\nเช็คราคาล่าสุด: ${process.env.NEXT_PUBLIC_SITE_URL || 'บนหน้าเว็บของคุณ'}`;

    await sendLineNotify(lineMsg);

    return NextResponse.json({ 
      success: true, 
      message: "Data updated successfully",
      count: scrapedData.length 
    });

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown Error";
    console.error("Scrape Error:", msg);
    await sendLineNotify(`❌ ระบบดึงข้อมูลผิดพลาด: ${msg}`);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}