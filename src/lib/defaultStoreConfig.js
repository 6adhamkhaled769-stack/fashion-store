/**
 * بيانات المتجر الافتراضية — تُستخدم كـ fallback/demo قبل ربط Supabase.
 *
 * هذا الشكل (shape) مطابق تمامًا لما سيُخزَّن لاحقًا في جدول
 * `store_settings` بقاعدة بيانات Supabase (PHASE 8) ويُقرأ فعليًا
 * منها بدءًا من PHASE 15 (Store Settings / Customization).
 *
 * أي مكوّن في المشروع يجب أن يقرأ بيانات المتجر من `useStoreConfig()`
 * فقط، وليس من هذا الملف مباشرة أو بشكل ثابت (hardcoded) — بهذا
 * نضمن أن نفس المشروع قابل للبيع لعميل آخر بمجرد تغيير هذه البيانات
 * (أو لاحقًا صفوف store_settings) دون إعادة كتابة أي component.
 */
export const defaultStoreConfig = {
  name: 'أطلس',
  legalName: 'أطلس للأزياء',
  englishName: 'ATLAS',
  tagline: 'أزياء تُصمَّم لتدوم',
  description:
    'متجر أزياء يقدّم قطعًا يومية بجودة عالية وتفاصيل مدروسة، بعيدًا عن صيحات الموسم العابرة.',

  logoUrl: null, // عند null نعرض شعار نصّي بدل صورة (Logo.jsx)
  faviconUrl: null,

  colors: {
    primary: '#16241d',
    secondary: '#b5652b',
  },

  currency: 'ج.م',
  shippingFee: 60,

  contact: {
    phone: '+201000000000',
    whatsapp: '+201000000000',
    email: 'hello@atlas-store.example',
    address: 'القاهرة، مصر',
  },

  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
  },

  announcement: 'شحن لجميع المحافظات — الدفع عند الاستلام متاح الآن',
}
