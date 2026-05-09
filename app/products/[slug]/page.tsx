import { products } from "@/data/products";
import Image from "next/image";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return (
      <div className="p-10 text-center text-3xl">
        Product not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5CA5F] p-10">

      <div className="mx-auto max-w-[1200px] rounded-3xl bg-white p-10">

        <div className="grid gap-10 lg:grid-cols-2">

          {/* IMAGE */}
          <div className="relative h-[500px] w-full">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>

          {/* CONTENT */}
          <div>

            <h1 className="mb-5 text-5xl font-black text-[#D41A68] whitespace-pre-line">
              {product.title}
            </h1>

            <p className="mb-5 whitespace-pre-line text-2xl leading-[40px]">
              {product.info}
            </p>

            <div className="mb-5 flex flex-wrap gap-3">

              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#D41A68] px-5 py-2 text-white"
                >
                  {tag}
                </span>
              ))}

            </div>

            <p className="text-xl font-bold">
              SKU: {product.sku}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}