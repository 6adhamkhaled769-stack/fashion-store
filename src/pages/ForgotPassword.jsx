import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const inputClass =
  'h-11 w-full rounded-[3px] border border-[var(--color-border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--color-secondary)]'

/**
 * ForgotPassword — استعادة كلمة المرور (PHASE 7، الجزء 1/2).
 * لأسباب أمنية معتادة، نعرض رسالة نجاح موحّدة سواء كان الإيميل
 * مسجّلًا أم لا (بدل الكشف عن ذلك).
 */
export default function ForgotPassword() {
  const { requestPasswordReset, isLoading } = useAuth()
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    await requestPasswordReset(email)
    setSent(true)
  }

  if (sent) {
    return (
      <Container className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <MailCheck className="size-10 text-[var(--color-success)]" strokeWidth={1.4} />
        <p className="font-medium text-[var(--color-text)]">تحقّقي من بريدك الإلكتروني</p>
        <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
          لو الإيميل ده مسجّل عندنا، لازم يوصلك رابط لاستعادة كلمة المرور خلال دقائق.
        </p>
        <Link to="/login" className="mt-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)]">
          الرجوع لتسجيل الدخول
        </Link>
      </Container>
    )
  }

  return (
    <Container className="flex justify-center py-14 sm:py-20">
      <div className="w-full max-w-sm">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold">استعادة كلمة المرور</h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          هنبعتلك رابط لإعادة تعيين كلمة المرور على بريدك الإلكتروني.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            إرسال رابط الاستعادة
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
          <Link to="/login" className="font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)]">
            الرجوع لتسجيل الدخول
          </Link>
        </p>
      </div>
    </Container>
  )
}
