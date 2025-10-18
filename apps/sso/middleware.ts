import { NextRequest, NextResponse } from "next/server";
import { verifyCredentialAction } from "./libs/actions/verify-credential-action";
import { MAIN_APP_BASE_URL } from "@repo/commons/constant/base";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    if (req.nextUrl.pathname.startsWith("/")) {
        if (await verifyCredentialAction()) {
            return NextResponse.redirect(MAIN_APP_BASE_URL);
        }
    }

    return res;
}

export const config = { matcher: ['/((?!.*\\.).*)',], };