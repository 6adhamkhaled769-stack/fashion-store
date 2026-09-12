import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const inputClass =
  'h-11 w-full rounded-[3px] border border-[var(--color-border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--color-secondary)]'

/**
 * Register — صفحة إنشاء حساب (PHASE 7، الجزء 1/2).
 */
export default function Register() {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const password = form.get('password')
    const confirmPassword = form.get('confirmPassword')

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }

    try {
      const { needsEmailConfirmation } = await register({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        password,
      })

      if (needsEmailConfirmation) {
        toast.success('تم إنشاء الحساب! تحقّقي من بريدك الإلكتروني لتفعيله ثم سجّلي الدخول.')
        navigate('/login', { replace: true })
      } else {
        toast.success('تم إنشاء الحساب بنجاح')
        navigate('/profile', { replace: true })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Container className="flex justify-center py-14 sm:py-20">
      <div className="w-full max-w-sm">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold">إنشاء حساب</h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          حساب جديد يخليكي تتابعي طلباتك ومفضلتك في أي وقت.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">الاسم الكامل</label>
            <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">البريد الإلكتروني</label>
            <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">رقم الهاتف</label>
            <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">كلمة المرور</label>
            <input id="password" name="password" type="password" required autoComplete="new-password" className={inputClass} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">تأكيد كلمة المرور</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" className={inputClass} />
          </div>

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            إنشاء الحساب
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
          عندك حساب بالفعل؟{' '}
          <Link to="/login" className="font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)]">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </Container>
  )
}
