import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, Search, Heart, ShoppingBag, User, X } from 'lucide-react'

import { useStoreConfig } from '@/context/StoreConfigContext'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'
import IconButton from '@/components/ui/IconButton'
import TopBar from '@/components/layout/TopBar'
import MobileMenu from '@/components/layout/MobileMenu'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { label: 'الرئيسية', to: '/' },
  { label: 'كل المنتجات', to: '/products' },
  { label: 'وصل حديثًا', to: '/products?sort=newest' },
  { label: 'العروض', to: '/products?tag=sale' },
]

export default function Header() {
  const { name } = useStoreConfig()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()

  const { itemCount: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { isAuthenticated } = useAuth()

  function handleSearchSubmit(e) {
    e.preventDefault()
    const query = new FormData(e.currentTarget).get('q')?.toString().trim()
    setIsSearchOpen(false)
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]">
      <TopBar />

      <Container className="flex h-[72px] items-center justify-between gap-4 py-3">
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="فتح القائمة"
          className="inline-flex size-10 items-center justify-center rounded-full hover:bg-[var(--color-surface)] lg:hidden"
        >
          <Menu className="size-5" strokeWidth={1.6} />
        </button>

        <NavLink to="/" className="shrink-0 lg:mx-0" aria-label={name}>
          <Logo />
        </NavLink>

        {/* بحث سطح المكتب */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden max-w-xs flex-1 items-center gap-2 rounded-[3px] border border-[var(--color-border)] px-3 lg:flex"
        >
          <Search className="size-4 shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.6} />
          <input
            name="q"
            type="search"
            placeholder="ابحثي عن منتج..."
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </form>

        <div className="flex items-center gap-1">
          <IconButton
            icon={Search}
            label="بحث"
            onClick={() => setIsSearchOpen((v) => !v)}
            className="lg:hidden"
          />
          <IconButton as={NavLink} to="/wishlist" icon={Heart} label="المفضلة" count={wishlistCount} />
          <IconButton
            as={NavLink}
            to={isAuthenticated ? '/profile' : '/login'}
            icon={User}
            label={isAuthenticated ? 'حسابي' : 'تسجيل الدخول'}
          />
          <IconButton as={NavLink} to="/cart" icon={ShoppingBag} label="السلة" count={cartCount} />
        </div>
      </Container>

      {/* صف التنقل — يفصل روابط الموقع عن صف العلامة والأيقونات (طابع تحريري) */}
      <nav className="hidden border-t border-[var(--color-border)] lg:block">
        <Container className="flex h-12 items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative py-1 text-sm font-medium text-[var(--color-text)] transition-colors',
                  "after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:origin-center after:scale-x-0 after:bg-[var(--color-secondary)] after:transition-transform after:duration-200 hover:after:scale-x-100",
                  isActive && 'after:scale-x-100'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </Container>
      </nav>

      {/* بحث الموبايل — يظهر كشريط منسدل أسفل الهيدر */}
      {isSearchOpen && (
        <div className="border-t border-[var(--color-border)] p-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-[3px] border border-[var(--color-border)] px-3">
              <Search className="size-4 shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.6} />
              <input
                autoFocus
                name="q"
                type="search"
                placeholder="ابحثي عن منتج..."
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              aria-label="إغلاق البحث"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-[var(--color-surface)]"
            >
              <X className="size-5" />
            </button>
          </form>
        </div>
      )}

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navLinks={NAV_LINKS} />
    </header>
  )
}
