import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/lib/db';

// --- ฟังก์ชันส่ง Line Notify ---
async function sendLineNotify(message: string) {
  const token = process.env.LINE_TOKEN; // ใส่ใน .env
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
    // 1. ความปลอดภัย: เช็ค Secret Key (สำหรับ Cron Job บน Vercel)
    // ถ้าคุณจะทดสอบ "กดมือ" ให้คอมเมนต์ 3 บรรทัดข้างล่างนี้ออกก่อนครับ
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

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
        const price = parseFloat($(col).text().trim());
        const brand = brands[index];
        if (brand && oilName && !isNaN(price)) {
          scrapedData.push({ brand, name: oilName, price });
        }
      });
    });

    // 2. บันทึกลง Database
    for (const item of scrapedData) {
      await db.oilPrice.upsert({
        where: { brand_name: { brand: item.brand, name: item.name } },
        update: { price: item.price },
        create: { brand: item.brand, name: item.name, price: item.price }
      });
    }

    // 3. ✨ ส่งสรุปราคาเข้า Line (เลือกตัวที่ยอดนิยมมาโชว์)
    const highlight = scrapedData.filter(o => o.name === 'แก๊สโซฮอล์ 95').sort((a,b) => a.price - b.price)[0];
    let lineMsg = `\n⛽ อัปเดตราคาน้ำมันสำเร็จ!\n📅 วันที่: ${new Date().toLocaleDateString('th-TH')}\n`;
    if (highlight) {
      lineMsg += `\n🎯 แนะนำวันนี้:\n${highlight.name} ที่ถูกที่สุดคือปั๊ม [${highlight.brand}] ราคา ${highlight.price} บาท`;
    }
    lineMsg += `\n\nเช็คราคาครบทุกปั๊มได้ที่: ${process.env.NEXT_PUBLIC_SITE_URL}`;

    await sendLineNotify(lineMsg);

    return NextResponse.json({ success: true, count: scrapedData.length });

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown Error";
    await sendLineNotify(`❌ ระบบดึงข้อมูลผิดพลาด: ${msg}`);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}