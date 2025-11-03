"use client"

import { useState } from "react"
import { Minimize, Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import ToolLayout from "@/components/tool-layout"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { title: "Upload File", description: "Select a PDF, image, or video file" },
  { title: "Adjust Quality", description: "Choose compression level (higher = better quality)" },
  { title: "Compress & Download", description: "Get your compressed file" },
]

export default function FileCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState([75])
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { error, setError, clearError } = useToolError()

  const handleFileSelect = (selectedFile: File) => {
    clearError()
    setFile(selectedFile)
    setCompressedSize(null)
  }

  const handleCompress = async () => {
    if (!file) return

    setIsProcessing(true)
    clearError()

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate compression (reduce size based on quality)
      const compressionRatio = 1 - (quality[0] / 100) * 0.5
      const newSize = Math.floor(file.size * compressionRatio)
      setCompressedSize(newSize)
    } catch (err) {
      setError("Failed to compress file. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setCompressedSize(null)
    setQuality([75])
    clearError()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1024 / 1024).toFixed(1) + " MB"
  }

  const getSavings = () => {
    if (!file || !compressedSize) return 0
    return Math.round(((file.size - compressedSize) / file.size) * 100)
  }

  useKeyboardShortcuts({
    onRun: handleCompress,
    onReset: handleReset,
    canRun: !!file && !isProcessing,
  })

  return (
    <ToolLayout title="File Compressor" description="Compress PDF, images, and videos" howToSteps={howToSteps}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Minimize className="h-5 w-5" />
            Upload File
          </h2>

          <FileUploadZone
            onFileSelect={handleFileSelect}
            accept="image/*,video/*,.pdf"
            maxSize={100}
            icon={Upload}
            label="Drop file here to compress"
            description="Supports images, videos, PDF (max 100MB)"
          />

          {file && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">Original size: {formatFileSize(file.size)}</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <Label>Compression Quality: {quality[0]}%</Label>
              <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">Higher quality = larger file size</p>
            </div>
          </div>

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <div className="flex gap-2 mt-6">
            <Button onClick={handleCompress} disabled={!file || isProcessing} className="flex-1">
              {isProcessing ? "Compressing..." : "Compress File"}
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        <ResultPreview title="Compressed Result" show={compressedSize !== null} icon={Download}>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Original</span>
                <span className="font-medium">{file && formatFileSize(file.size)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Compressed</span>
                <span className="font-medium">{compressedSize && formatFileSize(compressedSize)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Savings</span>
                <span className="text-lg font-bold text-green-600">{getSavings()}%</span>
              </div>
            </div>

            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Compressed File
            </Button>
          </div>
        </ResultPreview>
      </div>
    </ToolLayout>
  )
}
