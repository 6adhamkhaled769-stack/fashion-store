import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const inputClass =
  'h-11 w-full rounded-[3px] border border-[var(--color-border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--color-secondary)]'

/**
 * Profile — الملف الشخصي (PHASE 7، الجزء 2/2). محمي بـ ProtectedRoute.
 * تعديل الاسم/الهاتف، رابط لطلباتي، وتسجيل الخروج.
 */
export default function Profile() {
  const { user, updateProfile, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? '')

  async function handleSubmit(e) {
    e.preventDefault()
    await updateProfile({ name, phone })
    toast.success('تم حفظ التغييرات')
  }

  function handleLogout() {
    logout()
    toast.success('تم تسجيل الخروج')
    navigate('/')
  }

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-lg">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold sm:text-3xl">الملف الشخصي</h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{user.email}</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">الاسم الكامل</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">رقم الهاتف</label>
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>

          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            حفظ التغييرات
          </Button>
        </form>

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button as={Link} to="/orders" variant="outline" size="md" className="justify-center">
            <Package className="size-4" strokeWidth={1.8} />
            طلباتي
          </Button>
          <Button variant="ghost" size="md" onClick={handleLogout} className="justify-center text-[var(--color-danger)]">
            <LogOut className="size-4" strokeWidth={1.8} />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </Container>
  )
}
