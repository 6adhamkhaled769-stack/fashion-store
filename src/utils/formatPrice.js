/**
 * formatPrice — ينسّق رقم السعر مع رمز العملة القادم من إعدادات المتجر
 * (currency في store_settings)، حتى يعمل المشروع بأي عملة لأي عميل
 * دون تعديل الكود (جنيه، ريال، دولار...).
 */
export function formatPrice(amount, currency = '') {
  if (amount === null || amount === undefined) return ''
  const formatted = new Intl.NumberFormat('ar-EG', {
    maximumFractionDigits: 0,
  }).format(amount)
  return currency ? `${formatted} ${currency}` : formatted
}
