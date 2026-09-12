import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

const inputClass =
  'h-11 w-full rounded-[3px] border border-[var(--color-border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--color-secondary)]'

/**
 * ResetPassword — الصفحة التي يصل إليها المستخدم من رابط "استعادة
 * كلمة المرور" في بريده الإلكتروني. Supabase ينشئ جلسة مؤقتة تلقائيًا
 * (recovery session) عند فتح الرابط قبل وصول المستخدم لهذه الصفحة،
 * لذلك نتحقق من وجود جلسة فعلية أولًا قبل عرض نموذج كلمة المرور —
 * وإلا نعرض رسالة "رابط غير صالح" بدل نموذج لن يعمل.
 */
export default function ResetPassword() {
  const { setNewPassword, isLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [checkingLink, setCheckingLink] = useState(true)
  const [hasValidSession, setHasValidSession] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setHasValidSession(!!data.session)
        setCheckingLink(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

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
      await setNewPassword(password)
      toast.success('تم تحديث كلمة المرور بنجاح')
      navigate('/profile', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  if (checkingLink) {
    return <div className="py-24" />
  }

  if (!hasValidSession) {
    return (
      <Container className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="font-medium text-[var(--color-text)]">الرابط غير صالح أو منتهي الصلاحية</p>
        <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
          جرّبي طلب رابط استعادة جديد من صفحة "نسيت كلمة المرور".
        </p>
        <Link to="/forgot-password" className="mt-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)]">
          طلب رابط جديد
        </Link>
      </Container>
    )
  }

  return (
    <Container className="flex justify-center py-14 sm:py-20">
      <div className="w-full max-w-sm">
        <KeyRound className="size-8 text-[var(--color-secondary)]" strokeWidth={1.4} />
        <h1 className="mt-3 font-[var(--font-heading)] text-2xl font-semibold">تعيين كلمة مرور جديدة</h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          اختاري كلمة مرور جديدة لحسابك.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">كلمة المرور الجديدة</label>
            <input id="password" name="password" type="password" required autoComplete="new-password" className={inputClass} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">تأكيد كلمة المرور</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" className={inputClass} />
          </div>

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            حفظ كلمة المرور
          </Button>
        </form>
      </div>
    </Container>
  )
}
