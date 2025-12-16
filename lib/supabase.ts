import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This client automatically handles Cookies, so Middleware can see the session!
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)