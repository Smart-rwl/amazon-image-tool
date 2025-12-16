import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Create a Supabase client specifically for the server
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 2. Refresh the session (this is required for Supabase auth to work)
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Define your protected logic
  const path = request.nextUrl.pathname

  // LIST OF PUBLIC PAGES (Everyone can see these)
  const isPublicPage = 
    path === '/' || 
    path === '/login' || 
    path === '/signup' || 
    path.startsWith('/auth') || // For email verification links
    path.startsWith('/_next') || // System files
    path.startsWith('/static') || // Images
    path.includes('.'); // Files like .ico, .png

  // 4. Redirect Logic
  
  // A. If user is NOT logged in and tries to access a tool -> Kick them to Login
  if (!user && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // B. (Optional) If user IS logged in and tries to go to Login/Signup -> Send them to Home
  if (user && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  // Run this middleware on all paths except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}