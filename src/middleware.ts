import { isAuthenticated } from "@/lib/auth";
import { tokenToID } from "@/pages/api/firebase";
import { NextRequest, NextResponse } from "next/server";

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: ["/api/:path*"],
};

export async function middleware(req: NextRequest) {

}
