import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value?.toUpperCase();
  const path = request.nextUrl.pathname;

  if (!token && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && path.startsWith('/dashboard')) {
    
    // ADMINISTRATOR: Akses penuh
    if (role === 'ADMIN') {
      return NextResponse.next();
    }

    // ARSIPARIS: Dashboard, Capture, Daftar Arsip, Penyusutan
    if (role === 'ARSIPARIS') {
      const allowedPaths = [
        '/dashboard',
        '/dashboard/capture',
        '/dashboard/archives',
        '/dashboard/disposal'
      ];
      
      const isAllowed = allowedPaths.some(p => path === p || path.startsWith(p + '/'));

      if (!isAllowed) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // --- UPDATE ROLE STAFF DI SINI ---
    // STAFF: Hanya Dashboard dan Daftar Arsip (Archives)
    if (role === 'STAFF') {
      const allowedPaths = [
        '/dashboard',
        '/dashboard/archives' // <--- Diubah dari '/dashboard/search'
      ];
      
      const isAllowed = allowedPaths.some(p => path === p || path.startsWith(p + '/'));

      if (!isAllowed) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Amankan role tidak terdeteksi
    if (!role) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};