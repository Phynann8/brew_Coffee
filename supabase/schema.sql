-- ============================================================================
-- Brew Coffee Database Schema for Supabase
-- Run this in the Supabase SQL Editor to create the database structure
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS (extends Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- STORES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  distance TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  is_open BOOLEAN DEFAULT true,
  closing_time TEXT,
  busy_level TEXT CHECK (busy_level IN ('Low', 'Medium', 'High')) DEFAULT 'Low',
  image_url TEXT,
  has_drive_thru BOOLEAN DEFAULT false,
  has_mobile_order BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Anyone can read stores
CREATE POLICY "Anyone can view stores" ON public.stores
  FOR SELECT USING (true);

-- ============================================================================
-- PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- ============================================================================
-- ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('Pending', 'Preparing', 'Ready', 'Completed', 'Canceled')) DEFAULT 'Pending',
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  size TEXT CHECK (size IN ('S', 'M', 'L')) DEFAULT 'M',
  customizations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items of their orders
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================================================
-- STAFF
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive', 'On Shift')) DEFAULT 'Active',
  image_url TEXT,
  shift TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view staff (admin feature)
CREATE POLICY "Authenticated users can view staff" ON public.staff
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- INVENTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  quantity TEXT,
  percentage INTEGER DEFAULT 100,
  status TEXT CHECK (status IN ('Healthy', 'Low', 'Critical')) DEFAULT 'Healthy',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view inventory
