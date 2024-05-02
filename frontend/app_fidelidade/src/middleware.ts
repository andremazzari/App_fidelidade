//external dependencies
import { NextRequest, NextResponse } from "next/server";


//internal dependencies
import { verifySession, getToken, isTokenExpired, Logout } from "./services/ServerActions/Authentication";

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    let loginStatus = await verifySession();

    const nonRestrictedPaths: string[] = [
        '/',
        '/login',
        '/verifyEmail'
    ]

    let deleteToken = false;
    //Verify if session is still valid
    if (loginStatus) {
        const token = await getToken();
        const tokenExpired = await isTokenExpired(token);
        
        if (tokenExpired) {
            //token has expired
            //TEMP: this is throwing an error. Need to call this as a server action or route handler (understand)
            deleteToken = true;
            loginStatus = false;
        }

    }

    //Redirection logic
    let response;
    if (!loginStatus && !nonRestrictedPaths.includes(path)) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', path);
        response = NextResponse.redirect(redirectUrl);
    } else {
        response = NextResponse.next();
    }

    
    if (deleteToken) {
        response.cookies.delete('token');
    }

    return response;
}

export const config = {
    //TEMP: understand and review these routes
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }