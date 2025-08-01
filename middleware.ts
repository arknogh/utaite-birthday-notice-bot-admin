import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth');
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/auth') && authCookie) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!pathname.startsWith('/auth') && !authCookie) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};