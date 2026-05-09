import { brands } from "@/data/brands";

export async function GET() {
  return Response.json(brands);
}