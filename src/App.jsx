import { Routes, Route } from 'react-router-dom'

import StorefrontLayout from '@/layouts/StorefrontLayout'
import AdminLayout from '@/layouts/AdminLayout'

import Home from '@/pages/Home'
import Products from '@/pages/Products'
import ProductDetails from '@/pages/ProductDetails'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import Profile from '@/pages/Profile'
import Orders from '@/pages/Orders'
import Wishlist from '@/pages/Wishlist'
import NotFound from '@/pages/NotFound'

import AdminLogin from '@/pages/admin/AdminLogin'
import AdminOverview from '@/pages/admin/AdminOverview'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminCategories from '@/pages/admin/AdminCategories'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminCustomers from '@/pages/admin/AdminCustomers'
import AdminCoupons from '@/pages/admin/AdminCoupons'
import AdminSettings from '@/pages/admin/AdminSettings'

/**
 * شجرة الراوتس الكاملة للمشروع.
 *
 * ملاحظات مهمة:
 * - حماية راوتس /admin (Admin-only) سيتم تفعيلها فعليًا في PHASE 11
 *   بعد بناء نظام المصادقة والصلاحيات في PHASE 7 و PHASE 8.
 * - حماية راوتس المستخدم المسجّل (Profile / Orders / Wishlist)
 *   سيتم تفعيلها في PHASE 7.
 * - في هذه المرحلة (PHASE 1) الهدف فقط هو التأكد أن كل الروابط
 *   تعمل وتؤدي إلى الصفحة الصحيحة.
 */
function App() {
  return (
    <Routes>
      {/* Storefront */}
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}

export default App