CREATE POLICY "Authenticated users can view inventory" ON public.inventory
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_replied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- REVIEW REPLIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.review_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE UNIQUE,
  reply_text TEXT NOT NULL,
  replied_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage review replies" ON public.review_replies
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- CAMPAIGNS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  offer_type TEXT CHECK (offer_type IN ('percent', 'fixed', 'bogo')) NOT NULL,
  discount_value DECIMAL(10,2) DEFAULT 0,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  target_audience TEXT NOT NULL DEFAULT 'all',
  status TEXT CHECK (status IN ('Draft', 'Active', 'Ended')) DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage campaigns" ON public.campaigns
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audience TEXT CHECK (audience IN ('all', 'loyal', 'inactive', 'new')) NOT NULL,
  delivery TEXT CHECK (delivery IN ('now', 'scheduled')) NOT NULL DEFAULT 'now',
  status TEXT CHECK (status IN ('Draft', 'Scheduled', 'Sent')) NOT NULL DEFAULT 'Draft',
  target_count INTEGER DEFAULT 0,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage notifications" ON public.notifications
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Seed Stores
INSERT INTO public.stores (name, address, distance, rating, is_open, closing_time, busy_level, image_url, has_drive_thru, has_mobile_order) VALUES
  ('Main St. Roastery', '123 Main Street', '0.2 mi', 4.8, true, '8 PM', 'Low', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtDAEcyfatQ7iPe46ayn6DS2PggttECS3Bv-wKFC1WGx09YXvFfba-9BIaClQ2-PzIct9rsSEUrJ_exa_nTVz2fwLeMOTdssucxInOQEQ_AwYs3YJR3IoBbDwb_t_2XozH5TF-olrceBhJiPVFB3KpWZu4fI6Z86gR7FmhxvHiVs0AUva4lOEoNm2o4rBERAc14EJ5LwvRPuA5cjCULXnVFQNuOkXlXNl3yyiuwH4HbH0CgfMnKf9aPQtntURsuYpIDe5AbDp6Gcaw', false, true),
  ('Westside Espresso', '450 West Ave', '1.5 mi', 4.2, true, '6 PM', 'High', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmq_Apkc13OKDNXhI-dLLe-d1aNEK7OtIWy8Rfda0HbRVy_Ft5caHTrqilFtilbrKSSFk8HOtdQsCpfHynXtt9rkyvdjZ9L7u-ppQU017YZ3Ll0XVqpSvbtbIWQRgf53o2tq928ez-KFwYkdEkQgfApEMcwFDQixKWWGqQebseXgcGv-IATHbD_nBrkmCJI93RFo_GnyxGG1bdXUUCusdAa0epC9DlNVpUMTgBBvfjDQcku-ng53goCHxZYjxSeSME1FgEwd6RELns', true, true),
  ('Uptown Brews', '88 North Blvd', '2.8 mi', 4.5, false, '6 AM', 'Low', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKoeXiKYYmP9BACIlniH27mjeOHzWQ_p_RjRZLxcaQZXFjaGlLE5LOF53Mh5diEVLuV3jH2VSkkVfwoZiJcCp72LJiFQvwdgS1lgeYAzsTTPltqT0wbIu6XgCPOSIQ-c0kYKno9kwN8v-hoEdGKQ_15vE1BQIraykgq01Rwm9gQjssXPtht3nngOApGNepcQDOhR9jK9RInnkV6MM13ptxaYhohmKqeny2r1nLnuVFSpZbICxpo2R_iHV-4XksBDCgtGzK9s7bLhod', true, false);

-- Seed Products
INSERT INTO public.products (name, description, price, image_url, category, is_popular) VALUES
  ('Cappuccino', 'With oat milk foam', 4.50, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Il1pi_dr6ez1-ng3FvlzDdMGM5znu02WXAQbQJXfHah9_xe_Bguq_IkFJUKq-WxvukXM5DP4ex_-k0tHKkFQUlMKw8ZnyZYCVnmY8mKhVjoxQtnGWEk2Ro9OwHDGsVmfs3ZpuJ658FAfRjl7aFDnzsRuqBeQt9wcvuP_KGaVzAIALHKSADgZPgI3Y6Yb2trRp3PkzaqTOtN4VTV4GOTsvL3ezc49xgWN3NLglSmHVmXNbw5QM0oGnyrLHcKVCVLjQzVOnYPSW4Yj', 'Hot Coffee', true),
  ('Cold Brew', 'Smooth & strong', 5.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf1u5-qOslMDBzyviUWyVFdAs6ZKsq7Kn0RPbRay4ND3Oiz5To23hWr065rCdjO8VgZ0CPTN5SvfgO6wtedCGrKCH1mGJHZiprw89OLBOm0EFZuP485pYZZdK52DE44IbD59_DNc217dihASms6oFNW2KyIk7zAUABWwU0rHbAx8LsRJsaKQMOZN05mabziUVAW6JhPwNU_Fd7KFBURbUfcHcNR6IlnCSLVNw4mH_HTpsRLo4MUFnP7nFPVw4-g55SlfQk6_Vdjwr8', 'Iced Coffee', true),
  ('Pumpkin Spice', 'Limited time only', 6.20, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPhI5q6tz9szzAgSVdQ9aFOilbz5f7UAh9p44SPgXW8AoYd6rOAP6Wjkm56NfHVqff2cw9CG-_2J12wa_xVBT3USKW1gVWOGAtgFneP3OuStPVej1RzCZCsUd_2c_r4TycJ4SZxg2aP-iIgLzN-WwzYnpUVwqoEWPkjJG9dCwUhRqrInnjWjwDnoRpgg36LYp0YHjqedJ852BDqsw4zMBdkTJYhsj9QFgynRdajSTJanUSNf3_MZjEb1aHV7NLOL5jiL1LEWOuH3rF', 'Seasonal', true),
  ('Matcha Latte', 'Ceremonial grade', 5.50, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxCCUcSQ27mtXZtXwvPESa_dxYx_Kj4BUCi1Dlzg66Wxibcsc5ImTq1PNLLm4eBAv8hXMY2J2iNx8oA9gE7qCnSfK_9hcG1YyRrCKLv9SMDiuCgd5rmRVaUO8QVZ8Iy_spgEoyIZuiboD2sqDtsCw-Na34uY_vbKLNKx9apRq36eNTT5iDirm4vRJ56Jqn9fI-v5PkhPDznxOqTs3p55lLaWZ2ReUysGfJjqeb1LZ3NA6rysTcYbhbxbvgyPLSWC6K24HI6_XV8JWp', 'Tea', false),
  ('Choco Croissant', 'Freshly baked', 3.80, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM4SyPvn31ohbyJJCYtKXmqlwN9P3-D307jE6K2LKezVdwRGs-NeJfQ_dKIu80MdUaeGxaujGvMig3xaDyYVd8oBh2EQRb6SA8tYomTuFHUuGans-eDEelrvdFUpk7f1K7F4hGlpdHqGrEHwkI0HIz--qA65SNrSv0cXveCqhJ4mB9Cu0ZM_SmmTZmh2UMLs9z5OuAWVROJFqoJ_25WQLej96fvUYig2AzmsNU3M48LuXmCeaq-ujUaDdYV_xaY49lwjC5FvBpvNFQ', 'Pastries', false),
  ('Espresso', 'Single origin beans', 3.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPIZheoZLOJ4x_dHZ3Rv1NhY1YukNaaSoRuhS46Cx5bHckeff6tDpjT8o328WABCFo6ZihLEaE0FhEcq2IEcyjEpGw7K95XnMK0CHlMI0GTJo0v-AHHziL-eNiOKJLHXwfAVoX6vQL4-lvXrN_pRwYzPPY9rjWIEc8xJQBgYCjaEaokPcF0DXqnxfPOZ9RTQootHaZE1lZSVxwerolUbkcLxLVs4VqlQMUnGysj-WBZke9KMwtw4FyJxIv8Y0EBWW3RTvP7TQ_2wZ_', 'Hot Coffee', false);

-- Output confirmation
SELECT 'Database schema created and seeded successfully!' as message;
