// import { categories } from "@/data/categories";

// export async function GET() {
//   return Response.json(categories);
// }

  export async function GET() {
    // categories api call
  const res = await fetch(
    "https://addensoft.com/wp-json/wc/v3/products/categories",
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