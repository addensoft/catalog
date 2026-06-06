

export interface Product {
  id: number;
  category: string[];
  title: string;
  info: string;
  image: string;
  brand_image: string;
  slug: string;
  brand: string;
  tags: string[];
  sku: string;
  gallery_images:string[];

 
  product_import_country: string;
  products_faqs:string[];
  kesheria_single:string;
  size_value:number;
  size_unit: string;

  health_marking_ads:string;
  containing_ads:string;
  components_ads:string;
  caleries_table_ads: {
  label: string;
  value: string;
  unit: string;
}[];

  dietary: string[];
  kashrut: string[];
  date_created: string;
   price: number;
}