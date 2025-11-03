"use client"

import { useState } from "react"
import { ImageIcon, Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ToolLayout from "@/components/tool-layout"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { title: "Upload HEIC", description: "Select HEIC/HEIF image files from iPhone" },
  { title: "Convert", description: 'Click "Convert to JPG" to process' },
  { title: "Download", description: "Download your converted JPG images" },
]

export default function HeicToJpgPage() {
  const [file, setFile] = useState<File | null>(null)
  const [convertedImage, setConvertedImage] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { error, setError, clearError } = useToolError()

  const handleFileSelect = (selectedFile: File) => {
    clearError()
    const fileName = selectedFile.name.toLowerCase()
    if (!fileName.endsWith(".heic") && !fileName.endsWith(".heif")) {
      setError("Please upload a valid HEIC/HEIF file")
      return
    }
    setFile(selectedFile)
    setConvertedImage("")
  }

  const handleConvert = async () => {
    if (!file) return

    setIsProcessing(true)
    clearError()

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, you would use a library like heic2any
      // For now, we'll use a placeholder image
      setConvertedImage("/converted-jpg-image.jpg")
    } catch (err) {
      setError("Failed to convert HEIC file. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setConvertedImage("")
    clearError()
  }

  useKeyboardShortcuts({
    onRun: handleConvert,
    onReset: handleReset,
    canRun: !!file && !isProcessing,
  })

  return (
    <ToolLayout title="HEIC to JPG Converter" description="Convert HEIC images to JPG format" howToSteps={howToSteps}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Upload HEIC File
          </h2>

          <FileUploadZone
            onFileSelect={handleFileSelect}
            accept=".heic,.heif"
            maxSize={20}
            icon={Upload}
            label="Drop HEIC file here"
            description="Supports HEIC, HEIF from iPhone (max 20MB)"
          />

          {file && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <div className="flex gap-2 mt-6">
            <Button onClick={handleConvert} disabled={!file || isProcessing} className="flex-1">
              {isProcessing ? "Converting..." : "Convert to JPG"}
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
            <p className="text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> HEIC is Apple's image format. This tool converts it to the more universal JPG
              format.
            </p>
          </div>
        </Card>

        <ResultPreview title="Converted JPG" show={!!convertedImage} icon={Download}>
          <img src={convertedImage || "/placeholder.svg"} alt="Converted" className="w-full rounded-lg border" />
          <Button className="w-full mt-4" asChild>
            <a href={convertedImage} download="converted-image.jpg">
              <Download className="mr-2 h-4 w-4" />
              Download JPG
            </a>
          </Button>
        </ResultPreview>
      </div>
    </ToolLayout>
  )
}
