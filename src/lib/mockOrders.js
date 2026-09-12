/**
 * بيانات طلبات تجريبية — مرتبطة بحساب تجريبي واحد فقط
 * (demo@atlas.test) لإظهار كل حالات التصميم. أي حساب حقيقي جديد
 * يبدأ بقائمة طلبات فاضية بشكل صحيح (لسه لم يشترِ أي شيء)، وهيمتلئ
 * فعليًا بعد بناء الـ Checkout في PHASE 10.
 *
 * TODO(PHASE 9/10): يُستبدل بالكامل باستدعاء فعلي لجدول `orders`
 * (وربطه بـ order_items) في Supabase، مفلترًا بـ user_id بدل الإيميل.
 */

export const ORDER_STATUSES = {
  pending: { label: 'قيد الانتظار', tone: 'muted' },
  confirmed: { label: 'مؤكد', tone: 'accent' },
  preparing: { label: 'قيد التحضير', tone: 'accent' },
  shipped: { label: 'تم الشحن', tone: 'dark' },
  delivered: { label: 'تم التسليم', tone: 'success' },
  cancelled: { label: 'ملغي', tone: 'danger' },
}

export const DEMO_ACCOUNT_EMAIL = 'demo@atlas.test'

const mockOrdersByEmail = {
  [DEMO_ACCOUNT_EMAIL]: [
    {
      id: 'ORD-1042',
      date: '2026-09-05',
      status: 'shipped',
      total: 2160,
      items: [
        { name: 'معطف صوف واسع', quantity: 1, price: 2600 },
      ],
    },
    {
      id: 'ORD-1030',
      date: '2026-08-22',
      status: 'delivered',
      total: 1010,
      items: [
        { name: 'بلوزة تريكو مضلعة', quantity: 1, price: 690 },
        { name: 'وشاح حرير مخلوط', quantity: 1, price: 420 },
      ],
    },
    {
      id: 'ORD-1012',
      date: '2026-07-30',
      status: 'cancelled',
      total: 890,
      items: [{ name: 'جينز خصر عالي', quantity: 1, price: 890 }],
    },
  ],
}

export function getMockOrdersForEmail(email) {
  return mockOrdersByEmail[email?.toLowerCase()] ?? []
}
