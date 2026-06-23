import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "יבואני הממתקים | קטלוג מוצרים 2026",
};


export default function HomePage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F6D8C7]">

  {/* Preload BG — hidden, tells browser to fetch it at high priority */}
  <Image src="/homebg.png" alt="" aria-hidden="true" fill priority
    sizes="100vw" className="pointer-events-none select-none opacity-0 -z-50" />

  {/* BG STARS */}
  <div
    className="absolute inset-0 opacity-70"
    style={{
      backgroundImage: "url('/homebg.png')",
      backgroundSize: "cover",
      backgroundRepeat:"no-repeat",
      backgroundPosition: "center",
    }}
  />

  {/* LEFT CURVES */}
  <div className="absolute bottom-0 left-0 z-10">
    <Image
      src="/left-curves.png"
      alt="curves"
      width={500}
      height={700}
      priority
      className="h-auto w-[260px] md:w-[420px]"
    />
  </div>

  {/* TOP LOGO */}
  <div className="absolute right-4 top-0 z-20 md:right-8 md:top-0">
    <Image
      src="/logo-home.png"
      alt="logo"
      width={120}
      height={120}
      priority
      className="h-auto w-[70px] md:w-[90px]"
    />
  </div>

  {/* CENTER CONTENT */}
  <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-0 text-center">

    {/* HEART BALLOON */}
   <Image
      src="/Property-1Variant2-1.webp"
      alt="balloon"
      width={500}
      height={500}
      priority
      className="mb-2 h-auto w-[110px] md:w-[400px] zoom-rotate ml-[-100px]" 
    />

    {/* TITLE */}
    <h2 className="mb-0 text-[42px] font-black leading-none text-[#B0155A] md:text-[65px]">
      קטלוג מוצרים
    </h2>

    {/* YEAR */}
    <h1
      className="
        bg-gradient-to-b
        from-[#FF2B8A]
        to-[#B10055]
        bg-clip-text
        text-[65px]
        font-black
        leading-none
        text-transparent
        drop-shadow-[0_6px_0_rgba(140,0,70,0.35)]
        md:text-[120px]
      "
    >
      2026
    </h1>

    {/* BUTTON */}
    <Link
      href="/about"
      className="
        mt-4
        rounded-full
        bg-[#46BAB9]
        px-20
        py-3
        text-[24px]
        font-medium
        text-white
        shadow-[0_6px_0_rgba(0,0,0,0.12)]
        transition-all
        duration-300
        hover:scale-105
      "
    >
     בואו נתחיל
    </Link>

  </div>

</section>
  );
}
