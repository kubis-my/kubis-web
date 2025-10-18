import { NextRequest, NextResponse } from "next/server";
import { refreshCredentialTokenAction } from "@repo/commons/actions/refresh-credential-token";

// Simple in-memory cache to prevent duplicate calls within 1 second
let lastRefreshTime = 0;
const REFRESH_COOL_DOWN = 1000; // 1 second

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Skip prefetch requests and Next.js internal requests
    const purpose = req.headers.get('purpose');
    const isNextJsData = req.headers.get('x-nextjs-data');
    const secFetchDest = req.headers.get('sec-fetch-dest');

    if (purpose === 'prefetch' || isNextJsData) {
        return res;
    }

    // Only run on actual document/page requests (not images, scripts, styles, etc.)
    // AND only on the root path to avoid running on every navigation
    if (secFetchDest !== 'document' && secFetchDest !== 'empty') {
        return res;
    }

    // Deduplicate: Only refresh if enough time has passed since last refresh
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOL_DOWN) {
        return res;
    }

    lastRefreshTime = now;
    await refreshCredentialTokenAction();

    return res;
}

export const config = { matcher: ['/((?!.*\\.).*)',], };