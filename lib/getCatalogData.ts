const WP_URL = process.env.WC_URL;
const authHeader = {
  Authorization:
    "Basic " +
    Buffer.from(process.env.WC_KEY + ":" + process.env.WC_SECRET).toString("base64"),
};

const sizeUnitMap: Record<string, string> = {
  gram: "גרם",
  ml: 'מ"ל',
  kg: 'ק"ג',
};

async function fetchAllProducts(): Promise<any[]> {
  const firstRes = await fetch(
    `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=1&_fields=id,name,slug,price,date_created,images,brands,categories,attributes,meta_data,sku`,
    { headers: authHeader }
  );
  if (!firstRes.ok) throw new Error(`WC products failed: ${firstRes.status}`);

  const totalPages = Number(firstRes.headers.get("X-WP-TotalPages") || 1);
  const firstData: any[] = await firstRes.json();
  if (totalPages === 1) return firstData;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(
        `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${i + 2}&_fields=id,name,slug,price,date_created,images,brands,categories,attributes,meta_data,sku`,
        { headers: authHeader }
      ).then((r) => r.json())
    )
  );
  return [firstData, ...rest].flat();
}

async function fetchBrandImageMap(): Promise<Record<number, string>> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/products/brands?per_page=100&_fields=id,image`,
      { headers: authHeader }
    );
    if (!res.ok) return {};
    const brands: any[] = await res.json();
    const map: Record<number, string> = {};
    for (const b of brands) map[b.id] = b.image?.src || "/brands/default.png";
    return map;
  } catch {
    return {};
  }
}

function mapProduct(item: any, brandImageMap: Record<number, string>) {
  const meta: Record<string, any> = {};
  for (const m of item.meta_data ?? []) meta[m.key] = m.value;

  const brand = item.brands?.[0];
  const brandThumbnail = brand?.id ? (brandImageMap[brand.id] ?? "/brands/default.png") : "/brands/default.png";
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

export async function getCatalogData() {
  const [allProducts, brandImageMap, categoriesRes, kashrutRes, dietaryRes, settingsRes] =
    await Promise.all([
      fetchAllProducts(),
      fetchBrandImageMap(),
      fetch(`${WP_URL}/wp-json/wc/v3/products/categories?per_page=100&_fields=id,name,slug,count`, { headers: authHeader }).then((r) => r.json()),
      fetch(`${WP_URL}/wp-json/wc/v3/products/attributes/1/terms?_fields=id,name,slug`, { headers: authHeader }).then((r) => r.json()),
      fetch(`${WP_URL}/wp-json/wc/v3/products/attributes/2/terms?_fields=id,name,slug`, { headers: authHeader }).then((r) => r.json()),
      fetch(`${WP_URL}/wp-json/custom/v1/site-settings`).then((r) => r.ok ? r.json() : null).catch(() => null),
    ]);

  const products = allProducts.map((item) => mapProduct(item, brandImageMap));

  const categories = categoriesRes
    .filter((c: any) => c.name !== "Uncategorized" && c.slug !== "uncategorized" && c.name !== "Default Category")
    .map((c: any) => ({ id: c.id, title: c.name, slug: c.slug, count: c.count }));

  const brandsMap = new Map<string, { id: number; name: string; slug: string }>();
  for (const p of allProducts) {
    const b = p.brands?.[0];
    if (b && !brandsMap.has(b.name)) brandsMap.set(b.name, { id: b.id, name: b.name, slug: b.slug });
  }

  return {
    products,
    categories,
    brands: [...brandsMap.values()],
    kashrut: Array.isArray(kashrutRes) ? kashrutRes : [],
    dietary: Array.isArray(dietaryRes) ? dietaryRes : [],
    settings: settingsRes,
  };
}
