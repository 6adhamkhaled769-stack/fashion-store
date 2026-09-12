import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultStoreConfig } from '@/lib/defaultStoreConfig'
import { getStoreSettings } from '@/services/storeSettingsService'

const StoreConfigContext = createContext({ storeConfig: defaultStoreConfig, isLoading: true })

/**
 * StoreConfigProvider
 *
 * المصدر الوحيد لبيانات هوية المتجر (الاسم، الشعار، الألوان، بيانات
 * التواصل...) في كامل التطبيق. يبدأ بـ defaultStoreConfig فورًا (حتى
 * لا تُعرَض شاشة فارغة أثناء التحميل)، ثم يجلب الإعدادات الحقيقية من
 * جدول store_settings في Supabase ويستبدلها بمجرد وصولها.
 *
 * عند أي خطأ اتصال يبقى المتجر يعمل بالقيم الافتراضية (fallback آمن)
 * بدل الانهيار الكامل — راجع services/storeSettingsService.js.
 */
export function StoreConfigProvider({ children }) {
  const [storeConfig, setStoreConfig] = useState(defaultStoreConfig)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    getStoreSettings().then((config) => {
      if (isMounted) {
        setStoreConfig(config)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  // حقن ألوان المتجر كمتغيرات CSS في وقت التشغيل، حتى تنعكس فورًا
  // على كل مكان يستخدم var(--color-primary) / var(--color-secondary)
  // بدون الحاجة لإعادة بناء (rebuild) المشروع عند تغييرها من لوحة التحكم.
  useEffect(() => {
    const root = document.documentElement
    if (storeConfig.colors?.primary) {
      root.style.setProperty('--color-primary', storeConfig.colors.primary)
    }
    if (storeConfig.colors?.secondary) {
      root.style.setProperty('--color-secondary', storeConfig.colors.secondary)
    }
  }, [storeConfig.colors])

  useEffect(() => {
    if (storeConfig.name) {
      document.title = storeConfig.name
    }
  }, [storeConfig.name])

  const value = useMemo(() => ({ ...storeConfig, isLoading }), [storeConfig, isLoading])

  return (
    <StoreConfigContext.Provider value={value}>
      {children}
    </StoreConfigContext.Provider>
  )
}

export function useStoreConfig() {
  const ctx = useContext(StoreConfigContext)
  if (!ctx) {
    throw new Error('useStoreConfig must be used within a StoreConfigProvider')
  }
  return ctx
}
