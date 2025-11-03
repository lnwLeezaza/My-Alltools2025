"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToolCard } from "@/components/tool-card"
import { VisitorCounter } from "@/components/visitor-counter"
import { tools, type ToolCategory } from "@/lib/tools-data"

const categories = [
  { id: "all" as ToolCategory, label: "All Tools" },
  { id: "file" as ToolCategory, label: "File Conversion" },
  { id: "image" as ToolCategory, label: "Image & Media" },
  { id: "text" as ToolCategory, label: "Text & Developer" },
]

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tools based on category and search
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen">
      <main className="container py-6 sm:py-8 space-y-8 sm:space-y-12 px-4">
        {/* Hero Section */}
        <section className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            All Your Tools in One Place
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Convert, edit, and create instantly — right in your browser. 20+ free tools with no sign-up required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 h-11 sm:h-12" asChild>
              <a href="#tools">Explore All Tools</a>
            </Button>
          </motion.div>

          {/* Visitor Counter */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <VisitorCounter />
          </motion.div>
        </section>

        {/* Search and Category Tabs */}
        <section id="tools" className="space-y-4 sm:space-y-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="min-w-[100px] sm:min-w-[120px] h-10 text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Tools Count */}
          <p className="text-center text-sm text-muted-foreground">
            Showing {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
          </p>
        </section>

        {/* Tools Grid */}
        <section className="px-4">
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" layout>
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <ToolCard
                  title={tool.name}
                  description={tool.description}
                  icon={tool.icon}
                  href={tool.path}
                  badge={index < 3 ? "Popular" : undefined}
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No tools found matching your search.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 sm:mt-16">
        <div className="container py-6 sm:py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="font-semibold mb-3">AllToolsHub Pro</h3>
              <p className="text-sm text-muted-foreground">
                Free online tools for everyone. All processing happens in your browser for maximum privacy and security.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Popular Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/tools/pdf-to-image" className="hover:text-foreground transition-colors">
                    PDF to Image
                  </a>
                </li>
                <li>
                  <a href="/tools/qr-generator" className="hover:text-foreground transition-colors">
                    QR Code Generator
                  </a>
                </li>
                <li>
                  <a href="/tools/image-compressor" className="hover:text-foreground transition-colors">
                    Image Compressor
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs sm:text-sm text-muted-foreground border-t pt-6 sm:pt-8">
            <p>© 2025 AllToolsHub Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
