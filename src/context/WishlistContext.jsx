import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'fashion-store:wishlist'

function readInitialWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * WishlistProvider — يدير قائمة المفضلة (نسخة مختصرة من بيانات كل
 * منتج تكفي لعرضه في صفحة /wishlist بدون إعادة الطلب من الخادم)،
 * محفوظة في localStorage.
 *
 * TODO(PHASE 7/9): عند تسجيل الدخول، يمكن مزامنة هذه القائمة مع
 * جدول `wishlist`/`wishlist_items` في Supabase بدل الاعتماد فقط على
 * التخزين المحلي.
 */
export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readInitialWishlist)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // تجاهل أخطاء التخزين
    }
  }, [items])

  function isInWishlist(productId) {
    return items.some((i) => i.id === productId)
  }

  function toggleItem(product) {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) {
        return prev.filter((i) => i.id !== product.id)
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0] ?? product.image,
          price: product.price,
          oldPrice: product.oldPrice ?? null,
          category: product.category,
          inStock: product.inStock,
        },
      ]
    })
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }

  const value = useMemo(
    () => ({ items, count: items.length, isInWishlist, toggleItem, removeItem }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
