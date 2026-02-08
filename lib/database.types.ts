// Auto-generated types for Supabase tables
// This will be replaced with actual generated types from Supabase CLI

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    description: string
                    price: number
                    image_url: string
                    category: string
                    is_available: boolean
                    is_popular: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['products']['Insert']>
            }
            stores: {
                Row: {
                    id: string
                    name: string
                    address: string
                    distance: string
                    rating: number
                    is_open: boolean
                    closing_time: string
                    busy_level: 'Low' | 'Medium' | 'High'
                    image_url: string
                    has_drive_thru: boolean
                    has_mobile_order: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['stores']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['stores']['Insert']>
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    store_id: string
                    status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Canceled'
                    total: number
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['orders']['Insert']>
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    quantity: number
                    size: 'S' | 'M' | 'L'
                    customizations: string[]
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['order_items']['Insert']>
            }
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    avatar_url: string | null
                    loyalty_points: number
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'loyalty_points'>
                Update: Partial<Database['public']['Tables']['users']['Insert']>
            }
            staff: {
                Row: {
                    id: string
                    store_id: string
                    name: string
                    role: string
                    status: 'Active' | 'Inactive' | 'On Shift'
                    image_url: string
                    shift: string
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['staff']['Insert']>
            }
            inventory: {
                Row: {
                    id: string
                    store_id: string
                    name: string
                    category: string
                    quantity: string
                    percentage: number
                    status: 'Healthy' | 'Low' | 'Critical'
                    image_url: string
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['inventory']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['inventory']['Insert']>
            }
            reviews: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    rating: number
                    review_text: string
                    is_replied: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'is_replied'>
                Update: Partial<Database['public']['Tables']['reviews']['Insert']>
            }
        }
        Views: {}
        Functions: {}
        Enums: {}
    }
}

// Convenience type aliases
export type Product = Database['public']['Tables']['products']['Row']
export type Store = Database['public']['Tables']['stores']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Staff = Database['public']['Tables']['staff']['Row']
export type Inventory = Database['public']['Tables']['inventory']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
