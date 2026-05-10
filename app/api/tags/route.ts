// import { tags } from "@/data/tags";

// export async function GET() {
//   return Response.json(tags);
// }

export async function GET() {

  const res = await fetch(
    "https://addensoft.com/wp-json/wc/v3/products/tags",
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


  const tags = data
    .map((item: any) => ({
      id: item.id,
      name: item.name,
    }));

  return Response.json(tags);
}