import { tags } from "@/data/tags";

export async function GET() {
  return Response.json(tags);
}