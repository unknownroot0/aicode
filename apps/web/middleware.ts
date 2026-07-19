import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "access_token";

async function verifyJwt(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  const encoder = new TextEncoder();
  const key = encoder.encode(secret);

  try {
    const { payload } = await jwtVerify(token, key);
    return payload as Record<string, any>;
  } catch (err) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read auth cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  let token: string | null = null;
  for (const c of cookies) {
    const [k, ...v] = c.split("=");
    if (k === AUTH_COOKIE_NAME) {
      token = decodeURIComponent(v.join("="));
      break;
    }
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!token) {
    if (isDashboard) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (isAdminApi) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    return NextResponse.next();
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    if (isDashboard) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (isAdminApi) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    return NextResponse.next();
  }

  const role = payload.role as string | undefined;

  if (isDashboard) {
    if (role === "ADMIN") return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    url.searchParams.set("reason", "not_authorized");
    return NextResponse.redirect(url);
  }

  if (isAdminApi) {
    if (role === "ADMIN") return NextResponse.next();
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
