import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  // Create a response to modify headers
  const res = NextResponse.next();

  // Create a Supabase client with the request cookies
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  });

  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check for admin auth cookie (admin panel uses separate auth)
    const authCookie = request.cookies.get('admin-auth');
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Also protect admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin') && !request.nextUrl.pathname.startsWith('/api/admin/auth')) {
    const authCookie = request.cookies.get('admin-auth');
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  // Protect user dashboard, pitch, and user API routes with Supabase Auth
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/pitch') ||
      request.nextUrl.pathname.startsWith('/api/user')) {
    
    // Try to get the auth token from cookies
    const cookieName = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;
    const authCookie = request.cookies.get(cookieName);
    
    if (!authCookie) {
      // Redirect to login for dashboard and pitch pages
      if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/pitch')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      // Return 401 for API routes
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify the session is valid
    try {
      const sessionData = JSON.parse(decodeURIComponent(authCookie.value));
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (sessionData.expires_at && sessionData.expires_at < now) {
        // Token is expired
        if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/pitch')) {
          return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        );
      }
    } catch {
      // Invalid cookie format
      if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/pitch')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
    '/pitch/:path*',
    '/api/user/:path*',
    '/api/pitch/:path*'
  ]
};