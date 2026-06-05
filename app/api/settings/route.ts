

export async function GET() {

  const res = await fetch(
    "https://sienna-duck-658240.hostingersite.com/wp-json/custom/v1/site-settings"
  );

  const settings = await res.json();

  return Response.json(settings);

}