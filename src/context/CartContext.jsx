import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'fashion-store:cart'

function readInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function lineKey(item) {
  return [item.productId, item.size ?? '-', item.color?.hex ?? '-'].join('|')
}

/**
 * CartProvider — يدير محتوى سلة التسوق (منتج + مقاس + لون + كمية)
 * ويحفظها في localStorage حتى تبقى موجودة بعد إغلاق المتصفح.
 *
 * كل عنصر في السلة يُميَّز بمفتاح مركّب (منتج+مقاس+لون) — يعني نفس
 * المنتج بمقاسين مختلفين يظهر كسطرين منفصلين في السلة، بما يطابق
 * منطق متاجر الملابس الحقيقية (كل Variant له مخزون مستقل).
 *
 * TODO(PHASE 10): عند بناء الـ Checkout الفعلي، سيُقرأ محتوى هذا
 * الـ Context لإنشاء الطلب (orders/order_items) في Supabase. وإذا
 * سجّل المستخدم دخوله لاحقًا (PHASE 7) يمكن مزامنة السلة مع جدول
 * `cart`/`cart_items` بدل الاعتماد على localStorage فقط.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // تجاهل أخطاء التخزين (وضع تصفح خاص مثلاً)
    }
  }, [items])

  function addItem(product, { size, color, quantity = 1 } = {}) {
    const newLine = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0] ?? product.image,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      size: size ?? null,
      color: color ?? null,
      quantity,
    }
    const key = lineKey(newLine)

    setItems((prev) => {
      const existing = prev.find((i) => lineKey(i) === key)
      if (existing) {
        return prev.map((i) => (lineKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, newLine]
    })
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => lineKey(i) !== key))
  }

  function updateQuantity(key, quantity) {
    if (quantity < 1) return
    setItems((prev) => prev.map((i) => (lineKey(i) === key ? { ...i, quantity } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const value = useMemo(() => {
    const itemsWithKey = items.map((i) => ({ ...i, key: lineKey(i) }))
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const totalSavings = items.reduce(
      (sum, i) => sum + (i.oldPrice ? (i.oldPrice - i.price) * i.quantity : 0),
      0
    )

    return {
      items: itemsWithKey,
      itemCount,
      subtotal,
      totalSavings,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
