"use client";
import Image from "next/image";
import Link from "next/link";

export default function CustomersPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen w-full"
      style={{ 
         backgroundImage: "url('/mian-about-bg.webp')",
        backgroundSize: "cover",
    }}
    >

      {/* ── HEADER ── */}
      <header className="relative flex items-baseline justify-between px-5 py-4 lg:px-10 lg:py-6 relative z-2 min-h-[215px]"
         style={{ 
        backgroundImage: "url('/frame-187.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
    }}
      >

        {/* Logo — top right */}
        <div className="flex items-center">
          <Link
           href="/"
          className=""
        >
          <Image
            src="/logo-home.png"
            alt="יבואני הממתקים"
            width={340}
            height={100}
            className="h-[108px] w-auto object-contain lg:h-[170px] absolute top-[0]"
            priority
            unoptimized
          />
           </Link>
        </div>

        {/* Back button — top left (in RTL this is on the left visually) */}
        <Link
          href="/catalog"
          className="flex items-center gap-3 rounded-full bg-white px-9 py-1 text-[16px] font-[600] text-[#43B9B9] shadow-md transition-all duration-200 hover:bg-[#D41A68] hover:text-white lg:px-6 lg:pr-[16px] lg:py-2 lg:text-[20px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="rotate-180">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          לקטלוג
        </Link>

      </header>

      {/* ── SECTION 1: Hero / Intro ── */}
      <section className="px-6 pb-10 pt-6 text-center lg:pb-16 lg:pt-[95px] relative z-1 mt-[-200px]" 
      style={{ 
        backgroundImage: "url('/white-corve.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center top",
    }}
      >
        <div className=" max-w-[725px] mx-auto ">
        <h1 className="mb-6 text-[32px] font-black leading-[1.2] text-[#D41A68] lg:text-[52px] min-h-[50px]"
        style={{ 
        backgroundImage: "url('/heading.webp')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center top",
    }}
        
        >
        
        </h1>

        <p className="mb-8 text-[15px] font-medium leading-[26px] text-black lg:text-[19px] lg:leading-[30px]">
          אנחנו יודעים מי אתם. אנחנו יודעים שמאחורי כל לקוח, רשת או עסק מצליח עומדים אנשים
          שמקדישים מזמנם, ממרצם ומנסיונם לנהל עסקים קטנים ובינוניים וסוחרים הממוקדים בפרנסת
          ולקוחות שלהם. אנחנו יודעים שהדרך לא תמיד פשוטה ושכל הצלחה שלכם בבנייה בהתמדה
          ובעשר אצבעות.
          <br />
          אנחנו יודעים את זה כי אנחנו בדיוק כמוכם.
        </p>

        {/* Highlighted italic paragraph */}
        <div className="text-center text-[16px] leading-[24px] lg:text-[24px] lg:leading-[30px] font-regular text-[#C10051]">
          <p>
            חברת יבואני הממתקים נולדה מתוך השטח ומתוך{" "}
            <span className="font-bold">חיבור אמיתי</span>{" "}
            לעולם הקמעונאות. כשאבשלום משה ודוד ברוכאל הקימו את החברה המרכז הייתה
            ברורה: להיות{" "}
            <span className="font-bold">שותף שאפשר לסמוך עליו</span>
            . שותף שכבד עבודה קשה, מבין
            את גודל האחריות ויודע שבסוף היום כולנו כאן כדי לספק{" "}
            <span className="font-bold">ממתקים שעושים</span>
            {" "}<span className="font-bold">שמח</span>{" "}
            כל בהמד.
          </p>
        </div>
        </div>
      </section>

      {/* ── SECTION 2: Quality — text + cow mascot ── */}
      <section className="mx-auto max-w-[725px] text-center px-6 py-10 lg:py-16">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">

          {/* Text — right side in RTL */}
          <div className="order-2 flex-1 text-center lg:order-1">
            <h2 className="mb-1 text-[28px] font-bold leading-[1.3] text-[#D41367] lg:text-[50px]">
              איכות, בחירה וערר
            </h2>
            <p className="text-[15px] font-regular leading-[28px] text-black lg:text-[22px] lg:leading-[34px]">
              אנחנו לא רק מביאים ממתקים אלא{" "}
              <span className="font-bold text-[#D41367]">בוחרים אותם אחד אחד בקפידה</span>
              . אנחנו טועסים, בודקים וטועמים מוצרים בכל העולם כדי להביא אליכם את הטירנים
              המובילים מאירופה, מאסיה ומרחבי הגלובוס. כל מוצר שבחנו לקסלקם זכה נבחר
              מתוך מחשבה עליכם, על המדף שלכם ועל{" "}
              <span className="font-bold text-[#D41367]">הרווחיות שלכם</span>
              . הכל נגשה
              בסטנדרטים הגבוהים ביותר של איכות ו
              <span className="font-bold text-[#D41367]">גשרות מוקפדת</span>{" "}
              מתוך מחויבות עמוקה לשוק הישראלי.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Truck photo with blob ── */}
      <section className="relative mx-auto mb-10 px-4 lg:mb-6 lg:px-6 ml-[-25px] mr-[-25px] mt-[-300px]">
                <div className="relative w-full lg:h-[1100px]">
                    <Image
                    src="/truck.svg"
                    alt="משאיות יבואני הממתקים"
                    fill
                    className="object-cover"
                    onError={(e) => {
                        // fallback if image doesn't exist
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                    unoptimized
                    />

          </div>
      </section>

      {/* ── SECTION 4: Professional family company ── */}
      <section className="mx-auto max-w-[800px] px-6 pb-10 pt-2 text-center lg:pb-16">
        <h2 className="mb-6 text-[28px] font-medium leading-[1.3] text-[#D41367] lg:text-[56px] lg:leading-[60px]">
          מקצועות של חברה גדולה עם
          <br />
          יחס של משפחה
        </h2>
        <p className="text-[15px] font-regular leading-[28px] text-black lg:text-[22px] lg:leading-[32px]">
          מהמרכז הלוגיסטי המתקדם שלנו בצפון אנחנו מפעילים מערך הפצה מקצועי שמגיע
          לאפרי נקודות מכירה בכל הארץ. עברנו כל לשלות שיאיו{" "}
          <span className="font-bold text-[#D41A68]">בזמן וכדיוק</span>{" "}
          הוא הבנחה
          שקופים. אנחנו לא מחפשים עסקאות קצרות אלא בלא בנים{" "}
          <span className="font-bold text-[#D41A68]">מערכות יחסים ארוכות</span>
          {" "}<span className="font-bold text-[#D41A68]">טווח</span>{" "}
          המבוססות על אמון. נאמנו וישרות אמיתי שעושה פשוט{" "}
          <span className="font-bold text-[#D41A68]">שמח לעבוד יחד</span>.
        </p>
      </section>

      {/* ── SECTION 5: Warehouse photo with blob ── */}
      <section className="relative mx-auto mb-10 mr-[-25px]">
          <div className="relative h-[240px] max-w-[1300px] lg:h-[800px] text-right">
            <Image
              src="/whearhouse.svg"
              alt="מחסן יבואני הממתקים"
              fill
              className="object-contain overflow-visible"

              unoptimized
            />
        
          </div>
      </section>

      {/* ── SECTION 6: עסק עם נשמה ── */}
      <section className="">
        <div className="mx-auto max-w-[720px]">
          {/* Text block */}
          <div className="flex-1 text-center">
            <h2 className="mb-2 text-[28px] font-[600] leading-[1.3] text-[#D41A68] lg:text-[50px]">
              עסק עם נשמה
            </h2>
           
            <p className="mb-6 text-[15px] font-regular leading-[28px] text-black lg:text-[22px] lg:leading-[32px] text-center">יבואני הממתקים היא <strong className="font-black text-[#D41A68]">חברה עם לב.</strong>אנחנו גאים בצוות שלנו הכולל עובדים יקרים בעלי מוגבלויות כחלק מתפיסה של נתינה וערבות הדדית. אצלנו הצלחה אמיתית לא נמדדת רק במספרים אלא בטוב שאנחנו עושים יחד ובחיוך שאנחנו מצליחים להעלות על פניו של כל אדם.</p>


            <h2 className="mb-4 text-[24px] font-[600] leading-[1.3] text-[#D41A68] lg:text-[45px]">
              מבט קדימה
            </h2>
            <p className="mb-6 text-[15px] font-regular leading-[28px] text-black lg:text-[22px] lg:leading-[32px] text-center">
              החזון שלנו הוא להמשיך לצמוח יחד איתכם. להגים את החידושים הכי חמים מהעולם
              ולהפוך את תהליכי העבודה שלכם לקלים ופשוטים יותר. הקטלוג שבידיכם הוא לא
              רק רשימת מוצרים אלא{" "}
              <span className="font-bold text-[#D41A68]">הזמנה לשותפות אמת</span>{" "}
              ולצמיחה הדדית. אנחנו כאן כדי
              לעבוד יחד איתכם בכבוד, באמון ובשותפות שעושה שמח{" "}
              <span className="font-[700] text-[#D41A68]">שמח בלב ולאורך שנים.</span>
            </p>

            <p className="mb-2 text-[16px] font-medium text-black lg:text-[18px]">
              שלכם,
            </p>
            <p className="mb-8 text-[16px] font-bold text-black lg:text-[18px]">
              אבשלום משה, דוד ברוכאל וצוות יבואני הממתקים
            </p>

            {/* CTA Button */}
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full bg-[#43B9B9] px-12 py-2 text-[20px] font-[500] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:opacity-90 lg:text-[32px] relative z-5"
            >
              לפתיחת הקטלוג
            </Link>
          </div>          
        </div>
        <div className="w-full mt-[-320px]">
            <div className="relative h-[440px]">
              <Image
                src="/last-cows.svg"
                alt="mascot with gift"
                fill
                className="object-cover overflow-visible"
                unoptimized
              />
            </div>
          </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-16 lg:h-24" />

    </main>
  );
}