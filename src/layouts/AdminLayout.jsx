import { Outlet } from 'react-router-dom'

/**
 * التخطيط العام للوحة التحكم (Admin).
 * الحماية الفعلية (Admin-only) والـ Sidebar الكامل سيُبنيان في PHASE 11.
 */
export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)] text-[var(--color-text)]">
      <aside className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg)] p-4">
        <p className="text-sm text-[var(--color-text-muted)]">Admin sidebar placeholder</p>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
