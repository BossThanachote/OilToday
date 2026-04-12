# ⛽ OilToday - LINE Bot เช็คราคาน้ำมันรายวัน

OilToday! บอทผู้ช่วยส่วนตัวบนแอปพลิเคชัน LINE ที่จะทำให้การเช็คราคาน้ำมันเป็นเรื่องง่ายและรวดเร็ว ไม่ต้องเข้าเว็บให้ยุ่งยาก เพียงแค่กดเมนู ระบบจะดึงข้อมูลราคาน้ำมันล่าสุดเปรียบเทียบแต่ละปั๊ม มาแสดงผลในรูปแบบการ์ดที่สวยงามและอ่านง่าย ตอบโจทย์คนใช้รถที่ต้องการความรวดเร็ว!

## 📱 ลองใช้งานเลย (Add Friend)
**LINE ID:** `@607wwcyz`

<img src="./qr-code.png" alt="OilToday QR Code" width="200" />

*(สแกน QR Code หรือค้นหาด้วย ID เพื่อเริ่มต้นใช้งานได้ทันที!)*

---

## ✨ Features

- **Automated Flex Message:** เปลี่ยนข้อความธรรมดาให้เป็นการ์ดราคาน้ำมันสุดเท่ (Flex Message) แสดงผลชัดเจน เรียงลำดับราคาจากถูกไปแพงให้ดูเปรียบเทียบได้ง่ายๆ
- **Interactive Rich Menu:** เมนูลัดด้านล่างหน้าจอแชทสุดมินิมอล (สไตล์แอปขุนทอง) ผู้ใช้สามารถกด "เช็คราคาน้ำมัน", "เปิดเว็บไซต์" หรือ "ติดต่อผู้พัฒนา" ได้ทันทีโดยไม่ต้องพิมพ์คำสั่ง
- **Real-time Database Query:** เชื่อมต่อกับฐานข้อมูล Supabase เพื่อดึงข้อมูลราคาที่อัปเดตล่าสุดมาตอบกลับผู้ใช้แบบ Real-time ผ่าน Webhook
- **Seamless Web Integration:** มีปุ่มลิงก์เชื่อมต่อไปยัง Web Dashboard หลัก เพื่อดูข้อมูลปั๊มน้ำมันและราคาแบบเจาะลึกครบทุกชนิด
- **Zero-Cost Architecture:** ออกแบบระบบให้ใช้ Reply Token ของ LINE ร่วมกับ Serverless API ทำให้ส่งข้อความตอบกลับได้ฟรี 100% ไม่มีลิมิต

## 🛠 Tech Stack

### ฝั่งหน้าเว็บ & API (Frontend / Webhook)
- **Next.js (App Router):** เฟรมเวิร์คหลักสำหรับการสร้างหน้าเว็บและสร้าง API Routes (Webhook) เพื่อรับส่งข้อมูลกับ LINE
- **TypeScript:** เพื่อการเขียนโค้ดที่รัดกุม ป้องกันข้อผิดพลาด และจัดการ Type ของข้อมูลราคาน้ำมัน
- **Tailwind CSS:** จัดการสไตล์ของหน้าเว็บ Dashboard ให้สวยงามและ Responsive

### ฝั่งเซิร์ฟเวอร์ & ฐานข้อมูล (Backend / Integration)
- **Supabase:** บริการ Backend-as-a-Service สำหรับเก็บข้อมูล
  - **PostgreSQL Database:** จัดเก็บข้อมูลราคาน้ำมันแยกตามปั๊มและประเภทน้ำมัน
- **LINE Messaging API:** หัวใจหลักของการทำงาน
  - **Webhook:** คอยรับ Events ว่าผู้ใช้พิมพ์อะไรเข้ามาหรือกดปุ่มไหน
  - **Reply API:** ส่งการ์ดข้อความ (Flex Message) กลับไปหาผู้ใช้
- **Vercel:** แพลตฟอร์มสำหรับ Deploy ตัวแอปพลิเคชันและรัน Serverless Function แบบ 24/7

## 💻 พัฒนาโดยใช้ภาษา
<br />
<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=html,css,ts" alt="My Skills" />
</a>
<br />
<br />

## 🎨 Framework & Styling
<br />
<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind" alt="My Skills" />
</a>
<br />
<br />

## ⚙️ Backend, Database & Integration
<br />
<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=supabase,postgres,vercel" alt="My Skills" />
</a>
<hr>

*🔗 Link to website* : https://oil-today-kj3e.vercel.app/
