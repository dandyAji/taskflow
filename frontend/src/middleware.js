import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/tasks", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
