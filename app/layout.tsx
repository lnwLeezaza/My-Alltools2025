import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { generateStructuredData } from "@/lib/seo-utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://alltoolsz.online"),
  title: "AlltoolsZ - เครื่องมือออนไลน์ฟรี ครบทุกอย่างในที่เดียว",
  description:
    "รวมเครื่องมือออนไลน์ฟรี เช่น แปลงไฟล์ คำนวณ แก้ไขรูปภาพ และอื่นๆ ใช้งานง่าย ครบจบในเว็บเดียว",
  authors: [{ name: "AlltoolsZ Team" }],
  verification: {
    google: "cqKdVidPvVYc_AFVGSmHIEMtxD0ULms8wy_7gLuBh_o",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = generateStructuredData();

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* Google AdSense Auto Ads */}
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1566706681787600"
          crossOrigin="anonymous"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Google Verification */}
        <meta
          name="google-site-verification"
          content="cqKdVidPvVYc_AFVGSmHIEMtxD0ULms8wy_7gLuBh_o"
        />

         {/* Google Analytics GA4 */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-95HX26MQDR"
      />

      <Script
        id="ga4-init"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B9XHLZPE0F');
        `}
      </Script>
        
      </head>

      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Header />
          {children}
          <Toaster />
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
