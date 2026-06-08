const WP_URL = process.env.WORDPRESS_URL;

const authHeader = {
  Authorization:
    "Basic " +
    Buffer.from(
      process.env.WC_KEY + ":" + process.env.WC_SECRET
    ).toString("base64"),
};

const fetchOpts = {
  headers: authHeader,
  next: { revalidate: 3600 },
};

export async function GET() {
  try {

    // ── STEP 1: Fetch first page + get total pages ──
    const firstRes = await fetch(
      `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=1`,
      fetchOpts
    );

    const totalPages = Number(
      firstRes.headers.get("X-WP-TotalPages") || 1
    );

    const firstData = await firstRes.json();

    // ── STEP 2: Fetch all remaining pages IN PARALLEL ──
    let allProducts = [...firstData];

    if (totalPages > 1) {
      const restFetches = Array.from(
        { length: totalPages - 1 },
        (_, i) =>
          fetch(
            `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${i + 2}`,
            fetchOpts
          ).then((r) => r.json())
      );

      const restData = await Promise.all(restFetches);
      allProducts = [firstData, ...restData].flat();
    }

    // ── STEP 3: Collect unique brand IDs ──
    const uniqueBrandIds = [
      ...new Set(
        allProducts
          .map((item: any) => item.brands?.[0]?.id)
          .filter(Boolean)
      ),
    ] as number[];

    // ── STEP 4: Fetch all unique brands IN PARALLEL (not once per product!) ──
    const brandImageMap: Record<number, string> = {};

    await Promise.all(
      uniqueBrandIds.map(async (brandId) => {
        try {
          const res = await fetch(
            `${WP_URL}/wp-json/wc/v3/products/brands/${brandId}`,
            fetchOpts
          );
          const data = await res.json();
          brandImageMap[brandId] =
            data.image?.src || "/brands/default.png";
        } catch {
          brandImageMap[brandId] = "/brands/default.png";
        }
      })
    );

    // ── STEP 5: Map products (no more async needed here) ──
    const sizeUnitMap: Record<string, string> = {
      gram: "גרם",
      ml: 'מ"ל',
      kg: 'ק"ג',
    };

    const products = allProducts.map((item: any) => {

      // Pre-index all meta_data into a plain object for fast lookups
      const meta: Record<string, any> = {};
      for (const m of item.meta_data) {
        meta[m.key] = m.value;
      }

      // Brand
      const brand = item.brands?.[0];
      const brandThumbnail = brand?.id
        ? (brandImageMap[brand.id] ?? "/brands/default.png")
        : "/brands/default.png";

      // Size unit
      const sizeUnitValue = meta["size_unit"] || "";
      const sizeUnit = sizeUnitMap[sizeUnitValue] || sizeUnitValue;

      // Nutrition rows
      const nutritionCount = Number(meta["nutrition_items"] || 0);
      const nutritionRows = Array.from(
        { length: nutritionCount },
        (_, i) => ({
          label: meta[`nutrition_items_${i}_nutrition_label`] || "",
          value: meta[`nutrition_items_${i}_nutrition_value`] || "",
          unit:  meta[`nutrition_items_${i}_nutrition_unit`]  || "",
        })
      );

      return {
        id:           item.id,
        title:        item.name
                        ?.replace(/\\n/g, "\n")
                        ?.replace(/<br\s*\/?>/gi, "\n") || "",
        slug:         item.slug,
        price:        Number(item.price || 0),
        date_created: item.date_created,
        image:        item.images?.[0]?.src || "/placeholder.png",
        gallery_images: item.images?.map((img: any) => img.src) || [],
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
        caleries_table_ads:     nutritionRows,
        dietary:
          item.attributes
            ?.find((attr: any) => attr.name.includes("Dietary"))
            ?.options || [],
        kashrut:
          item.attributes
            ?.find((attr: any) => attr.name.includes("Kashrut"))
            ?.options || [],
      };
    });

    return Response.json(products);

  } catch (error) {
    console.error("Products API error:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}