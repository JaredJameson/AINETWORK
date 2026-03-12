import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('ain_token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
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
  ],
};
