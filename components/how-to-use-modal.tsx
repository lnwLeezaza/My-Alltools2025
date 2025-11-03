"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface HowToUseModalProps {
  toolName: string
  steps: Array<{ title: string; description: string }> | string[]
  isOpen: boolean
  onClose: () => void
}

export function HowToUseModal({ toolName, steps, isOpen, onClose }: HowToUseModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(`hideModal_${toolName}`, "true")
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-full max-w-lg bg-background border rounded-lg shadow-lg z-50 p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-2">
                <h2 className="text-lg sm:text-xl font-semibold">How to Use This Tool</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{toolName}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6">
              {steps.map((step, index) => {
                const isObject = typeof step === "object" && step !== null
                const stepTitle = isObject ? step.title : step
                const stepDescription = isObject ? step.description : null

                return (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium">{stepTitle}</p>
                      {stepDescription && <p className="text-sm text-muted-foreground mt-1">{stepDescription}</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dont-show"
                  checked={dontShowAgain}
                  onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                />
                <label htmlFor="dont-show" className="text-sm text-muted-foreground cursor-pointer">
                  Don't show again
                </label>
              </div>
              <Button onClick={handleClose} className="w-full sm:w-auto">
                Got it!
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
