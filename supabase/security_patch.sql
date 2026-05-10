-- ============================================================================
-- brew_Coffee Security Patch: RBAC & RLS Hardening
-- ============================================================================

-- 1. Add Role column to public.users if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='role') THEN
    ALTER TABLE public.users ADD COLUMN role TEXT CHECK (role IN ('admin', 'customer')) DEFAULT 'customer';
  END IF;
END $$;

-- 2. Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Automatic Profile Creation Trigger
-- This ensures every auth.users signup gets a public.users record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.raw_user_meta_data->>'avatar_url',
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger to avoid errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Secure RLS Policies (Dropping broad policies and adding role-based ones)

-- Staff Management
DROP POLICY IF EXISTS "Authenticated users can view staff" ON public.staff;
CREATE POLICY "Admins can manage staff" ON public.staff
  FOR ALL USING (public.is_admin());

-- Inventory Management
DROP POLICY IF EXISTS "Authenticated users can view inventory" ON public.inventory;
CREATE POLICY "Admins can manage inventory" ON public.inventory
  FOR ALL USING (public.is_admin());

-- Order Management (Admins see all, users see own)
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- Campaigns & Notifications
DROP POLICY IF EXISTS "Authenticated users can manage campaigns" ON public.campaigns;
CREATE POLICY "Admins can manage campaigns" ON public.campaigns
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can manage notifications" ON public.notifications;
CREATE POLICY "Admins can manage notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- Product Management
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.is_admin());

-- Review Management (Admins can reply)
DROP POLICY IF EXISTS "Authenticated users can manage review replies" ON public.review_replies;
CREATE POLICY "Admins can manage review replies" ON public.review_replies
  FOR ALL USING (public.is_admin());

-- 5. Seed a Default Admin (Optional: update an existing user to admin)
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@brewcoffee.com';
