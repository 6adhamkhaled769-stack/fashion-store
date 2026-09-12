import { supabase } from '@/lib/supabaseClient'
import { defaultStoreConfig } from '@/lib/defaultStoreConfig'

/**
 * تحويل صف store_settings (أعمدة قاعدة البيانات بصيغة snake_case)
 * إلى شكل storeConfig الذي تتوقعه الواجهة (camelCase، متداخل).
 * هذه الدالة هي المكان الوحيد الذي "يعرف" شكل جدول قاعدة البيانات —
 * باقي المشروع يتعامل فقط مع شكل storeConfig الموحّد.
 */
function mapRowToStoreConfig(row) {
  if (!row) return defaultStoreConfig

  return {
    name: row.store_name || defaultStoreConfig.name,
    legalName: row.legal_name || defaultStoreConfig.legalName,
    englishName: row.english_name || defaultStoreConfig.englishName,
    tagline: row.tagline || defaultStoreConfig.tagline,
    description: row.store_description || defaultStoreConfig.description,

    logoUrl: row.logo_url ?? null,
    faviconUrl: row.favicon_url ?? null,

    colors: {
      primary: row.primary_color || defaultStoreConfig.colors.primary,
      secondary: row.secondary_color || defaultStoreConfig.colors.secondary,
    },

    currency: row.currency || defaultStoreConfig.currency,
    shippingFee: row.shipping_fee ?? defaultStoreConfig.shippingFee,

    contact: {
      phone: row.phone || defaultStoreConfig.contact.phone,
      whatsapp: row.whatsapp || defaultStoreConfig.contact.whatsapp,
      email: row.email || defaultStoreConfig.contact.email,
      address: row.address || defaultStoreConfig.contact.address,
    },

    social: {
      instagram: row.instagram || defaultStoreConfig.social.instagram,
      facebook: row.facebook || defaultStoreConfig.social.facebook,
      tiktok: row.tiktok || defaultStoreConfig.social.tiktok,
    },

    announcement: row.announcement || defaultStoreConfig.announcement,
  }
}

/**
 * getStoreSettings — يجلب صف الإعدادات الوحيد (id=1) من Supabase.
 * عند أي فشل (لا اتصال، الجدول غير موجود بعد، إلخ) يرجع
 * defaultStoreConfig كـ fallback آمن حتى لا ينهار المتجر بالكامل —
 * ويُسجّل تحذيرًا واضحًا في الـ console يشرح السبب.
 */
export async function getStoreSettings() {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (error) {
    console.warn(
      '[storeSettingsService] تعذّر جلب إعدادات المتجر من Supabase، سيتم استخدام القيم الافتراضية. السبب:',
      error.message
    )
    return defaultStoreConfig
  }

  return mapRowToStoreConfig(data)
}
