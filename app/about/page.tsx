import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אודות | יבואני הממתקים",
};

export default function AboutPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundImage: "url('/mian-about-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        // ❌ removed backgroundAttachment: "fixed" — forces full repaint on every scroll pixel
      }}
    >

      {/* Preload the heavy background via a hidden priority image */}
      <Image
        src="/mian-about-bg.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none fixed inset-0 -z-10 object-cover object-top"
      />

      {/* ── HEADER ── */}
      <header
        className="relative z-10 flex min-h-[160px] items-baseline justify-between px-5 py-4 lg:min-h-[215px] lg:px-10 lg:py-6"
        style={{
          backgroundImage: "url('/frame-187.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo-home.png"
              alt="יבואני הממתקים"
              width={340}
              height={100}
              className="absolute top-0 h-[108px] w-auto object-contain lg:h-[170px]"
              priority
              sizes="(max-width: 1024px) 200px, 340px"
            />
          </Link>
        </div>

        <Link
          href="/catalog"
          className="flex items-center gap-3 rounded-full bg-white px-6 py-2 text-[16px] font-[600] text-[#43B9B9] shadow-md transition-all duration-200 hover:bg-[#D41A68] hover:text-white lg:text-[20px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="rotate-180">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          לקטלוג
        </Link>
      </header>

      {/* ── SECTION 1: Hero / Intro ── */}
      <section
        className="relative z-[1] mt-[-160px] px-6 pb-10 pt-6 text-center lg:mt-[-200px] lg:pb-[300px] lg:pt-[126px] [background-position-y:40px]"
        style={{
          backgroundImage: "url('/white-corve-setone.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "90%",
          backgroundPosition: "center 40px",
        }}
      >
        <div className="mx-auto max-w-[1024px]">

          <div className="relative mx-auto mb-6 h-[60px] w-full ">
            <Image
              src="/heading.webp"
              alt="לקוחות ושותפים יקרים"
              fill
              sizes="(max-width: 768px) 90vw, 500px"
              className="object-contain"
              priority
            />
          </div>

          <p className="mb-8 text-[15px] font-medium leading-[26px] text-black lg:text-[19px] lg:leading-[30px]">
            אנחנו יודעים מי אתם. אנחנו יודעים שמאחורי כל לקוח, רשת או עסק מצליח עומדים אנשים
            שמקדישים מזמנם, ממרצם ומנסיונם לנהל עסקים קטנים ובינוניים וסוחרים הממוקדים בפרנסת
            ולקוחות שלהם. אנחנו יודעים שהדרך לא תמיד פשוטה ושכל הצלחה שלכם בבנייה בהתמדה
            ובעשר אצבעות.
            <br />
            אנחנו יודעים את זה כי אנחנו בדיוק כמוכם.
          </p>

          <div className="text-center text-[16px] font-normal leading-[24px] text-[#C10051] lg:text-[24px] lg:leading-[30px]">
            <p>
              חברת יבואני הממתקים נולדה מתוך השטח ומתוך{" "}
              <span className="font-bold">חיבור אמיתי</span>{" "}
              לעולם הקמעונאות. כשאבשלום משה ודוד ברוכאל הקימו את החברה המרכז הייתה
              ברורה: להיות{" "}
              <span className="font-bold">שותף שאפשר לסמוך עליו</span>
              . שותף שכבד עבודה קשה, מבין
              את גודל האחריות ויודע שבסוף היום כולנו כאן כדי לספק{" "}
              <span className="font-bold">ממתקים שעושים שמח</span>{" "}
              כל בהמד.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Quality text ── */}
      <section className="mx-auto max-w-[725px] px-6 py-10 text-center lg:py-16 lg:mt-[-290px] relative z-2">
        <h2 className="mb-1 text-[28px] font-bold leading-[1.3] text-[#D41367] lg:text-[50px]">
          איכות, בחירה וערר
        </h2>
        <p className="text-[15px] font-normal leading-[28px] text-black lg:text-[22px] lg:leading-[34px]">
          אנחנו לא רק מביאים ממתקים אלא{" "}
          <span className="font-bold text-[#D41367]">בוחרים אותם אחד אחד בקפידה</span>
          . אנחנו טועסים, בודקים וטועמים מוצרים בכל העולם כדי להביא אליכם את הטירנים
          המובילים מאירופה, מאסיה ומרחבי הגלובוס. כל מוצר שבחנו לקסלקם זכה נבחר
          מתוך מחשבה עליכם, על המדף שלכם ועל{" "}
          <span className="font-bold text-[#D41367]">הרווחיות שלכם</span>
          . הכל נגשה בסטנדרטים הגבוהים ביותר של איכות ו
          <span className="font-bold text-[#D41367]">גשרות מוקפדת</span>{" "}
          מתוך מחויבות עמוקה לשוק הישראלי.
        </p>
      </section>

      {/* ── SECTION 3: Truck SVG ── */}
      <section className="relative -mx-6 mb-6 mt-[-280px] lg:-mx-0 lg:mt-[-600px] relative z-3">
        <div className="relative w-full" style={{ aspectRatio: "1200/860" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/truck.svg"
            alt="משאיות יבואני הממתקים"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            width={1100}
            height={700}
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
        <p className="text-[15px] font-normal leading-[28px] text-black lg:text-[22px] lg:leading-[32px]">
          מהמרכז הלוגיסטי המתקדם שלנו בצפון אנחנו מפעילים מערך הפצה מקצועי שמגיע
          לאפרי נקודות מכירה בכל הארץ. עברנו כל לשלות שיאיו{" "}
          <span className="font-bold text-[#D41A68]">בזמן וכדיוק</span>{" "}
          הוא הבנחה שקופים. אנחנו לא מחפשים עסקאות קצרות אלא בלא בנים{" "}
          <span className="font-bold text-[#D41A68]">מערכות יחסים ארוכות טווח</span>{" "}
          המבוססות על אמון. נאמנו וישרות אמיתי שעושה פשוט{" "}
          <span className="font-bold text-[#D41A68]">שמח לעבוד יחד</span>.
        </p>
      </section>

      {/* ── SECTION 5: Warehouse SVG ── */}
      <section className="relative -mr-6 mb-10 lg:-mr-0">
        <div className="relative" style={{ aspectRatio: "800/375" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/whearhouse.svg"
            alt="מחסן יבואני הממתקים"
            loading="lazy"
            decoding="async"
            className="h-full w-[80%] object-contain"
            width={800}
            height={300}
          />
        </div>
      </section>

      {/* ── SECTION 6: עסק עם נשמה ── */}
      <section className="relative">
        <div className="mx-auto max-w-[720px] px-6 text-center">

          <h2 className="mb-2 text-[28px] font-[600] leading-[1.3] text-[#D41A68] lg:text-[50px]">
            עסק עם נשמה
          </h2>

          <p className="mb-6 text-[15px] font-normal leading-[28px] text-black lg:text-[22px] lg:leading-[32px]">
            יבואני הממתקים היא{" "}
            <strong className="font-black text-[#D41A68]">חברה עם לב.</strong>{" "}
            אנחנו גאים בצוות שלנו הכולל עובדים יקרים בעלי מוגבלויות כחלק מתפיסה של
            נתינה וערבות הדדית. אצלנו הצלחה אמיתית לא נמדדת רק במספרים אלא בטוב
            שאנחנו עושים יחד ובחיוך שאנחנו מצליחים להעלות על פניו של כל אדם.
          </p>

          <h2 className="mb-4 text-[24px] font-[600] leading-[1.3] text-[#D41A68] lg:text-[45px]">
            מבט קדימה
          </h2>

          <p className="mb-6 text-[15px] font-normal leading-[28px] text-black lg:text-[22px] lg:leading-[32px]">
            החזון שלנו הוא להמשיך לצמוח יחד איתכם. להגים את החידושים הכי חמים מהעולם
            ולהפוך את תהליכי העבודה שלכם לקלים ופשוטים יותר. הקטלוג שבידיכם הוא לא
            רק רשימת מוצרים אלא{" "}
            <span className="font-bold text-[#D41A68]">הזמנה לשותפות אמת</span>{" "}
            ולצמיחה הדדית. אנחנו כאן כדי לעבוד יחד איתכם בכבוד, באמון ובשותפות שעושה{" "}
            <span className="font-[700] text-[#D41A68]">שמח בלב ולאורך שנים.</span>
          </p>

          <p className="mb-1 text-[16px] font-medium text-black lg:text-[18px]">שלכם,</p>
          <p className="mb-8 text-[16px] font-bold text-black lg:text-[18px]">
            אבשלום משה, דוד ברוכאל וצוות יבואני הממתקים
          </p>

          <div className="relative z-10">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full bg-[#43B9B9] px-12 py-3 text-[20px] font-[500] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:opacity-90 lg:text-[32px]"
            >
              לפתיחת הקטלוג
            </Link>
          </div>
        </div>

        <div className="relative mt-[-180px] w-full lg:mt-[-320px]" style={{ aspectRatio: "1440/560" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/last-cows.svg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            width={1440}
            height={440}
          />
        </div>
      </section>

      <div className="h-4 lg:h-8" />

    </main>
  );
}
