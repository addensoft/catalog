// import { products } from "@/data/products";

// export async function GET() {
//   return Response.json(products);
// }

// export async function GET() {

//   const res = await fetch("http://localhost:4000/products");

//   const products = await res.json();

//   return Response.json(products);

// }


export async function GET() {

  let allProducts: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {

    const res = await fetch(
      `https://addensoft.com/wp-json/wc/v3/products?per_page=100&page=${page}`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.WC_KEY +
              ":" +
              process.env.WC_SECRET
            ).toString("base64"),
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (data.length === 0) {
      hasMore = false;
      break;
    }

    allProducts = [...allProducts, ...data];

    page++;
  }

  const products = await Promise.all(
    allProducts.map(async (item: any) => {

    // brand thumbnail
    const brand = item.brands?.[0];

      let brandThumbnail = "/brands/default.png";

      if (brand?.id) {

        try {

          const brandRes = await fetch(
            `https://addensoft.com/wp-json/wc/v3/products/brands/${brand.id}`,
            {
              headers: {
                Authorization:
                  "Basic " +
                  Buffer.from(
                    process.env.WC_KEY +
                    ":" +
                    process.env.WC_SECRET
                  ).toString("base64"),
              },
              cache: "no-store",
            }
          );

          const brandData = await brandRes.json();

          brandThumbnail =
            brandData.image?.src ||
            "/brands/default.png";

        } catch (error) {

          console.log(
            "Brand image fetch error:",
            error
          );
        }
      }

      const barcodeImageId = item.meta_data.find(
        (meta: any) => meta.key === "product_barcode"
      )?.value;

      let productBarcode = "/barcode/default.png";

      if (barcodeImageId) {

        const barcodeRes = await fetch(
          `https://addensoft.com/wp-json/wp/v2/media/${barcodeImageId}`
        );

        const barcodeData = await barcodeRes.json();

        productBarcode =
          barcodeData.source_url ||
          "/barcode/default.png";
      }
      // size manuall maping
      const sizeUnitValue =
        item.meta_data.find(
          (meta: any) =>
            meta.key === "size_unit"
        )?.value || "";

      const sizeUnitMap: any = {
        gram: "גרם",
        ml: 'מ"ל',
        kg: 'ק"ג',
      };

      const sizeUnit =
        sizeUnitMap[sizeUnitValue] ||
        sizeUnitValue;

      return {
        

        id: item.id,

        title:
          item.name
            ?.replace(/\\n/g, "\n")
            ?.replace(/<br\s*\/?>/gi, "\n") || "",

        slug: item.slug,

        image:
          item.images?.[0]?.src ||
          "/placeholder.png",

        gallery_images:
          item.images?.map(
            (img: any) => img.src
          ) || [],

        brand_image: brandThumbnail,

        category:
          item.categories?.[0]?.name || "",

        brand:
          item.brands?.[0]?.name || "",

        info:
          // item.short_description
          //   ?.replace(/<[^>]*>/g, "")
          //   ?.replace(/<br\s*\/?>/gi, "\n") || "",
          item.meta_data.find(
            (meta: any) =>
              meta.key ===
              "factor_of_friction"
          )?.value || "",

        tags:
          // item.tags?.map(
          //   (tag: any) => tag.name
          // ) || [],
          item.meta_data.find(
            (meta: any) =>
              meta.key ===
              "kashrut_כַּשְׁרוּת_for_shop"
          )?.value || "",

          kesheria_single:
             item.meta_data.find(
            (meta: any) =>
              meta.key ===
              "kashrut"
          )?.value || "",

        size_value:
          item.meta_data.find(
            (meta: any) =>
              meta.key ===
              "size_value"
          )?.value || "",

        size_unit: sizeUnit,

        sku: item.sku,

        product_barcode: productBarcode,

        product_import_country:
          item.meta_data.find(
            (meta: any) =>
              meta.key ===
              "country_of_manufacture"
          )?.value || "",

      };
    })
  );

  return Response.json(products);
}