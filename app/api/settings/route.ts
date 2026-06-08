
const WP_URL = process.env.WORDPRESS_URL;
export async function GET() {

  const res = await fetch(
    `${WP_URL}/wp-json/custom/v1/site-settings`
  );

  const settings = await res.json();

  return Response.json(settings);

}