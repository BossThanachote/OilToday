import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ตัวนี้สำหรับดึงข้อมูลโชว์หน้าเว็บ (Public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ตัวนี้สำหรับระบบหลังบ้าน/Scraper (Admin - เขียนข้อมูลได้ทุกอย่าง)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)