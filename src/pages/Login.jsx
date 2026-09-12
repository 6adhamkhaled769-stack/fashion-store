import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const inputClass =
  'h-11 w-full rounded-[3px] border border-[var(--color-border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--color-secondary)]'

/**
 * Login — صفحة تسجيل الدخول (PHASE 7، الجزء 1/2).
 * تعتمد على AuthContext التجريبي المحلي حاليًا (سيُستبدل بـ Supabase
 * Auth في PHASE 8 دون أي تعديل على هذه الصفحة).
 */
export default function Login() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    try {
      await login({ email: form.get('email'), password: form.get('password') })
      toast.success('تم تسجيل الدخول بنجاح')
      navigate(location.state?.from ?? '/profile', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Container className="flex justify-center py-14 sm:py-20">
      <div className="w-full max-w-sm">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold">تسجيل الدخول</h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          سجّلي دخولك لمتابعة طلباتك ومفضلتك.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">البريد الإلكتروني</label>
            <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">كلمة المرور</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className={inputClass} />
          </div>

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            تسجيل الدخول
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            نسيت كلمة المرور؟
          </Link>
          <Link to="/register" className="font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)]">
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </Container>
  )
}
