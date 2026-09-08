import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // لا نرمي خطأ قاتل هنا حتى لا ينهار المشروع في PHASE 1-7
  // قبل ربط Supabase فعليًا، لكن نحذّر بوضوح في الـ console.
  console.warn(
    '[Supabase] VITE_SUPABASE_URL أو VITE_SUPABASE_ANON_KEY غير موجودين في .env — ' +
      'سيتم ربط Supabase فعليًا في PHASE 8/9.'
  )
}

// ملاحظة أمان مهمة:
// نستخدم هنا فقط الـ anon key، وهو مصمم ليكون آمنًا في الـ Frontend.
// Service Role Key لا يجب أبدًا أن يظهر في كود الواجهة، ولن نستخدمه هنا إطلاقًا.
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
