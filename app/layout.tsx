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
  metadataBase: new URL("https://alltoolshub.pro"),
  title: {
    default: "AllToolsHub Pro - 20+ Free Online Tools | PDF, Image, Text Converters",
    template: "%s | AllToolsHub Pro",
  },
  description:
    "Free online toolkit with 20+ tools: PDF to Image, Image Compressor, QR Generator, JSON Formatter, Base64 Encoder, and more. No sign-up required. All processing in your browser. Fast, secure, and private.",
  keywords: [
    "online tools",
    "free tools",
    "PDF converter",
    "image editor",
    "QR code generator",
    "file converter",
    "image compressor",
    "JSON formatter",
    "base64 encoder",
    "text tools",
    "developer tools",
    "barcode generator",
    "hash generator",
    "password generator",
    "UUID generator",
    "word counter",
    "case converter",
    "CSV to JSON",
  ].join(", "),
  authors: [{ name: "AllToolsHub Pro" }],
  creator: "AllToolsHub Pro",
  publisher: "AllToolsHub Pro",
  openGraph: {
    title: "AllToolsHub Pro - 20+ Free Online Tools",
    description: "Convert, edit, and create instantly — right in your browser. No sign-up required.",
    type: "website",
    locale: "en_US",
    url: "https://alltoolshub.pro",
    siteName: "AllToolsHub Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "AllToolsHub Pro - 20+ Free Online Tools",
    description: "Convert, edit, and create instantly — right in your browser.",
    creator: "@alltoolshub",
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
    canonical: "https://alltoolshub.pro",
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = generateStructuredData()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
  )
}
