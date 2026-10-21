import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";
import { NAVIGATION_LINKS, SESSION_COOKIE } from "@/constants";

const PUBLIC_ROUTES: string[] = [
  NAVIGATION_LINKS.login,
  NAVIGATION_LINKS.register,
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(token);
  const isAuthenticated = Boolean(session?.userId);

  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(NAVIGATION_LINKS.login, request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(NAVIGATION_LINKS.home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
