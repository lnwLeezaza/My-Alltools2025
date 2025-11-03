"use client"

import { useState, useEffect } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RotateCcw } from "lucide-react"
import { ResultPreview } from "@/components/result-preview"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import { generateStructuredData } from "@/lib/seo-utils"
import { downloadImageFromUrl } from "@/lib/download-utils"

const HOW_TO_STEPS = [
  "Enter the text, URL, or data you want to encode in the text area",
  "Click 'Generate QR Code' or press Ctrl+Enter",
  "Download the QR code image or copy it to your clipboard",
  "Scan the QR code with any smartphone camera to access the content",
]

export default function QrGeneratorPage() {
  const [text, setText] = useState("")
  const [qrCode, setQrCode] = useState("")
  const { handleError } = useToolError()
  const { toast } = useToast()

  useEffect(() => {
    const structuredData = generateStructuredData("qr-generator")
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!text.trim()) {
      setQrCode("")
      return
    }

    const timer = setTimeout(() => {
      try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`
        setQrCode(qrUrl)
      } catch (error) {
        handleError(error, "Failed to generate QR code")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [text, handleError])

  const generateQR = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or URL",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "QR code generated successfully",
    })
  }

  const handleReset = () => {
    setText("")
    setQrCode("")
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  const handleCopyImage = async () => {
    try {
      const response = await fetch(qrCode)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
    } catch (error) {
      handleError(error, "Failed to copy QR code")
    }
  }

  useKeyboardShortcuts({
    onRun: generateQR,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create custom QR codes for URLs, text, contact information, and more. Download as PNG image."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text or URL</label>
            <Textarea
              placeholder="Enter text, URL, or any data..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">QR code generates automatically as you type</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateQR} className="flex-1" disabled={!text.trim()}>
              Generate QR Code
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {qrCode && (
            <ResultPreview
              title="Your QR Code"
              onDownload={() => {
                downloadImageFromUrl(qrCode, "qr-code.png")
              }}
              onCopy={handleCopyImage}
              downloadLabel="Download PNG"
            >
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-muted/30">
                <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-64 h-64" />
                <p className="text-xs text-muted-foreground text-center">
                  Scan this QR code with your phone camera to access the content
                </p>
              </div>
            </ResultPreview>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to generate • Ctrl+R to reset • Esc to close modals
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="QR Code Generator" />

      <HelpButton toolName="QR Code Generator" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
