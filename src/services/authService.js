import { supabase } from '@/lib/supabaseClient'

/**
 * authService — طبقة وصول حقيقية لـ Supabase Auth + جدول profiles.
 *
 * ملاحظة مهمة: supabase.auth.* يتعامل فقط مع (id, email, user_metadata).
 * الاسم/الهاتف/الصلاحية الفعليين يعيشون في جدول public.profiles (أنشأه
 * trigger تلقائيًا عند التسجيل — PHASE 8)، لذلك كل دالة هنا تدمج بيانات
 * الجلسة مع صف profiles المطابق قبل إرجاع كائن "user" موحّد للواجهة.
 */

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, phone, role')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.warn('[authService] تعذّر جلب بيانات الملف الشخصي:', error.message)
    return null
  }
  return data
}

function composeUser(authUser, profile) {
  if (!authUser) return null
  return {
    id: authUser.id,
    email: authUser.email,
    name: profile?.full_name || authUser.user_metadata?.full_name || '',
    phone: profile?.phone || authUser.user_metadata?.phone || '',
    role: profile?.role || 'customer',
  }
}

/** يترجم رسائل خطأ Supabase الإنجليزية إلى عربية مفهومة للمستخدم. */
function mapAuthError(error) {
  const msg = error?.message || ''
  if (msg.includes('Invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  if (msg.includes('User already registered')) return 'البريد الإلكتروني مستخدم من قبل'
  if (msg.includes('Password should be at least')) return 'كلمة المرور قصيرة جدًا (6 أحرف على الأقل)'
  if (msg.includes('Email not confirmed')) return 'يجب تفعيل الحساب عبر رابط التأكيد المُرسَل لبريدك الإلكتروني أولًا'
  if (msg.includes('Unable to validate email')) return 'صيغة البريد الإلكتروني غير صحيحة'
  if (msg.includes('rate limit')) return 'محاولات كثيرة جدًا، حاولي مرة أخرى بعد قليل'
  return msg || 'حدث خطأ غير متوقع، حاولي مرة أخرى'
}

/** الجلسة الحالية (إن وجدت) مدموجة ببيانات profiles — تُستخدَم عند إقلاع التطبيق. */
export async function getCurrentSessionUser() {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session?.user) return null
  const profile = await fetchProfile(data.session.user.id)
  return composeUser(data.session.user, profile)
}

/**
 * onAuthStateChange — اشتراك في تغيّرات الجلسة (تسجيل دخول/خروج/تجديد
 * توكن/PASSWORD_RECOVERY) من أي تبويب. يُرجع كائن subscription (له
 * .unsubscribe()).
 */
export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      callback(null)
      return
    }
    const profile = await fetchProfile(session.user.id)
    callback(composeUser(session.user, profile))
  })
  return subscription
}

/**
 * signUp — تسجيل حساب جديد. الاسم/الهاتف يُمرَّران كـ user_metadata
 * فيلتقطهما trigger.handle_new_user() تلقائيًا وينشئ صف profiles.
 *
 * ⚠️ إن كان "Confirm email" مفعّلًا في إعدادات Supabase Auth (الوضع
 * الافتراضي)، لن تُنشأ جلسة فورية بعد التسجيل — المستخدم لازم يفعّل
 * حسابه من البريد الإلكتروني أولًا. نُرجع needsEmailConfirmation حتى
 * تتصرف الواجهة بشكل صحيح في الحالتين.
 */
export async function signUp({ name, email, phone, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, phone } },
  })

  if (error) throw new Error(mapAuthError(error))

  const user = data.session
    ? composeUser(data.session.user, { full_name: name, phone, role: 'customer' })
    : null

  return { user, needsEmailConfirmation: !data.session }
}

/** signIn — تسجيل الدخول ببريد/كلمة مرور. */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(mapAuthError(error))

  const profile = await fetchProfile(data.user.id)
  return composeUser(data.user, profile)
}

/** signOut — إنهاء الجلسة الحالية. */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(mapAuthError(error))
}

/**
 * requestPasswordReset — يرسل رابط استعادة كلمة مرور بالبريد.
 * لأسباب أمنية معتادة (عدم كشف وجود/عدم وجود الإيميل)، لا نرمي خطأ
 * أبدًا هنا مهما كانت النتيجة — الواجهة تعرض دائمًا رسالة نجاح موحّدة.
 */
export async function requestPasswordReset(email) {
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { success: true }
}

/** updateUserPassword — تُستخدَم فقط داخل صفحة /reset-password بعد الوصول من رابط البريد. */
export async function updateUserPassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(mapAuthError(error))
}

/** updateProfile — تحديث الاسم/الهاتف في جدول profiles (وليس auth.users). */
export async function updateProfile(userId, { name, phone }) {
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: name, phone })
    .eq('id', userId)

  if (error) throw new Error(mapAuthError(error))
  return { name, phone }
}
