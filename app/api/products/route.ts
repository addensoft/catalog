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
  

  const res = await fetch(
    "https://addensoft.com/wp-json/wc/v3/products",
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

const products = await Promise.all(
  data.map(async (item: any) => {

    const brandImageId = item.meta_data.find(
      (meta: any) => meta.key === "brand_image"
    )?.value;

    let brandImage = "/brands/default.png";

    if (brandImageId) {

      const mediaRes = await fetch(
        `https://addensoft.com/wp-json/wp/v2/media/${brandImageId}`
      );

      const mediaData = await mediaRes.json();

      brandImage =
        mediaData.source_url ||
        "/brands/default.png";
    }

    return {
      id: item.id,

      title: item.name
      ?.replace(/\\n/g, "\n")
      ?.replace(/<br\s*\/?>/gi, "\n") || "",

      slug: item.slug,

      image:
        item.images?.[0]?.src ||
        "/placeholder.png",

      brand_image: brandImage,

      category:
        item.categories?.[0]?.name || "",

      brand:
        item.brands?.[0]?.name || "",

      info:
        item.short_description
          ?.replace(/<[^>]*>/g, "") || "",

      tags:
        item.tags?.map(
          (tag: any) => tag.name
        ) || [],

      sku: item.sku,
    };
  })
);
  return Response.json(products);
}