import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { authenticateApiRequest } from './lib/auth/tokenAuth';

// This middleware handles both session-based auth and API token auth
export default withAuth(
  async function middleware(req) {
    // Check if this is an API route that might use token auth
    const isApiRoute = req.nextUrl.pathname.startsWith('/api/');
    
    // If it's an API route, try token authentication first
    if (isApiRoute) {
      const authHeader = req.headers.get('authorization');
      
      // If there's an Authorization header, try to authenticate with token
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const tokenUser = await authenticateApiRequest(req);
        
        // If token authentication succeeded, allow the request
        if (tokenUser) {
          // Add the token user to the request headers for API routes to use
          const requestHeaders = new Headers(req.headers);
          requestHeaders.set('x-token-user', JSON.stringify(tokenUser));
          
          // Continue with the modified request
          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
        }
      }
    }

    // If token auth failed or this is not an API route, fall back to session auth
    
    // If the user is not authenticated and trying to access protected routes
    if (!req.nextauth.token) {
      // For API routes, return 401 instead of redirecting
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      // For non-API routes, redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Admin routes protection
    if (
      req.nextUrl.pathname.startsWith('/dashboard/admin') &&
      req.nextauth.token.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For API routes with token auth, bypass NextAuth's authorization check
        if (req.headers.get('authorization')?.startsWith('Bearer ')) {
          return true;
        }
        
        // Otherwise, use the standard token check
        return !!token;
      },
    },
  }
);

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*', // Apply to all API routes for token auth
  ],
};
