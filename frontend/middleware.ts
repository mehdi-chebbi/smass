import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const transformPort = url.searchParams.get("XTransformPort");

  if (transformPort && url.pathname.startsWith("/api/")) {
    const backendSearchParams = new URLSearchParams(url.searchParams);
    backendSearchParams.delete("XTransformPort");

    const backendPath =
      url.pathname +
      (backendSearchParams.toString() ? `?${backendSearchParams}` : "");
    const backendUrl = `http://localhost:${transformPort}${backendPath}`;

    // 🔍 AJOUTEZ CES LOGS
    console.log("🔄 Proxying request:");
    console.log("   Method:", request.method);
    console.log("   From:", url.pathname);
    console.log("   To:", backendUrl);

    try {
      const body =
        request.method !== "GET" && request.method !== "HEAD"
          ? await request.text()
          : undefined;

      // 🔍 LOG LE BODY
      if (body) {
        console.log("   Body:", body.substring(0, 200)); // premiers 200 caractères
      }

      const backendResponse = await fetch(backendUrl, {
        method: request.method,
        headers: {
          "Content-Type":
            request.headers.get("Content-Type") || "application/json",
          Authorization: request.headers.get("Authorization") || "",
        },
        body: body,
      });

      // 🔍 LOG LA RÉPONSE
      console.log("   Status:", backendResponse.status);

      const responseBody = await backendResponse.text();

      return new NextResponse(responseBody, {
        status: backendResponse.status,
        headers: {
          "Content-Type":
            backendResponse.headers.get("Content-Type") || "application/json",
        },
      });
    } catch (error) {
      console.error("❌ Backend proxy error:", error);
      return NextResponse.json(
        { error: "Backend server not reachable" },
        { status: 502 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
