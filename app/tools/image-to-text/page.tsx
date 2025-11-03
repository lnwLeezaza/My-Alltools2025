"use client"

import { useState } from "react"
import { Type, Upload, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import ToolLayout from "@/components/tool-layout"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"

const howToSteps = [
  { title: "Upload Image", description: "Select an image containing text" },
  { title: "Extract Text", description: 'Click "Extract Text" to run OCR' },
  { title: "Copy Result", description: "Copy the extracted text to clipboard" },
]

export default function ImageToTextPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [extractedText, setExtractedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { error, setError, clearError } = useToolError()
  const { toast } = useToast()

  const handleFileSelect = (selectedFile: File) => {
    clearError()
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file")
      return
    }
    setFile(selectedFile)
    setExtractedText("")

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleExtract = async () => {
    if (!file) return

    setIsProcessing(true)
    clearError()

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock OCR result
      const mockText = `This is a simulated OCR (Optical Character Recognition) result.

In a real implementation, this would use an OCR API like:
- Google Cloud Vision API
- AWS Textract
- Azure Computer Vision
- Tesseract.js

The extracted text would contain all readable text from your image, including:
- Printed text
- Handwritten text (with varying accuracy)
- Text in different fonts and sizes
- Multi-column layouts

For best results:
- Use high-resolution images
- Ensure good lighting and contrast
- Avoid blurry or distorted text
- Keep text horizontal when possible`

      setExtractedText(mockText)
    } catch (err) {
      setError("Failed to extract text. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview("")
    setExtractedText("")
    clearError()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  useKeyboardShortcuts({
    onRun: handleExtract,
    onReset: handleReset,
    canRun: !!file && !isProcessing,
  })

  return (
    <ToolLayout title="Image to Text (OCR)" description="Extract text from images using OCR" howToSteps={howToSteps}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Type className="h-5 w-5" />
            Upload Image
          </h2>

          <FileUploadZone
            onFileSelect={handleFileSelect}
            accept="image/*"
            maxSize={10}
            icon={Upload}
            label="Drop image with text here"
            description="Supports JPG, PNG, WebP (max 10MB)"
          />

          {preview && (
            <div className="mt-4">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-64 object-contain bg-muted rounded-lg"
              />
            </div>
          )}

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <div className="flex gap-2 mt-6">
            <Button onClick={handleExtract} disabled={!file || isProcessing} className="flex-1">
              {isProcessing ? "Extracting..." : "Extract Text"}
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        <ResultPreview title="Extracted Text" show={!!extractedText} icon={Type}>
          <Textarea value={extractedText} readOnly className="min-h-[400px] font-mono text-sm" />
          <Button onClick={handleCopy} className="w-full mt-4">
            <Copy className="mr-2 h-4 w-4" />
            Copy Text
          </Button>
        </ResultPreview>
      </div>
    </ToolLayout>
  )
}
