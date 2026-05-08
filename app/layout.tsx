import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HUB380 Catalog",
  description: "Candy Importer Catalog Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className="h-full scroll-smooth"
    >
      <body
        className={`${rubik.className} min-h-full bg-white text-black antialiased`}
      >
        {children}
      </body>
    </html>
  );
}