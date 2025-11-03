"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { HowToUseModal } from "./how-to-use-modal"
import { motion } from "framer-motion"

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
  howToSteps?: Array<{ title: string; description: string }>
}

export function ToolLayout({ title, description, children, howToSteps = [] }: ToolLayoutProps) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const hasSeenModal = localStorage.getItem(`hideModal_${title}`)
    if (!hasSeenModal && howToSteps.length > 0) {
      // Show modal after a short delay
      const timer = setTimeout(() => setShowModal(true), 500)
      return () => clearTimeout(timer)
    }
  }, [title, howToSteps])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <Header />
      <main className="container py-4 sm:py-6 md:py-8 px-4">
        <div className="mb-4 sm:mb-6">
          <Button variant="ghost" size="sm" asChild className="h-9 sm:h-10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Link>
          </Button>
        </div>
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </main>

      {howToSteps.length > 0 && (
        <HowToUseModal toolName={title} steps={howToSteps} isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </motion.div>
  )
}

export default ToolLayout
