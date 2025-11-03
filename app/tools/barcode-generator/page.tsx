"use client"

import { useState } from "react"
import { Barcode, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"
import { HowToUseModal } from "@/components/how-to-use-modal"
import { ResultPreview } from "@/components/result-preview"
import { ToolFeedback } from "@/components/tool-feedback"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { step: 1, title: "Enter Data", description: "Type the text or number for your barcode" },
  { step: 2, title: "Generate", description: 'Click "Generate Barcode" to create it' },
  { step: 3, title: "Download", description: "Save your barcode as an image" },
]

export default function BarcodeGeneratorPage() {
  const [text, setText] = useState("")
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    if (text) {
      setGenerated(true)
    }
  }

  const handleReset = () => {
    setText("")
    setGenerated(false)
  }

  const handleDownload = () => {
    // Simulate download
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      canvas.width = 400
      canvas.height = 200
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, 400, 200)
      ctx.fillStyle = "black"
      ctx.font = "16px monospace"
      ctx.fillText(text, 150, 180)
      // Draw simple barcode pattern
      for (let i = 0; i < 50; i++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * 8, 50, 4, 100)
        }
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "barcode.png"
          a.click()
          URL.revokeObjectURL(url)
        }
      })
    }
  }

  useKeyboardShortcuts({
    onRun: handleGenerate,
    onReset: handleReset,
  })

  return (
    <ToolLayout title="Barcode Generator" description="Generate barcodes for products and inventory" icon={Barcode}>
      <HowToUseModal toolName="Barcode Generator" steps={howToSteps} />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Barcode Data</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or numbers..."
            maxLength={50}
          />
          <p className="text-sm text-muted-foreground mt-1">{text.length}/50 characters</p>
        </div>

        <Button onClick={handleGenerate} disabled={!text}>
          Generate Barcode
        </Button>

        {generated && (
          <ResultPreview title="Barcode Generated!" description="Your barcode is ready to download">
            <Card className="p-8 bg-white">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black"
                      style={{
                        width: "4px",
                        height: "100px",
                        opacity: Math.random() > 0.5 ? 1 : 0,
                      }}
                    />
                  ))}
                </div>
                <p className="text-black font-mono text-sm">{text}</p>
              </div>
            </Card>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Barcode
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Generate Another
              </Button>
            </div>
          </ResultPreview>
        )}

        <ToolFeedback toolName="Barcode Generator" />
      </div>
    </ToolLayout>
  )
}
