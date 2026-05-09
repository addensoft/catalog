"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";


// categories
const categories = [
  { title: "ממתקי ילדים" },
  { title: "ממתקים במשקל" },
  { title: "מסטיקים" },
  { title: "מסטיקים וג’ליבינס" },
  { title: "סוכריות גומי" },
  { title: "שוקולדים" },
  { title: "שתייה וליקריצים" },
];

// filters
const filters = [
  "ממתקי ילדים",
  "מסטיקים",
  "מסטיקים וג’ליבינס",
];

// products
const products = [
  {
    id: 1,
    category: 'ממתקי ילדים',
    title: "סורצ'ה בטעם תות שדה ודובדבן",
    info: "90 מ”ל יח’ | 12 יח’ במארז | 8 מארזים בקרטון \n משקל קרטון 8.64 ק”ג",
    image: "/products/product-1.png",
    brand_image:"/brands/scamers.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "SCREAMERS",
    tags: [
        "כשר פרווה",
        "בד”צ בית יוסף",
    ],
    sku:"5011061107152",
  },
  {
    id: 2,
    category: "ממתקי ילדים",
    title: "SWEET&SOUR\n ממתק בטעמי תות ואוכמניות",
    info: "14 גרם יח’  | 50 יח’ במארז  | 6 מארזים בקרטון \n משקל קרטון 4.2 ק”ג",
    image: "/products/product-2.png",
    brand_image:"/brands/yaams.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "YAMMS",
    tags: [
        "כשר פרווה",
        "בד”צ בית יוסף",
        "בד”צ בלע”ז",
    ],
    sku:"000000000000",
  },
  {
    id: 3,
    category: "ממתקי ילדים",
    title: "SWEET&SOUR\n ממתק בטעמי תות ואוכמניות",
    info: "114 גרם יח’  | 8 יח’ במארז  | 20 מארזים בקרטון\n משקל קרטון 2.24 ק”ג",
    image: "/products/product-3.png",
    brand_image:"/brands/yaams.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "YAMMS",
    tags: [
        "כשר פרווה",
        "בד”צ בית יוסף",
        "בד”צ בלע”ז",
    ],
    sku:"6921823510573",
  },
  {
    id: 4,
    category: "ממתקי ילדים",
    title: "BIG LICK \n ג’לי נוזלי בטעם אוכמניות חמוץ",
    info: "60 מ”ל יח’ | 12 יח’ במארז | 6 מארזים בקרטון \n משקל קרטון 4.32 ק”ג",
    image: "/products/product4.png",
    brand_image:"/brands/scamers.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "SCREAMERS",
    tags: [
        "כשר פרווה",
        "בד”צ בית יוסף",
    ],
    sku:"5011061105066",
  },
  {
    id: 5,
    category: "ממתקי ילדים",
    title: "BIG LICK \n ממתק ג’לי נוזלי בטעם פטל חמוץ",
    info: "60 מ”ל יח’ | 12 יח’ במארז | 6 מארזים בקרטון \n משקל קרטון 4.32 ק”ג",
    image: "/products/product5.png",
    brand_image:"/brands/scamers.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "SCREAMERS",
    tags: [
        "כשר פרווה",
        " בד”צ בית יוסף",
    ],
    sku:"5011061105042",
  },
  {
    id: 6,
    category:"ממתקי ילדים",
    title: "סוכריות קשיחות בצורת בריקים",
    info: " 70 גרם יח’ | 10 יח’ במארז | 6 מארזים בקרטון \n משקל קרטון 4.2 ק”ג", 
    image: "/products/product6.png",
    brand_image:"/brands/zed.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "ZED",
    tags: [
        "כשר פרווה",
        "| בד”צ בית יוסף",
    ],
    sku:"5011061166661",
  },
  {
    id: 7,
    category: "ממתקי ילדים",
    title: "NIPPERS \n סוכריות קראנץ’ בטעמי פירות",
    info: "10 גרם יח’ | 24 יח’ במארז | ? מארזים בקרטון \n משקל קרטון ? ק”ג",
    image: "/products/product7.png",
    brand_image:"/brands/scamers.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "SCREAMERS",
    tags: [
        "כשר פרווה",
        " בד”צ בית יוסף",
    ],
    sku:"5011061107718",
  },
   {
    id: 8,
    category:"מסטיקים וג’ליבינס",
    title: "גומי לעיסה בטעמי פירות \n עם מילוי אבקה 5%",
    info: "19.6 גרם  יח’ | 50  יח’ במארז | ? מארזים בקרטון \n משקל קרטון ? ק”ג",
    image: "/products/product8.png",
    brand_image:"/brands/zed.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "ZED",
    tags: [
        "כשר פרווה",
       "בד”צ בית יוסף",
    ],
    sku:"5011061114105",
  },
  {
    id: 9,
    category:"מסטיקים וג’ליבינס",
    title: "מכונת מיני מסטיק",
    info: " 20 גרם יח’ | 12 יח’ במארז | 6 מארזים בקרטון \n משקל קרטון 1.44 ק”ג",
    image: "/products/product9.png",
    brand_image:"/brands/zed.png",
    slug: "sweet-sour-strawberry-blueberry",
    brand: "ZED",
    tags: [
        "כשר פרווה",
       "בד”צ בית יוסף",
    ],
    sku:"5011061007537",
  },
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

// short options
const sortOptions = [
  "תאריך (מחדש לישן)",
  "תאריך (מישן לחדש)",
  "מחיר (מזול ליקר)",
  "מחיר (מיקר לזול)",
  "מותג",
  "שם (א-ת)",
];






export default function CatalogPage() {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("בחירה");

        // short option const
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("סדר לפי");

    // special filter of dropdown
    const [selectedCategory, setSelectedCategory] = useState("all");


    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedKosher, setSelectedKosher] = useState<string[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [selectedSpecial, setSelectedSpecial] = useState<string[]>([]);

    const handleSelect = (value: string) => {
        setSelected(value);
        setOpen(false);
    };

    // filter toggle 
    const toggleFilter = (
        value: string,
        selectedArray: string[],
        setFunction: React.Dispatch<React.SetStateAction<string[]>>
        ) => {
        if (selectedArray.includes(value)) {
            setFunction(selectedArray.filter((item) => item !== value));
        } else {
            setFunction([...selectedArray, value]);
        }
        };

        // all filters filters
      const filteredProducts = products.filter((product) => {

        const categoryMatch =
            selected === "בחירה" ||
            product.category === selected;

        const brandMatch =
            selectedBrands.length === 0 ||
            selectedBrands.includes(product.brand);

        const kosherMatch =
            selectedKosher.length === 0 ||
            selectedKosher.includes(product.kosher);

        const dietaryMatch =
            selectedDietary.length === 0 ||
            selectedDietary.includes(product.dietary);

        const specialMatch =
            selectedSpecial.length === 0 ||
            selectedSpecial.includes(product.special);

        return (
            categoryMatch &&
            brandMatch &&
            kosherMatch &&
            dietaryMatch &&
            specialMatch
        );
        });

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5CA5F]">

        <section className="sticky top-0 z-50 bg-[#ffffff] px-[1px] pt-0 pb-[2px]">
            {/* TOP HEADER */}
            <header className="bg-[#ffffff] max-w-[1400px] mx-auto px-2 lg:px-6 pt-[12px] lg:pt-[32px] pb-0 bg-[url('/mobile-header-bg.svg')] bg-cover bg-top bg-no-repeat lg:bg-none">
                <div className="mx-auto flex max-w-[1600px] lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    {/* RIGHT LOGO AREA */}
                    <div className="flex w-full items-baseline lg:items-center justify-start lg:justify-between pb-0 lg:w-auto lg:pb-0">
                        <div className="text-right leading-none">
                            <div className="relative z-1 lg:mb-[-40px] mb-[-24px] mr-[-30px] duration-300 hover:-translate-y-[8px] hover:rotate-[8deg]">
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
                              
                                {/* SECTION */}
                                <div className="mb-3 flex items-center gap-4">

                                <h3 className="min-w-[180px] text-right text-[25px] font-medium text-[#D41A68]">
                                    סינון לפי כשרות
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {[
                                    "רבנות",
                                    "בד”צ בית יוסף",
                                    "בד”צ העדה החרדית",
                                    "בד”צ בלע”ז",
                                    "כשל”פ",
                                    ].map((item) => (
                                    <button
                                    onClick={() =>
                                        toggleFilter(
                                            item,
                                            selectedKosher,
                                            setSelectedKosher
                                        )
                                    }
                                    className={`cursor-pointer rounded-[12px] border border-[#D41A68] px-2 py-2 leading-[16px] text-[24px] font-medium transition-all duration-200 ${
                                        selectedKosher.includes(item)
                                            ? "bg-[#F5CA5F] text-black"
                                            : "bg-white text-black hover:bg-[#D41A68] hover:text-white"
                                        }`}
                                    >
                                        {item}
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
                                    {["YAMMS", "TRILU", "TRINI TARIO", "SCREAMERS","ZED",].map((item) => (
                                    <button
                                    onClick={() =>
                                        toggleFilter(
                                            item,
                                            selectedBrands,
                                            setSelectedBrands
                                        )
                                    }
                                        className={`cursor-pointer rounded-[12px] border border-[#D41A68] px-2 py-2 leading-[16px] text-[24px] font-medium transition-all duration-200 ${
                                        selectedBrands.includes(item)
                                            ? "bg-[#F5CA5F] text-black"
                                            : "bg-white text-black hover:bg-[#D41A68] hover:text-white"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                    ))}
                                </div>
                                </div>

                                {/* SPECIAL */}
                                <div className="mb-3 flex items-center gap-4">

                                <h3 className="min-w-[180px] text-right text-[25px] font-medium text-[#D41A68]">
                                    סינון לפי העדפה תזונתית
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {["טבעוני", "פרווה", "ללא גלוטן", "ללא סוכר"].map((item) => (
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
                                setSelectedKosher([]);
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
                    <div className="flex justify-center lg:block">
                        <div className="w-[150px] lg:w-[220px] h-[72px] flex justify-end items-end lg:justify-start lg:items-center">
                            <a href="#">
                                <Image
                                src="/leftsidelogo.png"
                                alt="left logo"
                        width={440}
                            height={140}
                            priority
                            unoptimized
                            className="h-[38px] mb-[2px] lg:mb-[0px] lg:h-[70px] w-auto object-contain"
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
                        <div className="absolute left-0 top-[0px] z-5 w-[300px] rounded-[10px] bg-[#D41A68] p-4 shadow-2xl">

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
            <div className="mx-auto grid items-stretch max-w-[1200px] grid-cols-1 gap-y-[40px] gap-x-[105px] md:grid-cols-2 xl:grid-cols-3">

            {filteredProducts.map((product) => (
                <div key={product.id} className=" group relative
                    overflow-hidden
                    p-[6px]
                    transition-all
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
                        className="object-cover"
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
                    {product.weight}
                </p>
                <p className="mt-2 text-center text-[12px] leading-[22px] font-medium text-black">
                {   product.tags.join(" | ")}
                </p>

                {/* product sku */}
                 <p className="mt-2 text-center text-[12px] leading-[22px] font-medium text-black">
                    מק”ט {product.sku}
                </p>
                {/* product buttom */}
                <Link
                    href={`/products/${product.slug}`}
                    className="cursor-pointer mx-auto mt-1 flex h-[40px] max-w-[161px] items-center justify-center rounded-full bg-[#D41A68] px-8 text-center text-[18px] font-black leading-[20px] text-white transition-all duration-200 hover:opacity-90"
                    >
                    צפה במוצר
                </Link>
                    </div>
                </div>
            ))}
            </div>
        </section>
    </main>
  );
}