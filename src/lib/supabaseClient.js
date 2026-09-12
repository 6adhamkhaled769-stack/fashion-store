import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ⚠️ درس مُستفاد فعليًا: supabase-js يرمي خطأ قاتل (Uncaught Error:
// supabaseUrl is required) لو مرّرنا سلسلة فارغة '' — وليس فقط لو
// كانت undefined. هذا الخطأ يحدث في وقت تحميل الموديول نفسه (قبل أي
// رندر React)، فيؤدي لشاشة بيضاء كاملة بدون أي فرصة لعرض رسالة خطأ
// واضحة للمستخدم. لذلك، عند غياب المتغيرات (مثلًا نسيان ضبطها في
// Vercel > Environment Variables)، نستخدم قيمًا صورية (placeholder)
// صحيحة الصيغة فقط حتى لا ينهار createClient — أي استدعاء API فعلي
// بعدها سيفشل بهدوء ويُعالَج عبر try/catch في كل service (يرجع بيانات
// افتراضية/فارغة بدل رمي استثناء)، فتبقى الواجهة تعمل بدل شاشة بيضاء.
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isConfigured) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL أو VITE_SUPABASE_ANON_KEY غير موجودين. ' +
      'تأكد من ضبطهما في ملف .env محليًا، أو في Vercel > Project Settings > Environment Variables عند النشر، ثم أعد النشر (Redeploy). ' +
      'الموقع سيعمل بالقيم الافتراضية المحلية مؤقتًا بدل الانهيار.'
  )
}

// ملاحظة أمان مهمة:
// نستخدم هنا فقط الـ anon key، وهو مصمم ليكون آمنًا في الـ Frontend.
// Service Role Key لا يجب أبدًا أن يظهر في كود الواجهة، ولن نستخدمه هنا إطلاقًا.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)

// تصدير الحالة حتى تستطيع أي شاشة (مثلًا شريط تنبيه للأدمن) معرفة أن
// الاتصال الحقيقي غير مُهيَّأ بعد، بدل تخمين ذلك من رسائل console فقط.
export const isSupabaseConfigured = isConfigured
