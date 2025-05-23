import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/home',
  '/profile',
  '/friends',
  '/groups',
  '/group',
  '/user'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/signin',
  '/signup',
  '/api'
];

// Function to decode JWT token
function decodeJwt(token) {
  try {
    // JWT tokens have three parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // The payload is the second part and is base64 encoded
    const base64Payload = parts[1];
    // Replace URL-safe chars and add padding if needed
    let base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('Invalid token format');
      }
      base64 += new Array(5-pad).join('=');
    }
    
    // In Node.js environment (middleware), we need to use Buffer instead of atob
    let payload;
    try {
      // Try using Buffer (Node.js environment)
      const rawPayload = Buffer.from(base64, 'base64').toString('utf-8');
      payload = JSON.parse(rawPayload);
    } catch (nodeError) {
      // If Buffer is not available, fall back to atob (browser environment)
      try {
        const rawPayload = atob(base64);
        payload = JSON.parse(rawPayload);
      } catch (browserError) {
        console.error('Error decoding token in both environments:', nodeError, browserError);
        return null;
      }
    }
    
    return payload;
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
}

// Function to check if token is expired
function isTokenExpired(token) {
  if (!token) return true;
  
  const decodedToken = decodeJwt(token);
  if (!decodedToken || !decodedToken.exp) return true;
  
  // exp is in seconds, current time needs to be in seconds too
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies that was set by our frontend
  const token = request.cookies.get('authToken')?.value;
  const tokenExists = request.cookies.get('authToken_exists')?.value === 'true';
  
  // Check token validity and expiration
  const isValidToken = (token && !isTokenExpired(token)) || (tokenExists && token);
  
  // Redirect root path to signin
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
    // Redirect to login if trying to access protected route without valid auth
  if (isProtectedRoute && !isValidToken) {
    // If token exists but is expired, clear it from cookies
    if (token && isTokenExpired(token)) {      const response = NextResponse.redirect(new URL('/signin', request.url));
      // Clear the expired token cookie
      response.cookies.delete('authToken');
      response.cookies.delete('authToken_exists');
      return response;
    }
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  // Redirect to home if trying to access login/signup while already authenticated with valid token
  if ((pathname === '/signin' || pathname === '/signup') && isValidToken) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  // Continue with the request for all other paths
  return NextResponse.next();
}

// Configure the middleware to run on all routes except static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (browser favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
