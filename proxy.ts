import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('ain_token')?.value;

  if (!token) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const response = NextResponse.redirect(new URL('/admin/login', req.url));
      response.cookies.delete('ain_token');
      return response;
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/admin/((?!login).*)',
    '/api/articles/:path*',
    '/api/events/:path*',
    '/api/news/:path*',
    '/api/categories/:path*',
    '/api/generate/:path*',
    '/api/scan',
    '/api/scan-sources',
    '/api/scan-sources/:path*',
    '/api/upload',
    '/api/auth/me',
    '/api/auth/logout',
    '/check-in/:path*',
    '/api/registrations/:path*',
  ],
};
