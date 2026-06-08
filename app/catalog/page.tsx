"use client";
import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import Image from "next/image";

import type { Product } from "@/types/product";
import type { Category } from "@/types/categories";
import type { Brand } from "@/types/brands";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

// ✅ Lazy load Barcode — only needed inside the popup
const Barcode = lazy(() => import("react-barcode"));

// ─── Static data (moved outside component — never needs to re-create) ─────────

const topFiltersBtn = [
  { id: 1, title: "חדש על המדף" },
  { id: 2, title: "כל הממתקים" },
  { id: 3, title: "כשל״פ" },
];

const sortOptions = [
  "תאריך (מחדש לישן)",
  "תאריך (מישן לחדש)",
  "מחיר (מזול ליקר)",
  "מחיר (מיקר לזול)",
  "מותג",
  "שם (א-ת)",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalorieRow { label: string; value: string; unit: string; }

// ─── Component ────────────────────────────────────────────────────────────────

export default function CatalogPage() {

  // ── Data state ──────────────────────────────────────────────────────────────
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands,     setBrands]     = useState<Brand[]>([]);
  const [kashrut,    setKashrut]    = useState<any[]>([]);
  const [dietary,    setDietary]    = useState<any[]>([]);
  const [settings,   setSettings]   = useState<any>(null);

  // ✅ Split loading so products render as soon as they arrive
  const [productsLoading,  setProductsLoading]  = useState(true);
  const [metaLoading,      setMetaLoading]       = useState(true);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open,            setOpen]            = useState(false);
  const [selected,        setSelected]        = useState("בחירה");
  const [sortOpen,        setSortOpen]        = useState(false);
  const [selectedSort,    setSelectedSort]    = useState("סדר לפי");
  const [selectedBrands,  setSelectedBrands]  = useState<string[]>([]);
  const [selectedTags,    setSelectedTags]    = useState<string[]>([]);
  const [selectedKashrut, setSelectedKashrut] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [searchTerm,      setSearchTerm]      = useState("");
  const [visibleCount,    setVisibleCount]    = useState(10);
  const [loadingMore,     setLoadingMore]     = useState(false);
  const [openFaq,         setOpenFaq]         = useState<number | null>(0);

  // ── Gallery auto-slide ───────────────────────────────────────────────────────
  const [activeImage, setActiveImage] = useState(0);
  const galleryImages = selectedProduct?.gallery_images || [];

  // Reset activeImage when popup changes
  useEffect(() => { setActiveImage(0); }, [selectedProduct]);

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // ── Data fetching — products first, then meta in parallel ───────────────────
  useEffect(() => {
    // Fetch products immediately so the grid renders ASAP
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setProductsLoading(false); })
      .catch(() => setProductsLoading(false));

    // Fetch everything else in parallel — non-blocking for the product grid
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/brands").then((r) => r.json()),
      fetch("/api/kashrut").then((r) => r.json()),
      fetch("/api/dietary").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ])
      .then(([categoriesData, brandsData, kashrutData, dietaryData, settingsData]) => {
        setCategories(categoriesData);
        setBrands(brandsData);
        setKashrut(kashrutData);
        setDietary(dietaryData);
        setSettings(settingsData);
      })
      .catch(console.error)
      .finally(() => setMetaLoading(false));
  }, []);

  // ── Reset visible count when filters change ──────────────────────────────────
  useEffect(() => {
    setVisibleCount(10);
  }, [selected, selectedBrands, selectedTags]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const toggleFilter = useCallback((
    value: string,
    selectedArray: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState(selectedArray.includes(value)
      ? selectedArray.filter((i) => i !== value)
      : [...selectedArray, value]
    );
  }, []);

  // ✅ Memoised filtering — won't recompute unless inputs change
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const categoryMatch =
        selected === "בחירה" || product.category?.includes(selected);
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const kashrutMatch =
        selectedKashrut.length === 0 || selectedKashrut.some((k) => product.kashrut?.includes(k));
      const dietaryMatch =
        selectedDietary.length === 0 || selectedDietary.some((d) => product.dietary?.includes(d));
      const lc = searchTerm.toLowerCase().trim();
      const searchMatch =
        lc === "" ||
        product.title?.toLowerCase().includes(lc) ||
        product.info?.toLowerCase().includes(lc) ||
        product.sku?.toLowerCase().includes(lc);
      return categoryMatch && brandMatch && kashrutMatch && dietaryMatch && searchMatch;
    });
  }, [products, selected, selectedBrands, selectedKashrut, selectedDietary, searchTerm]);

  // ✅ Memoised sorting
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    switch (selectedSort) {
      case "תאריך (מחדש לישן)":
        return arr.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
      case "תאריך (מישן לחדש)":
        return arr.sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime());
      case "מחיר (מזול ליקר)":
        return arr.sort((a, b) => a.price - b.price);
      case "מחיר (מיקר לזול)":
        return arr.sort((a, b) => b.price - a.price);
      case "מותג":
        return arr.sort((a, b) => a.brand.localeCompare(b.brand, "he"));
      case "שם (א-ת)":
        return arr.sort((a, b) => a.title.localeCompare(b.title, "he"));
      default:
        return arr;
    }
  }, [filteredProducts, selectedSort]);

  const displayedProducts = useMemo(
    () => sortedProducts.slice(0, visibleCount),
    [sortedProducts, visibleCount]
  );

  // ── Infinite scroll (placed here so sortedProducts is already declared) ────────
  const totalFilteredRef = React.useRef(0);
  totalFilteredRef.current = sortedProducts.length;

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore) return;
      const { scrollY, innerHeight } = window;
      const fullHeight = document.documentElement.scrollHeight;
      if (scrollY + innerHeight >= fullHeight - 300) {
        setVisibleCount((prev) => {
          if (prev >= totalFilteredRef.current) return prev;
          setLoadingMore(true);
          setTimeout(() => setLoadingMore(false), 300);
          return Math.min(prev + 10, totalFilteredRef.current);
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore]);

  // ✅ Memoised category sort
  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) => {
        if (a.title === "כל הממתקים") return -1;
        if (b.title === "כל הממתקים") return 1;
        return 0;
      }),
    [categories]
  );

  // ── FAQ items (depend on selectedProduct) ────────────────────────────────────
  const faqItems = useMemo(() => [
    {
      title: 'סימון בריאותי <span class="text-[16px] md:text-[22px] font-medium lg:text-[28px]">(אלרגנים)</span>',
      content: selectedProduct?.health_marking_ads,
    },
    {
      title: "רכיבים",
      content: selectedProduct?.components_ads,
    },
    {
      title: "מכיל",
      content: selectedProduct?.containing_ads,
    },
    {
      title: 'ערכים תזונתיים <span class="text-[16px] font-medium md:text-[22px] lg:text-[28px]">100 גרם</span>',
      content: (
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max">
            {selectedProduct?.caleries_table_ads?.map((row: CalorieRow, index: number) => (
              <div key={index} className="w-[170px] flex-shrink-0 px-2 py-2 text-center">
                <div className="min-h-[45px] mb-2 text-[18px] leading-[22px] font-bold text-black">{row.label}</div>
                <div className="text-[28px] mb-2 font-bold leading-none text-[#D41A68]">{row.value}</div>
                <div className="text-[20px] font-bold text-black">{row.unit}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ], [selectedProduct]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5CA5F]">

      {/* ── STICKY HEADER ── */}
      <section className="sticky top-0 z-50 bg-[#ffffff] px-[1px] pt-0 pb-[2px]">

        <header className="bg-[#ffffff] max-w-[1400px] mx-auto px-2 lg:px-6 pt-[12px] lg:pt-[32px] pb-0 bg-[url('/mobile-header-bg.svg')] bg-cover bg-top bg-no-repeat lg:bg-none">
          <div className="mx-auto flex max-w-[1600px] lg:flex-row lg:items-center lg:justify-between lg:gap-6">

            {/* RIGHT LOGO */}
            <div className="flex w-full items-baseline lg:items-center justify-start lg:justify-between pb-0 lg:w-auto lg:pb-0">
              <div className="text-right leading-none">
                <div className="relative z-1 lg:mb-[-52px] mb-[-24px] mr-[-30px] duration-300 hover:-translate-y-[8px] hover:rotate-[8deg]">
                  <Image src="/right-icon.png" alt="right-icon" width={140} height={200}
                    className="h-auto w-[100px] lg:w-[140px]" />
                </div>
              </div>
              <div className="mb-[-5px]">
                <Image src="/yearbrand.png" alt="year brand" width={168} height={70}
                  className="h-auto w-[120px] lg:w-[168px]" />
              </div>
            </div>

            {/* SEARCH AREA */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-5">

              {/* FILTER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="group flex h-[55px] min-w-0 lg:min-w-[144px] w-auto cursor-pointer items-center justify-between gap-3 rounded-full border border-[#D41A68] bg-white px-6 shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-[#D41A68]"
                >
                  <span className="whitespace-nowrap text-[20px] font-normal text-[#D41A68] transition-colors duration-300 group-hover:text-[#ffffff]">
                    בחירה
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                    stroke="#D41A68" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    className={`ml-[-12px] shrink-0 transition-transform duration-300 group-hover:stroke-[#ffffff] ${open ? "rotate-0" : "rotate-180"}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 top-[72px] z-50 w-full lg:w-[980px] rounded-[32px] bg-[#46BAB9] p-8 px-5 shadow-2xl backdrop-blur-sm">

                    {/* TOP FILTER BUTTONS */}
                    <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
                      {topFiltersBtn.map((item) => (
                        <button key={item.id}
                          className="relative overflow-hidden rounded-[7px] border-2 border-white px-9 py-4 text-[30px] bg-[url('/btnbgpjpg.jpg')] bg-no-repeat bg-[length:100%_100%] font-medium leading-[16px] text-white shadow-md transition-all duration-300 hover:scale-105">
                          <span className="relative z-10">{item.title}</span>
                        </button>
                      ))}
                    </div>

                    {/* KASHRUT FILTER */}
                    <div className="mb-3 flex items-center gap-4">
                      <h3 className="min-w-[180px] text-right text-[25px] font-medium text-[#D41A68]">סינון לפי כשרות</h3>
                      <div className="flex flex-wrap gap-3">
                        {kashrut.map((item) => (
                          <button key={item.id}
                            onClick={() => toggleFilter(item.name, selectedKashrut, setSelectedKashrut)}
                            className={`cursor-pointer rounded-[12px] border border-[#D41A68] px-2 py-2 leading-[16px] text-[24px] font-medium transition-all duration-200 ${
                              selectedKashrut.includes(item.name) ? "bg-[#F5CA5F] text-black" : "bg-white text-black hover:bg-[#D41A68] hover:text-white"
                            }`}>
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* BRANDS FILTER */}
                    <div className="mb-3 flex items-center gap-4">
                      <h3 className="min-w-[180px] text-right text-[25px] font-medium text-[#D41A68]">סינון לפי מותג</h3>
                      <div className="flex flex-wrap gap-3">
                        {brands.map((item) => (
                          <button key={item.id}
                            onClick={() => toggleFilter(item.name, selectedBrands, setSelectedBrands)}
                            className={`cursor-pointer rounded-[12px] border border-[#D41A68] px-2 py-2 leading-[16px] text-[20px] font-medium transition-all duration-200 ${
                              selectedBrands.includes(item.name) ? "bg-[#F5CA5F] text-black" : "bg-white text-black hover:bg-[#D41A68] hover:text-white"
                            }`}>
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DIETARY FILTER */}
                    <div className="mb-3 flex items-center gap-4">
                      <h3 className="min-w-[180px] text-right text-[25px] font-medium text-[#D41A68]">סינון לפי העדפה תזונתית</h3>
                      <div className="flex flex-wrap gap-3">
                        {dietary.map((item) => (
                          <button key={item.id}
                            onClick={() => toggleFilter(item.name, selectedDietary, setSelectedDietary)}
                            className={`cursor-pointer rounded-[12px] border border-[#D41A68] px-2 py-2 leading-[16px] text-[24px] font-medium transition-all duration-200 ${
                              selectedDietary.includes(item.name) ? "bg-[#F5CA5F] text-black" : "bg-white text-black hover:bg-[#D41A68] hover:text-white"
                            }`}>
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* BOTTOM ACTIONS */}
                    <div className="flex items-center justify-between">
                      <button onClick={() => setOpen(false)}
                        className="rounded-full bg-white px-6 py-3 text-[18px] font-bold text-[#D41A68] shadow-md transition-all duration-200 hover:scale-105">
                        סגור
                      </button>
                      <button
                        onClick={() => { setSelectedTags([]); setSelectedBrands([]); setSelectedDietary([]); setSelectedKashrut([]); }}
                        className="cursor-pointer rounded-full bg-[#D41A68] px-8 py-3 text-[18px] font-black text-white shadow-md transition-all duration-200 hover:opacity-90">
                        נקה סינון
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SEARCH INPUT */}
              <div className="flex h-[54px] w-full max-w-full lg:max-w-[533px] items-center rounded-full border border-[#D41367] bg-white px-6 shadow-sm">
                <input
                  type="text"
                  placeholder="חפש מוצר"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-right text-[20px] font-bold text-black outline-none placeholder:text-[#000000]"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={2.5} stroke="currentColor" className="h-9 w-9 text-black">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </div>
            </div>

            {/* LEFT BRAND */}
            <div className="flex justify-center mb-[10px] lg:block">
              <div className="w-[150px] lg:w-[220px] h-[72px] flex justify-end items-end lg:justify-end lg:items-center">
                <a href="/">
                  <Image src="/leftsidelogo.webp" alt="left logo" width={440} height={140} priority unoptimized
                    className="h-[38px] lg:mb-[0px] lg:h-[70px] w-auto object-contain" />
                </a>
              </div>
            </div>

          </div>
        </header>

        {/* ── CATEGORY BAR ── */}
        <section
          style={{ backgroundColor: settings?.category_nav_bg_color }}
          className="relative z-2 px-6 py-[17px] rounded-b-[6px] bg-[#D41367]"
        >
          <div className="mx-auto max-w-[1360px]">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={18}
              loop={false}
              speed={800}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              breakpoints={{
                0:    { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 12 },
                768:  { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 16 },
                1024: { slidesPerView: 7, slidesPerGroup: 3, spaceBetween: 18 },
              }}
            >
              {metaLoading
                ? [...Array(7)].map((_, i) => (
                    <SwiperSlide key={i}>
                      <div className="h-[96px] rounded-[20px] bg-white/30 animate-pulse" />
                    </SwiperSlide>
                  ))
                : sortedCategories.map((item, index) => {
                    const isActive = selected === item.title;
                    return (
                      <SwiperSlide key={index}>
                        <button
                          onClick={() => setSelected(selected === item.title ? "בחירה" : item.title)}
                          className={`w-full rounded-xl px-2 py-3 lg:px-3 lg:py-2 text-center shadow-sm transition-all duration-200 cursor-pointer ${
                            isActive ? "bg-[#46BAB9]" : "bg-[#f5f5f5] hover:bg-[#46BAB9]"
                          }`}
                        >
                          <h3 className={`text-[12px] lg:text-[17px] leading-[16px] font-bold transition-colors duration-200 ${
                            isActive ? "text-white" : "text-black hover:text-white"
                          }`}>
                            {item.title}
                          </h3>
                          <div className={`mx-auto mt-1 flex h-[19px] w-[35px] items-center justify-center rounded-full text-[13px] leading-[16px] font-bold transition-all duration-200 ${
                            isActive ? "bg-white text-[#46BAB9]" : "bg-[#D41A68] text-white hover:bg-white hover:text-[#D41A68]"
                          }`}>
                            {item.count}
                          </div>
                        </button>
                      </SwiperSlide>
                    );
                  })
              }
            </Swiper>
          </div>
        </section>
      </section>

      {/* ── BODY ── */}
      <section
        className="px-10 py-12 pt-[16px] bg-[#F5CA5F]"
        style={{ backgroundColor: settings?.catalog_bg_color }}
      >
        {/* SORT BAR */}
        <div className="relative mx-auto max-w-[1200px] mb-[60px] flex justify-end">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="group flex h-[50px] min-w-[145px] cursor-pointer items-center justify-between rounded-full border border-[#D41A68] bg-white px-6 shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-[#D41A68]"
          >
            <span className="text-[20px] font-normal leading-[17px] text-[#D41A68] transition-all duration-300 group-hover:text-white">
              {selectedSort}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              className={`text-[#D41A68] ml-[-15px] transition-all duration-300 group-hover:text-white ${sortOpen ? "rotate-180" : ""}`}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {sortOpen && (
            <div className="absolute left-0 top-[0px] z-12 w-[300px] rounded-[10px] bg-[#D41A68] p-4 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[20px] font-regular text-white">בחירה</h2>
                <button onClick={() => setSortOpen(false)}
                  className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="32" viewBox="0 0 17 17"
                    fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-5">
                {sortOptions.map((item) => (
                  <button key={item}
                    onClick={() => { setSelectedSort(item); setSortOpen(false); }}
                    className={`cursor-pointer rounded-full border-[1px] px-6 py-3 text-center text-[20px] font-bold transition-all duration-200 ${
                      selectedSort === item
                        ? "border-[#46BAB9] bg-[#46BAB9] text-white"
                        : "border-[#46BAB9] bg-[#F3F3F3] text-black hover:bg-[#46BAB9] hover:text-white"
                    }`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── PRODUCT GRID ── */}
        <div className="mx-auto grid items-stretch max-w-[1200px] grid-cols-1 gap-y-[40px] gap-x-[96px] md:grid-cols-2 xl:grid-cols-3">
          {productsLoading
            ? [...Array(9)].map((_, i) => (
                <div key={i} className="bg-white h-[520px] animate-pulse" />
              ))
            : displayedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group relative overflow-hidden p-[6px] transition-all cursor-pointer duration-300"
                >
                  {/* HOVER BORDER */}
                  <div className="absolute inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Image src="/hover-border.png" alt="border" fill className="object-fill" />
                  </div>

                  <div className="relative z-10 flex h-full flex-col bg-white px-[25px] pb-10 pt-8">
                    {/* TOP */}
                    <div className="flex items-start justify-end">
                      <div className="absolute right-0 top-[34px] rounded-tl-full rounded-bl-full bg-[#57c8c7] px-3 py-1 text-[13px] font-medium text-white">
                        {product.category?.find((cat) => cat !== "כל הממתקים") || product.category?.[0]}
                      </div>
                      <div className="ml-[-14px] relative">
                        <Image src={product.brand_image} alt={product.title}
                          width={440} height={140} priority unoptimized
                          className="h-[50px] w-auto object-contain" />
                      </div>
                    </div>

                    {/* IMAGE */}
                    <div className="relative mx-auto mb-2 h-[250px] w-full max-w-[300px]">
                      <Image src={product.image} alt={product.title} fill
                        sizes="300px"  // ✅ helps Next.js pick the right size
                        className="object-contain" />
                    </div>

                    {/* TITLE */}
                    <h2 className="whitespace-pre-line mb-3 text-center text-[20px] font-black leading-[20px] text-[#D41A68]">
                      {product.title}
                    </h2>

                    {/* INFO */}
                    <div className="relative flex-1">
                      <p className="whitespace-pre-line text-center text-[13px] leading-[16px] font-medium text-black">
                        {product.info}
                      </p>
                    </div>

                    <p className="mt-2 text-center text-[12px] leading-[22px] font-medium text-black">
                      {product.tags}
                    </p>
                    <p className="mt-2 text-center text-[12px] leading-[22px] font-medium text-black">
                      מק"ט {product.sku}
                    </p>

                    <p className="cursor-pointer mx-auto mt-1 flex h-[40px] max-w-[161px] items-center justify-center rounded-full bg-[#D41A68] px-8 text-center text-[18px] font-black leading-[20px] text-white transition-all duration-200 hover:opacity-90">
                      צפה במוצר
                    </p>
                  </div>
                </div>
              ))
          }
        </div>

        {/* LOAD MORE SPINNER */}
        {loadingMore && (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D41A68] border-t-transparent" />
          </div>
        )}
      </section>

      {/* ── PRODUCT POPUP ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[9999] bg-black/70 p-2 md:p-5">
          <div className="flex h-full items-start justify-center overflow-y-auto">
            <div className="my-4 flex w-full max-w-[1260px] flex-col overflow-hidden rounded-[24px] bg-[#F7F7F7] shadow-2xl max-h-[90vh]">

              {/* POPUP HEADER */}
              <div className="sticky top-0 z-50 bg-[#45C3C3] px-5 pb-4 pt-5 text-right text-white md:px-8">
                <button onClick={() => setSelectedProduct(null)}
                  className="absolute left-3 top-3 z-50 flex h-[45px] w-[45px] items-center justify-center text-white transition-all duration-300 hover:rotate-90">
                  <span className="text-[52px] leading-none">×</span>
                </button>
                <h2 className="pl-8 text-[15px] font-bold leading-[18px] text-black md:text-[42px] md:leading-[46px]">
                  {selectedProduct?.title}
                </h2>
                <p className="mt-2 pl-12 text-[16px] font-medium leading-[22px] md:text-[33px]">
                  {selectedProduct?.size_unit} {selectedProduct?.size_value} | {selectedProduct?.brand}
                </p>
              </div>

              {/* POPUP BODY */}
              <div className="overflow-y-auto p-3 md:p-5">
                <div className="grid grid-cols-1 gap-4 mb-9 md:grid-cols-[60%_38%]">

                  {/* CONTENT SIDE */}
                  <div className="order-2 md:order-1 min-w-0  bg-white px-4 lg:pl-20 text-right">
                    {[
                      { label: "מותג", value: selectedProduct?.brand },
                      { label: "שם המוצר באנגלית", value: selectedProduct?.product_engname_ads },
                      { label: "גרם ואיזו", value: selectedProduct?.info },
                    ].map(({ label, value }) => (
                      <div key={label} className="border-b-[2px] border-[#46BAB9] py-2">
                        <p className="text-[20px] md:text-[26px] font-regular text-[#D41A68]">{label}</p>
                        <p className="mt-1 break-words text-[22px] leading-[24px] md:text-[26px] md:leading-[28px] font-medium">{value}</p>
                      </div>
                    ))}

                    {/* SKU + BARCODE */}
                    <div className="border-b-[2px] border-[#46BAB9] py-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-right">
                          <p className="text-[20px] md:text-[26px] font-regular text-[#D41A68]">מק״ט</p>
                          <p className="mt-1 break-words text-[22px] leading-[24px] md:text-[26px] md:leading-[28px] font-medium">
                            {selectedProduct?.sku}
                          </p>
                        </div>
                        <div className="shrink-0 pt-2">
                          {/* ✅ Barcode only renders when popup is open, loaded lazily */}
                          <Suspense fallback={<div className="h-[80px] w-[120px] bg-gray-100 animate-pulse" />}>
                            <Barcode value={selectedProduct.sku} format="CODE128"
                              width={1.7} height={80} fontSize={10} margin={0} />
                          </Suspense>
                        </div>
                      </div>
                    </div>

                    {[
                      { label: "כשרות", value: selectedProduct?.kesheria_single },
                      { label: "פרטי אריזה בקרטון", value: selectedProduct?.corton_friction_pak_ads },
                      { label: "ארץ ייצור", value: selectedProduct?.product_import_country || "סין" },
                    ].map(({ label, value }) => (
                      <div key={label} className="border-b-[2px] border-[#46BAB9] py-2 last:mb-6">
                        <p className="text-[20px] md:text-[26px] font-regular text-[#D41A68]">{label}</p>
                        <p className="mt-1 break-words text-[22px] whitespace-pre-line leading-[24px] md:text-[26px] md:leading-[28px] font-medium">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* IMAGE SIDE */}
                  <div className="order-1 md:order-2 min-w-0 relative bg-white p-4">
                    <div className="mb-4 flex justify-end">
                      <Image src={selectedProduct?.brand_image || "/logo.png"} alt="brand"
                        width={300} height={120} className="h-auto max-h-[90px] w-auto object-contain" />
                    </div>
                    <div className="relative mx-auto h-[260px] w-full max-w-[340px] overflow-hidden md:h-[380px]">
                      {galleryImages.map((img: string, index: number) => (
                        <Image key={index} src={img} alt={`gallery-${index}`} fill unoptimized
                          sizes="340px"
                          className={`absolute inset-0 object-contain transition-all duration-700 ${
                            activeImage === index ? "opacity-100 scale-100" : "opacity-0 scale-95"
                          }`} />
                      ))}
                    </div>
                    <div className="mt-5 flex justify-center gap-4">
                      {galleryImages.map((_: any, index: number) => (
                        <button key={index} onClick={() => setActiveImage(index)}
                          className={`h-5 w-5 rounded-full border-2 border-[#EC1974] transition-all duration-300 ${
                            activeImage === index ? "bg-[#EC1974] scale-110" : "bg-white"
                          }`} />
                      ))}
                    </div>
                  </div>

                </div>

                {/* FAQ */}
                <div className="mt-4 space-y-3" dir="rtl">
                  {faqItems.map((item, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="overflow-hidden">
                        <button type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="flex gap-2 w-full items-center justify-start bg-gradient-to-r from-[#4CC7C7] to-[#ffffff] px-2 py-5 text-right">
                          <svg className={`h-9 w-9 shrink-0 text-[#D41A68] transition-all duration-500 ease-in-out ${isOpen ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                          <h2 className="text-right text-[20px] font-bold leading-none text-[#D41A68] md:text-[30px] lg:leading-[20px] lg:text-[43px]"
                            dangerouslySetInnerHTML={{ __html: item.title }} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="bg-white px-5 py-5 text-right text-[16px] leading-[30px] text-black md:text-[18px] md:leading-[34px]">
                            {item.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* FOOTER NOTE */}
                <div className="mt-6 border-t-[3px] border-[#4CC7C7] pt-5 text-center lg:w-[90%] mx-auto">
                  <p className="text-[24px] leading-[26px] font-light text-black md:text-[30px] md:leading-[33px]">
                    הנתונים המדויקים מופיעים על גבי המוצר, אין להסתמך על הפירוט המופיע באתר, יתכנו טעויות או אי התאמות, יש לקרוא את המופיע על גבי אריזת המוצר לפני השימוש. התמונות והתאריכים המופיעים הינם להמחשה בלבד ואין להסתמך עליהם.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}