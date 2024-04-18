export {default} from 'next-auth/middleware';
import {NextRequest, NextResponse} from 'next/server';
import { getToken } from 'next-auth/jwt';


export const config = {
    matcher:['/dashboard/:path*',  '/sign-up', '/', '/verify/:path*']
}
export async function middleware(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req , secret: process.env.NEXTAUTH_SECRET});
  const url = req.nextUrl;
  if (token && (url.pathname.startsWith('sing-in') ||
   url.pathname.startsWith('sign-up')||
   url.pathname.startsWith('verify')||
   url.pathname.startsWith('/'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  if (!token && !url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
  }
    return NextResponse.next();
}

