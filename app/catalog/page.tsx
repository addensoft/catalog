"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import type { Product } from "@/types/product";
import type { Category } from "@/types/categories";
import type { Tag } from "@/types/tag";
import type { Brand } from "@/types/brands";





// filters
const filters = [
  "ממתקי ילדים",
  "מסטיקים",
  "מסטיקים וג’ליבינס",
];



// popup filter top button
const topFiltersBtn = [
  {
    id: 1,
    title: "חדש על המדף",
  },
  {
    id: 2,
    title: "כל הממתקים",
  },
  {
    id: 3,
    title: "כשל״פ",
  },
];

// ditery filter content
const diteryFilterBtn = [
    "טבעוני",   
    "פרווה", 
    "ללא גלוטן", 
    "ללא סוכר"
];

// short options
const sortOptions = [
  "תאריך (מחדש לישן)",
  "תאריך (מישן לחדש)",
  "מחיר (מזול ליקר)",
  "מחיר (מיקר לזול)",
  "מותג",
  "שם (א-ת)",
];

// faqs
 const faqItems = [
    {
     title: 'סימון בריאותי <span class="text-[16px] md:text-[22px] lg:text-[28px]">(אלרגנים)</span>',
      content:

        "מידע על אלרגנים יופיע כאן בהמשך.",
    },
    {
      title: "רכיבים",
      content:

        "רכיבי המוצר יופיעו כאן בהמשך.",
    },
    {
      title: "מכיל",
      content:

        "מידע נוסף יופיע כאן בהמשך.",
    },
    {
      title: "ערכים תזונתיים 100 גרם",
      content:

        "ערכים תזונתיים יופיעו כאן בהמשך.",
    },
  ];
  





export default function CatalogPage() {

    // api call ste
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("בחירה");

    // short option const
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("סדר לפי");

    // special filter of dropdown
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);



    // faqs colasps
    const [openFaq, setOpenFaq] = useState<number | null>(0);


