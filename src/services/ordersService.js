import { getMockOrdersForEmail } from '@/lib/mockOrders'

const SIMULATED_DELAY_MS = 400

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * getOrdersForUser — طلبات مستخدم معيّن (مرتّبة الأحدث أولًا).
 * TODO(PHASE 9/10): استبدال الجسم باستدعاء فعلي لجدول `orders` في
 * Supabase مفلترًا بـ user_id.
 */
export async function getOrdersForUser(email) {
  await delay(SIMULATED_DELAY_MS)
  return [...getMockOrdersForEmail(email)].sort((a, b) => new Date(b.date) - new Date(a.date))
}
