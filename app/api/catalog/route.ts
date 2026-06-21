import { NextResponse } from "next/server";

const WP_URL = process.env.WC_URL;
const authHeader = {
  Authorization:
    "Basic " +
    Buffer.from(process.env.WC_KEY + ":" + process.env.WC_SECRET).toString("base64"),
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let cachedData: any | null = null;
let cacheTimestamp = 0;

const sizeUnitMap: Record<string, string> = {
  gram: "גרם",
  ml: 'מ"ל',
  kg: 'ק"ג',
};

async function fetchAllProducts(): Promise<any[]> {
  const firstRes = await fetch(
    `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=1&_fields=id,name,slug,price,date_created,images,brands,categories,attributes,meta_data,sku`,
    { headers: authHeader, next: { revalidate: 3600 } }
  );
  if (!firstRes.ok) throw new Error(`WC products failed: ${firstRes.status}`);

  const totalPages = Number(firstRes.headers.get("X-WP-TotalPages") || 1);
  const firstData: any[] = await firstRes.json();
  if (totalPages === 1) return firstData;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(
        `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${i + 2}&_fields=id,name,slug,price,date_created,images,brands,categories,attributes,meta_data,sku`,
        { headers: authHeader, next: { revalidate: 3600 } }
      ).then((r) => r.json())
    )
  );
  return [firstData, ...rest].flat();
}

async function fetchBrandImages(allProducts: any[]): Promise<Record<number, string>> {
  const ids = [
    ...new Set(allProducts.map((p: any) => p.brands?.[0]?.id).filter(Boolean)),
  ] as number[];

  const map: Record<number, string> = {};
  await Promise.all(
    ids.map(async (id) => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        const res = await fetch(`${WP_URL}/wp-json/wc/v3/products/brands/${id}`, {
          headers: authHeader,
          signal: ctrl.signal,
          next: { revalidate: 3600 },
        });
        clearTimeout(t);
        const d = await res.json();
        map[id] = d.image?.src || "/brands/default.png";
      } catch {
        map[id] = "/brands/default.png";
      }
    })
  );
  return map;
}

function mapProduct(item: any, brandImageMap: Record<number, string>) {
  const meta: Record<string, any> = {};
  for (const m of item.meta_data ?? []) meta[m.key] = m.value;

  const brand = item.brands?.[0];
  const brandThumbnail = brand?.id
    ? (brandImageMap[brand.id] ?? "/brands/default.png")
    : "/brands/default.png";

  const sizeUnit = sizeUnitMap[meta["size_unit"] || ""] || meta["size_unit"] || "";
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
    info:         meta["factor_of_friction"]                     || "",
    tags:         meta["kashrut_כַּשְׁרוּת_for_shop"]            || "",
    kesheria_single: meta["kashrut"]                             || "",
    size_value:   meta["size_value"]                             || "",
    size_unit:    sizeUnit,
    sku:          item.sku,
    product_import_country:  meta["country_of_manufacture"]      || "",
    product_engname_ads:     meta["english_name_product"]        || "",
    corton_friction_pak_ads: meta["carton_factors"]              || "",
    health_marking_ads:      meta["health_marking"]              || "",
    components_ads:          meta["components"]                  || "",
    containing_ads:          meta["containing"]                  || "",
    caleries_table_ads,
    dietary: item.attributes?.find((a: any) => a.name.includes("Dietary"))?.options || [],
    kashrut: item.attributes?.find((a: any) => a.name.includes("Kashrut"))?.options || [],
  };
}

export async function GET() {
  try {
    const now = Date.now();

    if (cachedData && now - cacheTimestamp < CACHE_TTL_MS) {
      return NextResponse.json(cachedData, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
      });
    }

    // Fetch products + categories + filters all in parallel
    const [allProducts, categoriesRes, kashrutRes, dietaryRes, settingsRes] = await Promise.all([
      fetchAllProducts(),
      fetch(`${WP_URL}/wp-json/wc/v3/products/categories?per_page=100&_fields=id,name,slug,count`, { headers: authHeader, next: { revalidate: 3600 } }).then((r) => r.json()),
      fetch(`${WP_URL}/wp-json/wc/v3/products/attributes/1/terms?_fields=id,name,slug`, { headers: authHeader, next: { revalidate: 3600 } }).then((r) => r.json()),
      fetch(`${WP_URL}/wp-json/wc/v3/products/attributes/2/terms?_fields=id,name,slug`, { headers: authHeader, next: { revalidate: 3600 } }).then((r) => r.json()),
      fetch(`${WP_URL}/wp-json/custom/v1/site-settings`, { next: { revalidate: 3600 } }).then((r) => r.ok ? r.json() : null).catch(() => null),
    ]);

    const brandImageMap = await fetchBrandImages(allProducts);
    const products = allProducts.map((item) => mapProduct(item, brandImageMap));

    const categories = categoriesRes
      .filter((c: any) => c.name !== "Uncategorized" && c.slug !== "uncategorized" && c.name !== "Default Category")
      .map((c: any) => ({ id: c.id, title: c.name, slug: c.slug, count: c.count }));

    // Derive brands from products — no extra WC request needed
    const brandsMap = new Map<string, { id: number; name: string; slug: string }>();
    for (const p of allProducts) {
      const b = p.brands?.[0];
      if (b && !brandsMap.has(b.name)) brandsMap.set(b.name, { id: b.id, name: b.name, slug: b.slug });
    }
    const brands = [...brandsMap.values()];

    const data = { products, categories, brands, kashrut: kashrutRes, dietary: dietaryRes, settings: settingsRes };

    cachedData = data;
    cacheTimestamp = now;

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });

  } catch (error) {
    console.error("Catalog API error:", error);
    if (cachedData) return NextResponse.json(cachedData);
    return NextResponse.json({ error: "Failed to fetch catalog" }, { status: 500 });
  }
}
