import type { MetadataRoute } from "next"
import { tools } from "@/lib/tools-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.alltoolsz.online"

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  tools.forEach((tool) => {
    routes.push({
      url: `${baseUrl}${tool.path.startsWith("/") ? tool.path : `/${tool.path}`}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  })

  return routes
}
