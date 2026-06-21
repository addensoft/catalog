export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Warm the catalog cache in the background when the server starts.
    // First real visitor gets instant response instead of waiting 10s.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    fetch(`${baseUrl}/api/catalog`).catch(() => {});
  }
}
