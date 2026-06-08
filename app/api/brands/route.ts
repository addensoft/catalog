import { NextResponse } from "next/server";

const WP_URL = process.env.WC_URL;
const authHeader = {
  Authorization:
    "Basic " +
    Buffer.from(process.env.WC_KEY + ":" + process.env.WC_SECRET).toString("base64"),
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let cache: any[] | null = null;
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
      `${WP_URL}/wp-json/wc/v3/products/brands?_fields=id,name,slug`,
      { headers: authHeader, next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Brands fetch failed: ${res.status}`);

    const data = await res.json();

    const brands = data.map((item: any) => ({
      id:   item.id,
      name: item.name,
      slug: item.slug,
    }));

    cache = brands;
    cacheTimestamp = now;

    return NextResponse.json(brands, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });

  } catch (error) {
    console.error("Brands API error:", error);
    if (cache) return NextResponse.json(cache);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}