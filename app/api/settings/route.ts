import { NextResponse } from "next/server";

const WP_URL = process.env.WC_URL;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let cache: any | null = null;
let cacheTimestamp = 0;

export async function GET() {
  try {
    const now = Date.now();

    if (cache && now - cacheTimestamp < CACHE_TTL_MS) {
      return NextResponse.json(cache, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
      });
    }

    const res = await fetch(
      `${WP_URL}/wp-json/custom/v1/site-settings`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Settings fetch failed: ${res.status}`);

    const settings = await res.json();

    cache = settings;
    cacheTimestamp = now;

    return NextResponse.json(settings, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });

  } catch (error) {
    console.error("Settings API error:", error);
    if (cache) return NextResponse.json(cache);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}