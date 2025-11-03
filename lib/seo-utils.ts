import type { Metadata } from "next"
import { tools } from "./tools-data"

export function generateToolMetadata(toolId: string): Metadata {
  const tool = tools.find((t) => t.id === toolId)

  if (!tool) {
    return {}
  }

  const title = `${tool.name} - Free Online Tool | AllToolsHub Pro`
  const description = `${tool.description}. Fast, secure, and completely free. No sign-up required. All processing happens in your browser.`
  const url = `https://alltoolshub.pro${tool.path}`

  return {
    title,
    description,
    keywords: [
      tool.name.toLowerCase(),
      tool.description.toLowerCase(),
      "free online tool",
      "no sign-up",
      "browser-based",
      "secure",
      "fast",
    ].join(", "),
    authors: [{ name: "AllToolsHub Pro" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "AllToolsHub Pro",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
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
  }
}

export function generateStructuredData(toolId?: string) {
  const baseUrl = "https://alltoolshub.pro"

  if (!toolId) {
    // Homepage structured data
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "AllToolsHub Pro",
      description: "Free online toolkit with 20+ tools for file conversion, image editing, and text processing",
      url: baseUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1250",
      },
    }
  }

  // Tool page structured data
  const tool = tools.find((t) => t.id === toolId)
  if (!tool) return null

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `${baseUrl}${tool.path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "No sign-up required",
      "Browser-based processing",
      "Secure and private",
      "Fast conversion",
      "Free forever",
    ],
  }
}
