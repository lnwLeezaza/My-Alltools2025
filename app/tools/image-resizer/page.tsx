"use client"

import { useState, useRef } from "react"
import { ImageDown, Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ToolLayout from "@/components/tool-layout"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { title: "Upload Image", description: "Select an image file to resize" },
  { title: "Set Dimensions", description: "Enter custom width and height or use presets" },
  { title: "Resize & Download", description: "Get your resized image" },
]

const presets = [
  { name: "Instagram Post", width: 1080, height: 1080 },
  { name: "Instagram Story", width: 1080, height: 1920 },
  { name: "Facebook Cover", width: 820, height: 312 },
  { name: "Twitter Header", width: 1500, height: 500 },
  { name: "YouTube Thumbnail", width: 1280, height: 720 },
]

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [resizedImage, setResizedImage] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { error, setError, clearError } = useToolError()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    clearError()
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file")
      return
    }
    setFile(selectedFile)
    setResizedImage("")

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
        setPreview(e.target?.result as string)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleResize = async () => {
    if (!file || !preview) return

    setIsProcessing(true)
    clearError()

    try {
      const img = new Image()
      img.src = preview

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(img, 0, 0, width, height)
      const resized = canvas.toDataURL("image/png")
      setResizedImage(resized)
    } catch (err) {
      setError("Failed to resize image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview("")
    setResizedImage("")
    setWidth(800)
    setHeight(600)
    clearError()
  }

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth)
    setHeight(presetHeight)
  }

  useKeyboardShortcuts({
    onRun: handleResize,
    onReset: handleReset,
    canRun: !!file && !isProcessing,
  })

  return (
    <ToolLayout title="Image Resizer" description="Resize images to custom dimensions" howToSteps={howToSteps}>
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageDown className="h-5 w-5" />
            Upload Image
          </h2>

          <FileUploadZone
            onFileSelect={handleFileSelect}
            accept="image/*"
            maxSize={10}
            icon={Upload}
            label="Drop image here to resize"
            description="Supports JPG, PNG, WebP (max 10MB)"
          />

          {preview && (
            <div className="mt-4">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-48 object-contain bg-muted rounded-lg"
              />
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>

            <div>
              <Label>Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset.width, preset.height)}
                    className="text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <div className="flex gap-2 mt-6">
            <Button onClick={handleResize} disabled={!file || isProcessing} className="flex-1">
              {isProcessing ? "Resizing..." : "Resize Image"}
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        <ResultPreview title="Resized Image" show={!!resizedImage} icon={Download}>
          <img src={resizedImage || "/placeholder.svg"} alt="Resized" className="w-full rounded-lg border" />
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p>
              Dimensions: {width} × {height} px
            </p>
          </div>
          <Button className="w-full mt-4" asChild>
            <a href={resizedImage} download="resized-image.png">
              <Download className="mr-2 h-4 w-4" />
              Download Resized Image
            </a>
          </Button>
        </ResultPreview>
      </div>
    </ToolLayout>
  )
}
