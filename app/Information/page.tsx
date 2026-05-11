"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function InformationPage() {

  return (
    <main>
    <section className="relative overflow-hidden bg-[#F7E8B7] max-w-[1440px] mx-auto pb-24">

  {/* TOP CURVES */}
  <div className="absolute left-0 top-0 z-21 w-full">
    <Image
      src="/top-curves.png"
      alt="top curves"
      width={1440}
      height={320}
      priority
      className="h-auto w-full"
    />
  </div>

  {/* LOGO */}
  <div className="absolute right-4 top-4 z-30 md:right-20 md:top-0">
    <Image
      src="/logoinformatio.png"
      alt="logo"
      width={150}
      height={150}
      priority
      className="h-auto w-[90px] md:w-[140px]"
    />
  </div>

  {/* BACK BUTTON */}
  <Link
    href="/catalog"
    className="
      absolute
      left-4
      top-6
      z-30
      flex
      items-center
      gap-3
      rounded-full
      bg-white
      px-5
      py-2
      text-[22px]
      font-bold
      text-[#56C7C7]
      shadow-lg
      transition-all
      duration-300
      hover:scale-105
      md:left-8
    "
  >
    לקטלוג

    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </Link>

  {/* CONTENT */}
  <div className="relative z-20 mx-auto max-w-[1440px] px-0 pt-[0px] text-center">

   

    {/* WHITE TOP BLOB */}
    <div className="relative mx-auto max-w-[1440px]">
 {/* TITLE */}
   
      <Image
        src="/white-blob.png"
        alt="blob"
        width={1440}
        height={600}
        priority
        className="absolute right-0 left-auto top-[85px] inset-2 z-0 h-full  object-fill"
      />
 <h1
      className="
        mb-0
        pt-30
        text-[38px]
        font-black
        leading-none
        text-[#B3125D]
        drop-shadow-[0_4px_0_rgba(255,255,255,0.6)]
        md:text-[32px]
      "
    >
      לקוחות ושותפים יקרים
    </h1>
      <div className="relative z-10 pt-2 md:px-20">

        <p className="mx-auto max-w-[450px] text-[12px] font-bold leading-[22px] text-black md:text-[20px] md:leading-[22px]">
          אנחנו יודעים מי אתם. אנחנו יודעים שמאחורי כל חנות,
          רשת או עסק מצליח עומדים אנשים שקמים מוקדם,
          עובדים קשה ומקבלים החלטות יומיומיות מתוך אחריות
          אמיתית לפרנסה וללקוחות שלהם.
        </p>

        <p className="mt-2 mx-auto max-w-[450px] text-[14px] font-bold leading-[34px] text-[#D41A68] md:text-[14px] md:leading-[22px]">
          חברת יבואני הממתקים נולדה מתוך השטח ומתוך חיבור אמיתי לעולם הקמעונאות.
          כשהשלם משה דוד ובראל הקימו את החברה המטרה הייתה ברורה:
          להיות שותף שאפשר לסמוך עליו.
        </p>

      </div>
    </div>

    {/* SECOND TITLE */}
    <h2
      className="
        mt-16
        text-[40px]
        font-black
        leading-none
        text-[#D41A68]
        md:text-[76px]
      "
    >
      איכות, בחירה וערך
    </h2>

    {/* SECOND TEXT */}
    <p className="mx-auto mt-8 max-w-[950px] text-[18px] font-bold leading-[38px] text-black md:text-[30px] md:leading-[52px]">
      אנחנו לא רק מביאים ממתקים אלא בוחרים אותם אחד אחד בקפידה.
      אנחנו טועמים, בודקים ומביאים את המוצרים המובילים
      בעולם כדי להביא אליכם את המוצרים האיכותיים ביותר.
    </p>

  </div>

  {/* COW */}
  <div className="absolute bottom-[160px] right-0 z-20">
    <Image
      src="/cow.png"
      alt="cow"
      width={500}
      height={800}
      priority
      className="h-auto w-[180px] md:w-[340px]"
    />
  </div>

  {/* FACTORY IMAGE */}
  <div className="relative z-20 mx-auto mt-20 max-w-[900px] px-4">

    <div className="relative overflow-hidden rounded-[60px]">

      <Image
        src="/factory-blob.png"
        alt="blob"
        width={1200}
        height={900}
        priority
        className="absolute inset-0 z-0 h-full w-full object-fill"
      />

      <Image
        src="/factory.jpg"
        alt="factory"
        width={1200}
        height={700}
        priority
        className="
          relative
          z-10
          h-auto
          w-full
          rounded-[50px]
          object-cover
        "
      />

    </div>

  </div>

  {/* BOTTOM CURVES */}
  <div className="absolute bottom-0 left-0 z-0 w-full">
    <Image
      src="/bottom-curves.png"
      alt="bottom curves"
      width={1920}
      height={220}
      priority
      className="h-auto w-full"
    />
  </div>

</section>
    </main>
  );

}