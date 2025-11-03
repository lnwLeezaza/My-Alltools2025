"use client"
import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Download, RotateCcw } from "lucide-react"
import { FileUploadZone } from "@/components/file-upload-zone"
import { LoadingSpinner } from "@/components/loading-spinner"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import { downloadImageFromDataUrl } from "@/lib/download-utils"

const HOW_TO_STEPS = [
  "Upload an image file (PNG, JPG, or WebP)",
  "Adjust the quality slider to balance file size and image quality",
  "Click 'Compress Image' to process",
  "Download the compressed image and compare the file size reduction",
]

export default function ImageCompressorPage() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [compressed, setCompressed] = useState<string>("")
  const [quality, setQuality] = useState([80])
  const [loading, setLoading] = useState(false)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const { handleError } = useToolError()
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (PNG, JPG, WebP)",
        variant: "destructive",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setImage(file)
    setOriginalSize(file.size)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setCompressed("")
  }

  const compressImage = async () => {
    if (!image || !preview) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const canvas = document.createElement("canvas")
      const img = new Image()
      img.src = preview

      await new Promise((resolve) => {
        img.onload = resolve
      })

      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality[0] / 100)
      setCompressed(compressedDataUrl)

      const base64Length = compressedDataUrl.length - "data:image/jpeg;base64,".length
      const estimatedSize = (base64Length * 3) / 4
      setCompressedSize(estimatedSize)

      toast({
        title: "Success",
        description: "Image compressed successfully",
      })
    } catch (error) {
      handleError(error, "Failed to compress image")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreview("")
    setCompressed("")
    setQuality([80])
    setOriginalSize(0)
    setCompressedSize(0)
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  useKeyboardShortcuts({
    onRun: compressImage,
    onReset: handleReset,
  })

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB"
  }

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce image file size without losing quality. Adjust compression level to balance quality and file size."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            acceptedTypes={["image/*"]}
            maxSize={10}
            selectedFile={image}
          />

          {preview && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Quality: {quality[0]}%</label>
                    <span className="text-xs text-muted-foreground">Higher quality = larger file size</span>
                  </div>
                  <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} className="w-full" />
                </div>

                <div className="flex gap-2">
                  <Button onClick={compressImage} disabled={loading} className="flex-1">
                    Compress Image
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {loading && <LoadingSpinner message="Compressing your image..." />}

              {!loading && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Original</h3>
                    <img src={preview || "/placeholder.svg"} alt="Original" className="w-full rounded-lg border" />
                    <p className="text-sm text-muted-foreground">Size: {formatSize(originalSize)}</p>
                  </div>

                  {compressed && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Compressed</h3>
                      <img
                        src={compressed || "/placeholder.svg"}
                        alt="Compressed"
                        className="w-full rounded-lg border"
                      />
                      <p className="text-sm text-muted-foreground">
                        Size: {formatSize(compressedSize)} ({((1 - compressedSize / originalSize) * 100).toFixed(0)}%
                        reduction)
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => downloadImageFromDataUrl(compressed, "compressed-image.jpg")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to compress • Ctrl+R to reset
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="Image Compressor" />
      <HelpButton toolName="Image Compressor" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
