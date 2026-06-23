import { getCatalogData } from "@/lib/getCatalogData";
import CatalogClient from "./CatalogClient";

export default async function CatalogPage() {
  const data = await getCatalogData();
  return <CatalogClient {...data} />;
}
