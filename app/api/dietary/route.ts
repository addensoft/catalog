const WP_URL = process.env.WC_URL;

export async function GET() {
  const res = await fetch(
    `${WP_URL}/wp-json/wc/v3/products/attributes/2/terms`,
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

  return Response.json(data);
}