import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

/**
 * التخطيط العام لواجهة المتجر (Storefront).
 * Header يحتوي بداخله TopBar (شريط الإعلان + التواصل الاجتماعي).
 */
export default function StorefrontLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
