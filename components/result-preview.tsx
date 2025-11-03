"use client"

import type React from "react"

import { motion } from "framer-motion"
import { CheckCircle2, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface ResultPreviewProps {
  title?: string
  children: React.ReactNode
  onDownload?: () => void
  onCopy?: () => void
  downloadLabel?: string
  showSuccess?: boolean
}

export function ResultPreview({
  title = "Result",
  children,
  onDownload,
  onCopy,
  downloadLabel = "Download",
  showSuccess = true,
}: ResultPreviewProps) {
  const { toast } = useToast()

  const handleCopy = () => {
    if (onCopy) {
      onCopy()
      toast({
        title: "Copied!",
        description: "Result copied to clipboard",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <div className="flex items-center gap-2">
              {showSuccess && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </motion.div>
              )}
              <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {onCopy && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none h-10 bg-transparent"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="flex-1 sm:flex-none h-10 bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadLabel}
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-4">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
