import { NextResponse } from "next/server";

const WP_URL = process.env.WC_URL;

const authHeader = {
  Authorization:
    "Basic " +
    Buffer.from(process.env.WC_KEY + ":" + process.env.WC_SECRET).toString("base64"),
};

// ─── In-memory cache (survives across requests in the same serverless instance) ───
// This means the first visitor after a cold start pays the 30s cost.
// Every visitor after that gets an instant response until the cache expires.
let cachedProducts: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const sizeUnitMap: Record<string, string> = {
  gram: "גרם",
  ml: 'מ"ל',
  kg: 'ק"ג',
};

// ─── Fetch all WooCommerce pages in parallel ───────────────────────────────────
async function fetchAllProducts(): Promise<any[]> {

  // Step 1: first page to get total page count
  const firstRes = await fetch(
    `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=1&_fields=id,name,slug,price,date_created,images,brands,categories,attributes,meta_data,sku`,
    {
      headers: authHeader,
      // ✅ Tell Next.js to cache this fetch on CDN for 1 hour too
      next: { revalidate: 3600 },
    }
  );

  if (!firstRes.ok) throw new Error(`WC fetch failed: ${firstRes.status}`);

  const totalPages = Number(firstRes.headers.get("X-WP-TotalPages") || 1);
  const firstData: any[] = await firstRes.json();

  if (totalPages === 1) return firstData;

  // Step 2: remaining pages all at once
  const restFetches = Array.from({ length: totalPages - 1 }, (_, i) =>
    fetch(
      `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${i + 2}&_fields=id,name,slug,price,date_created,images,brands,categories,attributes,meta_data,sku`,
      { headers: authHeader, next: { revalidate: 3600 } }
    ).then((r) => r.json())
  );

  const restData = await Promise.all(restFetches);
  return [firstData, ...restData].flat();
}

// ─── Fetch brand images — batched, with timeout per request ───────────────────
async function fetchBrandImages(allProducts: any[]): Promise<Record<number, string>> {
  const uniqueBrandIds = [
    ...new Set(
      allProducts.map((item: any) => item.brands?.[0]?.id).filter(Boolean)
    ),
  ] as number[];

  const brandImageMap: Record<number, string> = {};

  await Promise.all(
    uniqueBrandIds.map(async (brandId) => {
      try {
        // ✅ AbortController gives each brand fetch a 5s timeout
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `${WP_URL}/wp-json/wc/v3/products/brands/${brandId}`,
          {
            headers: authHeader,
            signal: controller.signal,
            next: { revalidate: 3600 },
          }
        );
        clearTimeout(timer);

        const data = await res.json();
        brandImageMap[brandId] = data.image?.src || "/brands/default.png";
      } catch {
        brandImageMap[brandId] = "/brands/default.png";
      }
    })
  );

  return brandImageMap;
}

// ─── Map raw WC product to our shape ─────────────────────────────────────────
function mapProduct(item: any, brandImageMap: Record<number, string>) {
  // Pre-index meta_data for O(1) lookups
  const meta: Record<string, any> = {};
  for (const m of item.meta_data ?? []) {
    meta[m.key] = m.value;
  }

  const brand = item.brands?.[0];
  const brandThumbnail = brand?.id
    ? (brandImageMap[brand.id] ?? "/brands/default.png")
    : "/brands/default.png";

  const sizeUnitValue = meta["size_unit"] || "";
  const sizeUnit = sizeUnitMap[sizeUnitValue] || sizeUnitValue;

  const nutritionCount = Number(meta["nutrition_items"] || 0);
  const caleries_table_ads = Array.from({ length: nutritionCount }, (_, i) => ({
    label: meta[`nutrition_items_${i}_nutrition_label`] || "",
    value: meta[`nutrition_items_${i}_nutrition_value`] || "",
    unit:  meta[`nutrition_items_${i}_nutrition_unit`]  || "",
  }));

  return {
    id:           item.id,
    title:        item.name?.replace(/\\n/g, "\n")?.replace(/<br\s*\/?>/gi, "\n") || "",
    slug:         item.slug,
    price:        Number(item.price || 0),
    date_created: item.date_created,
    image:        item.images?.[0]?.src || "/placeholder.png",
    gallery_images: item.images?.slice(1).map((img: any) => img.src) || [],
    brand_image:  brandThumbnail,
    category:     item.categories?.map((cat: any) => cat.name) || [],
    brand:        brand?.name || "",
    info:         meta["factor_of_friction"]                    || "",
    tags:         meta["kashrut_כַּשְׁרוּת_for_shop"]           || "",
    kesheria_single: meta["kashrut"]                            || "",
    size_value:   meta["size_value"]                            || "",
    size_unit:    sizeUnit,
    sku:          item.sku,
    product_import_country: meta["country_of_manufacture"]      || "",
    product_engname_ads:    meta["english_name_product"]        || "",
    corton_friction_pak_ads: meta["carton_factors"]             || "",
    health_marking_ads:     meta["health_marking"]              || "",
    components_ads:         meta["components"]                  || "",
    containing_ads:         meta["containing"]                  || "",
    caleries_table_ads,
    dietary:
      item.attributes?.find((a: any) => a.name.includes("Dietary"))?.options || [],
    kashrut:
      item.attributes?.find((a: any) => a.name.includes("Kashrut"))?.options || [],
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET() {
  try {

    const now = Date.now();

    // ✅ Return cached data if still fresh — instant response
    if (cachedProducts && now - cacheTimestamp < CACHE_TTL_MS) {
      return NextResponse.json(cachedProducts, {
        headers: {
          // ✅ Also tell the browser/CDN to cache for 1 hour
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      });
    }

    // Cache miss — fetch fresh data
    const [allProducts, ] = await Promise.all([
      fetchAllProducts(),
    ]);

    const brandImageMap = await fetchBrandImages(allProducts);

    const products = allProducts.map((item) => mapProduct(item, brandImageMap));

    // Store in memory cache
    cachedProducts = products;
    cacheTimestamp = now;

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });

  } catch (error) {
    console.error("Products API error:", error);

    // ✅ If fetch fails but we have stale cache, return it rather than erroring
    if (cachedProducts) {
      console.warn("Returning stale cache due to fetch error");
      return NextResponse.json(cachedProducts);
    }

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}