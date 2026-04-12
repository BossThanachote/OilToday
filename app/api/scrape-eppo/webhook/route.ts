import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

// --- ฟังก์ชันสำหรับตอบกลับข้อความ (ใช้ Reply Token ฟรี 100%) ---
async function replyLineMessage(replyToken: string, messages: any[]) {
  const token = process.env.LINE_ACCESS_TOKEN;
  if (!token) return;

  try {
    await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: messages, // ส่ง array ของข้อความไป
      }),
    });
  } catch (err) {
    console.error("LINE Reply Error:", err);
  }
}

// --- ฟังก์ชันหลักที่รับ Webhook จาก LINE ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const events = body.events;

    // ถ้า LINE ส่งมาเช็คสถานะ Webhook เฉยๆ
    if (!events || events.length === 0) {
      return NextResponse.json({ success: true });
    }

    for (const event of events) {
      // เช็คว่าเป็นการส่งข้อความตัวอักษรเข้ามาหรือไม่
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text.trim();
        const replyToken = event.replyToken;

        // 🟢 Logic 1: เมื่อผู้ใช้พิมพ์ว่า "เช็คราคา"
        if (userMessage === 'เช็คราคา') {
          // ดึงข้อมูลจากฐานข้อมูล (ตัวอย่าง: เอาเฉพาะ แก๊สโซฮอล์ 95 มาโชว์เทียบกัน)
          const { data: oilPrices } = await supabaseAdmin
            .from('OilPrice')
            .select('*')
            .eq('name', 'แก๊สโซฮอล์ 95') 
            .order('price', { ascending: true }); // เรียงจากถูกไปแพง

          if (!oilPrices || oilPrices.length === 0) {
            await replyLineMessage(replyToken, [{ type: 'text', text: 'ขออภัยครับ ยังไม่มีข้อมูลราคาน้ำมันในระบบ 😅' }]);
            continue;
          }

          // สร้างรายการปั๊มน้ำมันในรูปแบบ Flex Message
          const priceListContents = oilPrices.map((oil) => ({
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: `⛽ ${oil.brand}`, size: "sm", color: "#555555", flex: 2 },
              { type: "text", text: `${oil.price.toFixed(2)} ฿`, size: "sm", color: "#111111", align: "end", weight: "bold", flex: 1 }
            ]
          }));

          // โครงสร้าง Flex Message สวยๆ
          const flexMessage = {
            type: "flex",
            altText: "ราคาน้ำมันแก๊สโซฮอล์ 95 วันนี้",
            contents: {
              type: "bubble",
              size: "mega",
              header: {
                type: "box",
                layout: "vertical",
                contents: [
                  { type: "text", text: "ราคาน้ำมันวันนี้", weight: "bold", color: "#1DB446", size: "sm" },
                  { type: "text", text: "แก๊สโซฮอล์ 95", weight: "bold", size: "xl", margin: "md" }
                ]
              },
              body: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: priceListContents // ยัดรายการปั๊มน้ำมันที่ดึงมาใส่ตรงนี้
              },
              footer: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "button",
                    style: "link",
                    action: {
                      type: "uri",
                      label: "ดูราคาครบทุกชนิด 🌐",
                      uri: process.env.NEXT_PUBLIC_SITE_URL || "https://oil-today-kj3e.vercel.app/"
                    }
                  }
                ]
              }
            }
          };

          // ส่ง Flex Message กลับไป
          await replyLineMessage(replyToken, [flexMessage]);
        } 
        
        // 🟢 Logic 2: เมื่อผู้ใช้พิมพ์คำว่า "เมนู" หรืออื่นๆ
        else if (userMessage === 'เมนู' || userMessage === 'ช่วยเหลือ') {
          await replyLineMessage(replyToken, [{ 
            type: 'text', 
            text: 'ผมคือ OilToday Bot 🤖\nลองพิมพ์คำว่า "เช็คราคา" เพื่อดูราคาน้ำมันล่าสุดได้เลยครับ!' 
          }]);
        }
        
        // 🟢 Logic 3: พิมพ์อย่างอื่นที่ Bot ไม่รู้จัก
        else {
          await replyLineMessage(replyToken, [{ 
            type: 'text', 
            text: 'ขออภัยครับ ผมยังไม่เข้าใจคำสั่งนี้ ลองพิมพ์ "เช็คราคา" ดูนะครับ ⛽' 
          }]);
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}