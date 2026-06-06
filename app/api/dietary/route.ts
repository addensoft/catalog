export async function GET() {
  const res = await fetch(
    "https://sienna-duck-658240.hostingersite.com/wp-json/wc/v3/products/attributes/2/terms",
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