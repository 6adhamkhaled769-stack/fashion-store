import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultStoreConfig } from '@/lib/defaultStoreConfig'

const StoreConfigContext = createContext(defaultStoreConfig)

/**
 * StoreConfigProvider
 *
 * المصدر الوحيد لبيانات هوية المتجر (الاسم، الشعار، الألوان، بيانات
 * التواصل...) في كامل التطبيق. حاليًا يقرأ من defaultStoreConfig
 * (بيانات ثابتة محليًا).
 *
 * بدءًا من PHASE 15، سيتم استبدال الـ useState الأولي بجلب فعلي من
 * جدول store_settings في Supabase (عبر services/storeSettingsService)،
 * وهذا هو المكان الوحيد الذي سيحتاج تعديلًا — كل الصفحات والمكوّنات
 * التي تستهلك useStoreConfig() لن تحتاج أي تغيير.
 */
export function StoreConfigProvider({ children }) {
  const [storeConfig] = useState(defaultStoreConfig)

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

  const value = useMemo(() => storeConfig, [storeConfig])

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
