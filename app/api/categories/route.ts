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
      `${WP_URL}/wp-json/wc/v3/products/categories?per_page=100&_fields=id,name,slug,count`,
      { headers: authHeader, next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);

    const data = await res.json();

    const categories = data
      .filter(
        (item: any) =>
          item.name !== "Uncategorized" &&
          item.slug !== "uncategorized" &&
          item.name !== "Default Category"
      )
      .map((item: any) => ({
        id:    item.id,
        title: item.name,
        slug:  item.slug,
        count: item.count,
      }));

    cache = categories;
    cacheTimestamp = now;

    return NextResponse.json(categories, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });

  } catch (error) {
    console.error("Categories API error:", error);
    if (cache) return NextResponse.json(cache);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}