import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

/**
 * ProtectedRoute — يحمي روابط المستخدم المسجّل (الملف الشخصي،
 * طلباتي...). لو الزائر غير مسجّل دخول، يُحوَّل لـ /login مع حفظ
 * الوجهة الأصلية في location.state.from حتى يرجع لها تلقائيًا بعد
 * تسجيل الدخول بنجاح.
 *
 * ⚠️ مهم: فحص جلسة Supabase عند إقلاع التطبيق غير متزامن (async).
 * طالما isInitializing لا تزال true، لا نحوّل المستخدم لـ /login
 * فورًا — وإلا كان أي مستخدم مسجَّل دخول فعليًا سيُطرَد للحظة عند كل
 * تحديث صفحة (refresh) قبل أن تصل استجابة فحص الجلسة.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-[var(--color-text-muted)]" aria-hidden="true" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
