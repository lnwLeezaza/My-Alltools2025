import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { generateStructuredData } from "@/lib/seo-utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://alltoolsz.online"),
  title: {
    default: "AlltoolsZ - เครื่องมือออนไลน์ฟรี ครบทุกอย่างในที่เดียว",
    template: "%s | AlltoolsZ",
  },
  description:
    "รวมเครื่องมือออนไลน์ฟรี เช่น แปลงไฟล์ คำนวณ แก้ไขรูปภาพ และอื่นๆ ใช้งานง่าย ครบจบในเว็บเดียว | Free online tools for file conversion, calculation, and editing — all in one place.",
  keywords: [
    "AlltoolsZ",
    "เครื่องมือออนไลน์",
    "แปลงไฟล์",
    "คำนวณ",
    "ปรับขนาดรูปภาพ",
    "QR code generator",
    "PDF converter",
    "text tools",
    "developer tools",
    "ฟรีออนไลน์",
    "All tools online",
    "Base64 encoder",
    "Image compressor",
    "Word counter",
  ].join(", "),
  authors: [{ name: "AlltoolsZ Team" }],
  creator: "AlltoolsZ",
  publisher: "AlltoolsZ",
  openGraph: {
    title: "AlltoolsZ - เครื่องมือออนไลน์ฟรี ครบทุกอย่างในที่เดียว",
    description:
      "เว็บรวมเครื่องมือออนไลน์ฟรี ใช้งานง่าย ไม่ต้องสมัครสมาชิก รองรับทุกอุปกรณ์ | Free online tools for work and study.",
    type: "website",
    locale: "th_TH",
    url: "https://alltoolsz.online",
    siteName: "AlltoolsZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlltoolsZ - เครื่องมือออนไลน์ฟรี ครบทุกอย่างในที่เดียว",
    description: "รวมเครื่องมือออนไลน์ฟรี เช่น แปลงไฟล์ คำนวณ และแก้ไขรูปภาพ ครบจบในเว็บเดียว",
    creator: "@alltoolsz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://alltoolsz.online",
  },
  verification: {
    google: "cqKdVidPvVYc_AFVGSmHIEMtxD0ULms8wy_7gLuBh_o", // ✅ ใช้ตัวนี้ที่คุณยืนยันกับ Google Search Console
  },
  generator: "Vercel + Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = generateStructuredData()

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        {/* Google Verification */}
        <meta name="google-site-verification" content="cqKdVidPvVYc_AFVGSmHIEMtxD0ULms8wy_7gLuBh_o" />

        {/* Google Analytics GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B9XHLZPE0F"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B9XHLZPE0F');
            `,
          }}
        />

        {/* ✅ Monetag Script */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="182989"
          async
          data-cfasync="false"
        ></script>
      </head>

      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Header />
          {children}
          <Toaster />
        </ThemeProvider>

        <Analytics />

        {/* ✅ Monetag Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('Monetag SW registered with scope:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('Monetag SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}

