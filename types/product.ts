

export interface Product {
  id: number;
  category: string;
  title: string;
  info: string;
  image: string;
  brand_image: string;
  slug: string;
  brand: string;
  tags: string[];
  sku: string;
  gallery_images:string[];

  product_barcode: string;
  product_import_country: string;
  products_faqs:string[];
}