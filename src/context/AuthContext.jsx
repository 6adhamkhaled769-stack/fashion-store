import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '@/services/authService'

const AuthContext = createContext(null)

/**
 * AuthProvider — مصادقة حقيقية عبر Supabase Auth (PHASE 9C).
 *
 * يميّز بين حالتين مختلفتين للتحميل:
 * - isInitializing: فحص أوّلي لوجود جلسة محفوظة (عند فتح التطبيق/
 *   تحديث الصفحة). طالما true، ProtectedRoute لا يحوّل المستخدم لـ
 *   /login (تجنّبًا لطرد مستخدم مسجَّل فعليًا بسبب فحص غير منتهٍ).
 * - isLoading: أثناء تنفيذ عملية محدّدة (دخول/تسجيل/خروج/حفظ).
 *
 * واجهة useAuth() (login/register/logout/user...) لم تتغيّر عن
 * PHASE 7 التجريبية، فلم تحتج صفحات Login/Register/Profile أي
 * تعديل جوهري في منطقها — فقط AuthContext وProtectedRoute.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    authService.getCurrentSessionUser().then((sessionUser) => {
      if (!cancelled) {
        setUser(sessionUser)
        setIsInitializing(false)
      }
    })

    const subscription = authService.onAuthStateChange((nextUser) => {
      if (!cancelled) setUser(nextUser)
    })

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [])

  async function register({ name, email, phone, password }) {
    setIsLoading(true)
    try {
      const { user: newUser, needsEmailConfirmation } = await authService.signUp({
        name,
        email,
        phone,
        password,
      })
      if (newUser) setUser(newUser)
      return { needsEmailConfirmation }
    } finally {
      setIsLoading(false)
    }
  }

  async function login({ email, password }) {
    setIsLoading(true)
    try {
      const loggedInUser = await authService.signIn({ email, password })
      setUser(loggedInUser)
      return loggedInUser
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    try {
      await authService.signOut()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function requestPasswordReset(email) {
    setIsLoading(true)
    try {
      return await authService.requestPasswordReset(email)
    } finally {
      setIsLoading(false)
    }
  }

  /** تُستخدَم فقط داخل صفحة /reset-password بعد الوصول من رابط البريد. */
  async function setNewPassword(newPassword) {
    setIsLoading(true)
    try {
      await authService.updateUserPassword(newPassword)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateProfile(updates) {
    setIsLoading(true)
    try {
      const saved = await authService.updateProfile(user.id, updates)
      const nextUser = { ...user, ...saved }
      setUser(nextUser)
      return nextUser
    } finally {
      setIsLoading(false)
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading,
      isInitializing,
      login,
      register,
      logout,
      requestPasswordReset,
      setNewPassword,
      updateProfile,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading, isInitializing]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
