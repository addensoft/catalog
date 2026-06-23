export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Warm the Next.js data cache on server start so first visitor gets instant response.
    const { getCatalogData } = await import("./lib/getCatalogData");
    getCatalogData().catch(() => {});
  }
}
