
const WP_URL = process.env.WC_URL;
  export async function GET() {
    // categories api call
  const res = await fetch(
    `${WP_URL}/wp-json/wc/v3/products/categories?per_page=100`,
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

  const categories = data.filter(
    (item: any) =>
      item.name !== "Uncategorized" &&
      item.slug !== "uncategorized" &&
      item.name !== "Default Category"
  ).map((item: any) => ({
    id: item.id,
    title: item.name,
    slug: item.slug,
    count: item.count,
  }));

  return Response.json(categories);
}