//     const galleryImages =
//   selectedProduct?.gallery?.length > 0
//     ? selectedProduct.gallery
//     : [
//         "/products/product-1.png",
//        "/products/product-2.png",
//        "/products/product-3.png",
//       ];
    // AUTO SLIDE
        const [activeImage, setActiveImage] = useState(0);
        const galleryImages = selectedProduct?.gallery_images || [];

        useEffect(() => {
        if (galleryImages.length <= 1) return;

        const interval = setInterval(() => {
            setActiveImage((prev) =>
            prev === galleryImages.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
        }, [galleryImages.length]);

    

    useEffect(() => {

        const fetchData = async () => {

            const productsRes = await fetch("/api/products");
            const productsData = await productsRes.json();
            setProducts(productsData);

            const categoriesRes = await fetch("/api/categories");
            const categoriesData = await categoriesRes.json();
            setCategories(categoriesData);

            const brandsRes = await fetch("/api/brands");
            const brandsData = await brandsRes.json();
            setBrands(brandsData);

            const tagsRes = await fetch("/api/tags");
            const tagsData = await tagsRes.json();
            setTags(tagsData);
        };

        fetchData();

        }, []);

    const handleSelect = (value: string) => {
        setSelected(value);
        setOpen(false);
    };

    // filter toggle 
    const toggleFilter = (
  value: string,
  selectedArray: string[],
  setState: React.Dispatch<React.SetStateAction<string[]>>
) => {

  if (selectedArray.includes(value)) {
    setState(selectedArray.filter((item) => item !== value));
  } else {
    setState([...selectedArray, value]);
  }

    };

        // all filters filters
      const filteredProducts = products.filter((product: Product) => {

        const categoryMatch =
            selected === "בחירה" ||
            product.category === selected;

        const brandMatch =
            selectedBrands.length === 0 ||
            selectedBrands.includes(product.brand);

        const tagsMatch =
            selectedTags.length === 0 ||
            product.tags.some((tag: string) =>
                selectedTags.includes(tag)
            );



        return (
            categoryMatch &&
            brandMatch &&
            tagsMatch
        );
        });

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5CA5F]">
        {/* top header aria */}
        <section className="sticky top-0 z-50 bg-[#ffffff] px-[1px] pt-0 pb-[2px]">
            {/* TOP HEADER */}
            <header className="bg-[#ffffff] max-w-[1400px] mx-auto px-2 lg:px-6 pt-[12px] lg:pt-[32px] pb-0 bg-[url('/mobile-header-bg.svg')] bg-cover bg-top bg-no-repeat lg:bg-none">
                <div className="mx-auto flex max-w-[1600px] lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    {/* RIGHT LOGO AREA */}
                    <div className="flex w-full items-baseline lg:items-center justify-start lg:justify-between pb-0 lg:w-auto lg:pb-0">
                        <div className="text-right leading-none">
                            <div className="relative z-1 lg:mb-[-52px] mb-[-24px] mr-[-30px] duration-300 hover:-translate-y-[8px] hover:rotate-[8deg]">
                                <Image 
                                src="/right-icon.png"
                                alt="right-icon"
                                width={140}
                                height={200}
                                className="h-auto w-[100px] lg:w-[140px]"
                                />
                            </div>
                        </div>

                        <div className="mb-[-5px]">
                            <Image
                                src="/yearbrand.png"
                                alt="right-icon"
                                width={168}
                                height={70}
                                className="h-auto w-[120px] lg:w-[168px]"
                                />
                        </div>
                    </div>

                    {/* SEARCH AREA */}
                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-5">

                        {/* FILTER */}
                    <div className="relative">

                        {/* BUTTON */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="group flex h-[55px] min-w-0 lg:min-w-[144px] w-auto cursor-pointer items-center justify-between gap-3 rounded-full border border-[#D41A68] bg-white px-6 shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-[#D41A68]"
                        >
                            {/* TEXT */}
                            <span className="whitespace-nowrap text-[20px] font-normal text-[#D41A68] transition-colors duration-300  group-hover:text-[#ffffff]">
                            {selected}
                            </span>

                            {/* ICON */}
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#D41A68"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`ml-[-12px] shrink-0 transition-transform duration-300 group-hover:stroke-[#ffffff] ${
                                open ? "rotate-0" : "rotate-180"
                            }`}
                            >
                            <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {/* DROPDOWN */}
                        {open && (
                            <div className="absolute right-0 top-[72px] z-50 w-full lg:w-[980px] rounded-[32px] bg-[#46BAB9] p-8 px-5 shadow-2xl backdrop-blur-sm">

                                {/* TOP FILTER BUTTONS */}
                                <div className="mb-8 flex flex-wrap items-center justify-center gap-4">

                                    {topFiltersBtn.map((item) => (
                                        <button
                                        key={item.id}
                                        className="
                                        relative
                                        overflow-hidden
                                        rounded-[7px]
                                        border-2
                                        border-white
                                        px-9
                                        py-4
                                        text-[30px]
                                        bg-[url('/btnbgpjpg.jpg')]
                                        bg-no-repeat bg-[length:100%_100%]
                                        font-medium
                                        leading-[16px]
                                        text-white
                                        shadow-md
                                        transition-all
                                        duration-300
                                        hover:scale-105
                                        "
                                        >

                                        {/* TEXT */}
                                        <span className="relative z-10">
                                            {item.title}
                                        </span>

                                        </button>
                                    ))}

                                    </div>
                              
                                {/* TAGS  kodish*/}
                                <div className="mb-3 flex items-center gap-4">

                                <h3 className="min-w-[180px] text-right text-[25px] font-medium text-[#D41A68]">
                                    סינון לפי כשרות
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    
                                    {tags.map((item) => (
                                    <button key={item.id}
                                    onClick={() =>
                                        toggleFilter(
                                            item.name,
                                            selectedTags,
                                            setSelectedTags
                                        )
                                        }
                                    className={`cursor-pointer rounded-[12px] border border-[#D41A68] px-2 py-2 leading-[16px] text-[24px] font-medium transition-all duration-200 ${
                                        selectedTags.includes(item.name)
                                            ? "bg-[#F5CA5F] text-black"
                                            : "bg-white text-black hover:bg-[#D41A68] hover:text-white"
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                    ))}
                                </div>
                                </div>

                                {/* BRANDS */}
                                <div className="mb-3 flex items-center gap-4">

                                <h3 className="min-w-[180px] text-right text-[25px] font-medium text-[#D41A68]">
                                    סינון לפי מותג
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {brands.map((item) => (
                                    <button key={item.id}
                                    onClick={() =>
                                        toggleFilter(
                                            item.name,
                                            selectedBrands,
                                            setSelectedBrands
                                        )
                                    }
                                        className={`cursor-pointer rounded-[12px] border border-[#D41A68] px-2 py-2 leading-[16px] text-[24px] font-medium transition-all duration-200 ${
                                        selectedBrands.includes(item.name)
                                            ? "bg-[#F5CA5F] text-black"
                                            : "bg-white text-black hover:bg-[#D41A68] hover:text-white"
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                    ))}
                                </div>
                                </div>

                                {/* SPECIAL ditery */}
                                <div className="mb-3 flex items-center gap-4">

                                <h3 className="min-w-[180px] text-right text-[25px] font-medium text-[#D41A68]">
                                    סינון לפי העדפה תזונתית
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {diteryFilterBtn.map((item) => (
                                    <button
                                    onClick={() =>
                                        toggleFilter(
                                            item,
                                            selectedDietary,
                                            setSelectedDietary
                                        )
                                    }
                                        className={`cursor-pointer rounded-[12px] border border-[#D41A68] px-2 py-2 leading-[16px] text-[24px] font-medium transition-all duration-200 ${
                                        selectedDietary.includes(item)
                                            ? "bg-[#F5CA5F] text-black" 
                                            : "bg-white text-black hover:bg-[#D41A68] hover:text-white"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                    ))}
                                </div>
                                </div>

                                {/* BOTTOM ACTIONS */}
                                <div className="flex items-center justify-between">

                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-full bg-white px-6 py-3 text-[18px] font-bold text-[#D41A68] shadow-md transition-all duration-200 hover:scale-105"
                                >
                                    סגור
                                </button>

                            <button
                            onClick={() => {
                                setSelectedTags([]);
                                setSelectedBrands([]);
                                setSelectedDietary([]);
                            }}
                            className="cursor-pointer  rounded-full bg-[#D41A68] px-8 py-3 text-[18px] font-black text-white shadow-md transition-all duration-200 hover:opacity-90"
                            >
                            נקה סינון
                            </button>
                                </div>
                            </div>
                            )}
                        </div>
                        {/* SEARCH */}
                        <div className="flex h-[54px] w-full max-w-full lg:max-w-[533px] items-center rounded-full border border-[#D41367] bg-white px-6 shadow-sm">

                        <input
                            type="text"
                            placeholder="חפש מוצר"
                            className="w-full bg-transparent text-right text-[20px] font-bold text-black outline-none placeholder:text-[#000000]"
                        />

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="h-9 w-9 text-black"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        </div>
                    </div>

                    {/* LEFT BRAND */}
                    <div className="flex justify-center mb-[10px] lg:block">
                        <div className="w-[150px] lg:w-[220px] h-[72px] flex justify-end items-end lg:justify-end lg:items-center">
                            <a href="#">
                                <Image
                                src="/leftsidelogo.webp"
                                alt="left logo"
                        width={440}
                            height={140}
                            priority
                            unoptimized
                            className="h-[38px] lg:mb-[0px] lg:h-[70px] w-auto object-contain"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* CATEGORY BAR */}
            <section className="relative z-2 bg-[#D41A68] px-6 py-[17px] rounded-b-[6px]">
               <div className="mx-auto flex gap-3 overflow-x-auto pb-2 lg:grid lg:max-w-[1360px] lg:grid-cols-7 lg:gap-[18px]">

                    {categories.map((item, index) => {

                    const count = products.filter(
                        (product) => product.category === item.title
                    ).length;

                    const isActive = selected === item.title;

                    return (
                        <button
                        key={index}
                        onClick={() =>
                            setSelected(
                                selected === item.title
                                ? "בחירה"
                                : item.title
                            )
                         }
                        className={`min-w-[31%] shrink-0 rounded-xl px-2 py-3 lg:min-w-0 lg:px-3 lg:py-2 rounded-xl px-2 py-3 lg:px-3 lg:py-2 text-center shadow-sm transition-all duration-200 cursor-pointer ${
                            isActive
                            ? "bg-[#46BAB9]"
                            : "bg-[#f5f5f5] hover:bg-[#46BAB9]"
                        }`}
                        >
                        <h3
                    className={`text-[12px] lg:text-[17px] leading-[16px] font-bold transition-colors duration-200 ${
                    isActive
                        ? "text-white"
                        : "text-black group-hover:text-white"
                    }`}
                >
                    {item.title}
                </h3>

                        <div
                    className={`mx-auto mt-1 flex h-[19px] w-[35px] items-center justify-center rounded-full text-[13px] leading-[16px] font-bold transition-all duration-200 ${
                    isActive
                        ? "bg-white text-[#46BAB9]"
                        : "bg-[#D41A68] text-white group-hover:bg-white group-hover:text-[#D41A68]"
                    }`}
                >
                    {count}
                </div>
                        </button>
                    );
                    })}
                </div>
            </section>
        </section>

        {/* Body aria */}
        <section className="px-10 py-12 pt-[16px] bg-[#F5CA5F]">

            {/* Shorts options */}
            <div className="relative mx-auto max-w-[1200px] mb-[60px] flex justify-end">

                <button
                        onClick={() => setSortOpen(!sortOpen)}
                        className="group flex h-[50px] min-w-[145px] cursor-pointer items-center justify-between rounded-full border border-[#D41A68] bg-white px-6 shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-[#D41A68]"
                    >

                        {/* TEXT */}
                        <span className="text-[20px] font-normal leading-[17px] text-[#D41A68] transition-all duration-300 group-hover:text-white">
                        {selectedSort}
                        </span>

                        {/* ICON */}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-[#D41A68] ml-[-15px] transition-all duration-300 group-hover:text-white ${
                            sortOpen ? "rotate-180" : ""
                        }`}
                        >
                        <path d="m6 9 6 6 6-6" />
                        </svg>

                </button>

                {/* DROPDOWN */}
                {sortOpen && (
                        <div className="absolute left-0 top-[0px] z-12 w-[300px] rounded-[10px] bg-[#D41A68] p-4 shadow-2xl">

                            {/* POPUP HEADER */}
                                <div className="mb-6 flex items-center justify-between ">

                                {/* TITLE */}
                                <h2 className="text-[20px] font-regular text-white">
                                    בחירה
                                </h2>

                               {/* CLOSE / COLLAPSE BUTTON */}
                                <button
                                onClick={() => setSortOpen(false)}
                                className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center transition-all duration-300 hover:scale-110"
                                >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="46"
                                    height="32"
                                    viewBox="0 0 17 17"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="rotate-180"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                                </button>
                                </div>

                        <div className="flex flex-col gap-5">

                            {sortOptions.map((item) => {

                            const active = selectedSort === item;

                            return (
                                <button
                                key={item}
                                onClick={() => {
                                    setSelectedSort(item);
                                    setSortOpen(false);
                                }}
                                className={`cursor-pointer rounded-full border-[1px] px-6 py-3 text-center text-[20px] font-bold transition-all duration-200 ${
                                    active
                                    ? "border-[#46BAB9] bg-[#46BAB9] text-white"
                                    : "border-[#46BAB9] bg-[#F3F3F3] text-black hover:bg-[#46BAB9] hover:text-white"
                                }`}
                                >
                                {item}
                                </button>
                            );
                            })}
                        </div>
                        </div>
                )}
            </div>

             {/* products loop */}
            <div className="mx-auto grid items-stretch max-w-[1200px] grid-cols-1 gap-y-[40px] gap-x-[96px] md:grid-cols-2 xl:grid-cols-3">

            {filteredProducts.map((product) => (

                <div key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className=" group relative
                    overflow-hidden
                    p-[6px]
                    transition-all
                    cursor-pointer
                    duration-300">
                        {/* HOVER BORDER */}
                    <div
                        className="
                        absolute
                        inset-0
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                    "
                    >
                        <Image
                        src="/hover-border.png"
                        alt="border"
                        fill
                        className="object-fill"
                        />
                    </div>
               <div className="relative z-10 flex h-full flex-col bg-white px-[25px] pb-10 pt-8">
                {/* TOP */}
                <div className=" flex items-start justify-end">
                    <div className="absolute right-0 top-[34px] rounded-tl-full rounded-bl-full bg-[#57c8c7] px-3 py-1 text-[13px] font-medium text-white">
                    {product.category}
                    </div>

                    <div className="ml-[-14px] relative">
                        <Image
                        src={product.brand_image}
                        alt={product.title}
                         width={440}
                        height={140}
                        priority
                        unoptimized
                        className="h-[50px] w-auto object-contain"
                    />
                    </div>
                </div>

                {/* IMAGE */}
                <div className="relative mx-auto mb-2 h-[250px] w-full max-w-[300px]">

                    <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                    />
                </div>

                {/* TITLE */}
                <h2 className="whitespace-pre-line mb-3 text-center text-[20px] font-black leading-[20px] text-[#D41A68]">
                    {product.title}
                </h2>

                {/* INFO */}
                <div className="relative flex-1">
                <p className="whitespace-pre-line text-center text-[13px] leading-[16px] leading-[20px] font-medium text-black">
                    {product.info}
                </p>
                </div>
                <p className="mt-2 text-center text-[12px] leading-[22px] font-medium text-black">
                {   product.tags.join(" | ")}
                </p>

                {/* product sku */}
                 <p className="mt-2 text-center text-[12px] leading-[22px] font-medium text-black">
                    מק”ט {product.sku}
                </p>
                {/* product buttom */}
                <p
                    // href={`/products/${product.slug}`}
                    className="cursor-pointer mx-auto mt-1 flex h-[40px] max-w-[161px] items-center justify-center rounded-full bg-[#D41A68] px-8 text-center text-[18px] font-black leading-[20px] text-white transition-all duration-200 hover:opacity-90"
                    >
                    צפה במוצר
                </p>
                    </div>
                </div>
            ))}
            </div>
        </section>

        {/* products popup */}
        {selectedProduct && (
            <div className="fixed inset-0 z-[9999] bg-black/70 p-2 md:p-5">

            {/* SCROLL WRAPPER */}
            <div className="flex h-full items-start justify-center overflow-y-auto">

                {/* POPUP */}
                <div className="my-4 flex w-full max-w-[1260px] flex-col overflow-hidden rounded-[24px] bg-[#F7F7F7] shadow-2xl max-h-[95vh]">

                {/* HEADER */}
                <div className="sticky top-0 z-50 bg-[#45C3C3] px-5 pb-4 pt-5 text-right text-white md:px-8">

                    {/* CLOSE */}
                    <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute left-3 top-3 z-50 flex h-[45px] w-[45px] items-center justify-center text-white transition-all duration-300 hover:rotate-90"
                    >
                    <span className="text-[52px] leading-none">×</span>
                    </button>

                    <h2 className="pr-12 text-[24px] font-bold leading-[16px] text-black md:text-[42px] md:leading-[46px]">
                    {selectedProduct?.title ||
                        "מתתק בטעמי תות שדה ואוכמניות"}
                    </h2>

                    <p className="mt-2 pr-12 text-[22px] font-medium leading-[28px] md:text-[33px]">
                    {/* {selectedProduct?.weight || "700 גרם"} |{" "} */}
                    
                    {selectedProduct?.brand || "YAMMS"}
                    </p>
                </div>

                    {/* BODY */}
                    <div className="overflow-y-auto p-3 md:p-5">

                        {/* TOP SECTION */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[60%_38%]">

                        {/* CONTENT SIDE - RIGHT */}
                        <div className="order-2 md:order-1 min-w-0 border border-[#D41A68] bg-white px-4 pl-20 text-right">

                            {/* BRAND */}
                            <div className="border-b-[2px]  border-[#46BAB9] pb-2">

                            <p className="text-[20px] md:text-[26px] font-regular text-[#D41A68]">
                                מותג
                            </p>

                            <p className="mt-1 break-words text-[22px] leading-[24px] md:text-[26px] md:leading-[28px] font-medium">
                                {selectedProduct?.brand || "SCREAMERS"}
                            </p>
                            </div>

                            {/* Info */}
                            <div className="border-b-[2px] border-[#46BAB9] py-2">

                            <p className="text-[20px] md:text-[26px] font-regular text-[#D41A68]">
                                    גרם ואיזו
                                </p>

                           <p className="mt-1 break-words text-[22px] leading-[24px] md:text-[26px] md:leading-[28px] font-medium">
                                {selectedProduct?.info ||
                                '14 גרם יח׳ 50 במארז | משקל כולל 700 גרם'}
                            </p>
                            </div>

                            {/* SKU */}
                            <div className="border-b-[2px]  border-[#46BAB9] py-2">

                                <div className="flex items-start justify-between gap-4">

                                    <div className="text-right">

                                    <p className="text-[20px] md:text-[26px] font-regular text-[#D41A68]">
                                        מק״ט
                                    </p>

                                    <p className="mt-1 break-words text-[22px] leading-[24px] md:text-[26px] md:leading-[28px] font-medium">
                                        {selectedProduct?.sku ||
                                        "000000000000"}
                                    </p>
                                    </div>

                                    <div className="shrink-0 pt-2">

                                    <Image
                                        src={
                                        // selectedProduct?.barcode ||
                                        "/barcode.png"
                                        }
                                        alt="barcode"
                                        width={140}
                                        height={50}
                                        className="h-auto object-contain"
                                    />
                                    </div>
                                </div>
                            </div>

                            {/* KOSHER */}
                            <div className="border-b-[2px] border-[#46BAB9] py-2">
                                <p className="text-[20px] md:text-[26px] font-regular text-[#D41A68]">
                                    כשרות
                                </p>

                                <p className="mt-1 break-words text-[22px] leading-[24px] md:text-[26px] md:leading-[28px] font-medium">
                                    {selectedProduct?.tags ||
                                    'בד״צ בית יוסף בד״צ בעלזא "כשר פרווה'}
                                </p>
                            </div>

                            {/* COUNTRY */}
                            <div className="border-b-[2px] border-[#46BAB9] py-2 mb-6">

                                <p className="text-[20px] md:text-[26px] font-regular text-[#D41A68]">
                                    ארץ ייצור
                                </p>

                                {/* <p className="mt-1 break-words text-[22px] leading-[24px] md:text-[26px] md:leading-[28px] font-medium">
                                    {selectedProduct?.country || "סין"}
                                </p> */}
                            </div>
                        </div>

                       {/* IMAGE SIDE - LEFT */}
                       <div className="order-1 md:order-2 min-w-0 border border-[#D41A68] relative bg-white p-4">  
                        {/* BRAND LOGO */}  
                        <div className="mb-4 abslute left-0 top-0 flex justify-end">    
                            <Image      
                            src={
                                selectedProduct?.brand_image || 
                                "/logo.png"      
                                }      
                                alt="brand"      
                                width={300}      
                                height={120}      
                                className="h-auto max-h-[70px] w-auto object-contain"    
                                />  
                                </div>  
                                {/* PRODUCT IMAGE */}  
                                <div className="relative mx-auto h-[260px] w-full max-w-[340px] overflow-hidden md:h-[380px]">    
                                    {galleryImages.map((img: string, index: number) => ( 
                                             <Image       
                                              key={index}       
                                            src={img}        
                                            alt={`gallery-${index}`}        
                                            fill   
                                            unoptimized     
                                            className={`absolute inset-0 object-contain transition-all duration-700 ${          
                                                activeImage === index            
                                                ? "opacity-100 scale-100"            
                                                : "opacity-0 scale-95"        
                                                }`}      
                                                />    
                                                ))}  
                                                </div>  
                                                {/* DOTS */}  
                                                <div className="mt-5 flex justify-center gap-4">   
                                                     {galleryImages.map((_: any, index: number) => (     
                                                         <button        
                                                         key={index}        
                                                         onClick={() => setActiveImage(index)}        
                                                         className={`h-5 w-5 rounded-full border-2 border-[#EC1974] transition-all duration-300 ${          
                                                            activeImage === index            
                                                            ? "bg-[#EC1974] scale-110"            
                                                            : "bg-white"        
                                                            }`}      
                                                            />   
                                                             ))}  
                                                             </div>
                                                             </div>

                        </div>

                        {/* FAQ */}
                        <div className="mt-4 space-y-3" dir="rtl">
                        {faqItems.map((item, index) => {
                            const isOpen = openFaq === index;

                            return (
                            <div
                                key={index}
                                className="overflow-hidden"
                            >
                                <button
                                type="button"
                                onClick={() =>
                                    setOpenFaq(isOpen ? null : index)
                                }
                                className="flex gap-2 w-full items-center justify-start bg-gradient-to-r from-[#4CC7C7] to-[#ffffff] px-2 py-5 text-right"
                                >
                                     <svg
                                    className={`h-9 w-9 shrink-0 text-[#D41A68] transition-all duration-500 ease-in-out ${
                                    isOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                    />
                                </svg>

                               <h2
                                className="text-right text-[20px] font-bold leading-none text-[#D41A68] md:text-[30px] lg:leading-[20px] lg:text-[43px]"
                                    dangerouslySetInnerHTML={{
                                        __html: item.title,
                                    }}
                                    />
                               
                                </button>

                                <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                    isOpen
                                    ? "max-h-[400px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                                >
                                <div className="bg-white px-5 py-5 text-right text-[16px] leading-[30px] text-black md:text-[18px] md:leading-[34px]">
                                    {item.content}
                                </div>
                                </div>
                            </div>
                            );
                        })}
                        </div>

                        {/* FOOTER */}
                        <div className="mt-6 border-t-[4px] border-[#4CC7C7] pt-5 text-center">

                        <p className="text-[13px] leading-[24px] text-black md:text-[16px] md:leading-[30px]">
                            הנתונים המדויקים מופיעים על גבי המוצר, אין להסתמך על
                            הפירוט המופיע באתר, ייתכנו טעויות או אי התאמות.
                            יש לקרוא את המופיע על גבי אריזת המוצר לפני השימוש.
                            התמונות והתאריכים המופיעים הינם להמחשה בלבד ואין
                            להסתמך עליהם.
                        </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            )}
    </main>
    // popup product
    
  );
  
  
}
