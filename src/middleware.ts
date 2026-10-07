import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];
const ROLE_PREFIX: Record<string, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("lmp_role")?.value;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    if (role && ROLE_PREFIX[role]) {
      return NextResponse.redirect(new URL(`${ROLE_PREFIX[role]}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (role && ROLE_PREFIX[role]) {
      return NextResponse.redirect(new URL(`${ROLE_PREFIX[role]}/dashboard`, request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const requiredRole = Object.entries(ROLE_PREFIX).find(([, prefix]) =>
    pathname.startsWith(prefix),
  )?.[0];

  if (requiredRole) {
    if (!role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== requiredRole) {
      return NextResponse.redirect(new URL(`${ROLE_PREFIX[role]}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
