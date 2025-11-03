"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HowToUseModal } from "./how-to-use-modal"

interface HelpButtonProps {
  toolName: string
  steps: string[]
}

export function HelpButton({ toolName, steps }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-14 sm:h-12 sm:w-12 rounded-full shadow-lg z-40 bg-background border-2"
        onClick={() => setIsOpen(true)}
        aria-label="Help"
      >
        <HelpCircle className="h-6 w-6 sm:h-5 sm:w-5" />
      </Button>
      <HowToUseModal toolName={toolName} steps={steps} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
