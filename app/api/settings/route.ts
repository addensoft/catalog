

export async function GET() {

  const res = await fetch(
    "https://addensoft.com/wp-json/custom/v1/site-settings"
  );

  const settings = await res.json();

  return Response.json(settings);

}