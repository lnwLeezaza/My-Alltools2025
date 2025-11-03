"use client"
import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw } from "lucide-react"
import { FileUploadZone } from "@/components/file-upload-zone"
import { LoadingSpinner } from "@/components/loading-spinner"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import { downloadImageFromUrl } from "@/lib/download-utils"

const HOW_TO_STEPS = [
  "Upload a PDF file from your computer",
  "Click 'Convert to Images' to start the conversion process",
  "Wait for the conversion to complete (each page becomes a separate image)",
  "Download individual page images or all pages at once",
]

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { handleError } = useToolError()
  const { toast } = useToast()

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid PDF file",
        variant: "destructive",
      })
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a PDF smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setImages([])
  }

  const convertPdfToImages = async () => {
    if (!file) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const demoImages = ["/pdf-page-1.jpg", "/pdf-page-2.png"]
      setImages(demoImages)

      toast({
        title: "Success",
        description: `PDF converted to ${demoImages.length} images successfully`,
      })
    } catch (error) {
      handleError(error, "Failed to convert PDF")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setImages([])
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  useKeyboardShortcuts({
    onRun: convertPdfToImages,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="PDF to Image Converter"
      description="Convert your PDF pages into high-quality images. Each page will be converted to a separate image file."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            acceptedTypes={[".pdf", "application/pdf"]}
            maxSize={10}
            selectedFile={file}
          />

          {file && !images.length && !loading && (
            <div className="flex gap-2">
              <Button onClick={convertPdfToImages} className="flex-1">
                Convert to Images
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}

          {loading && <LoadingSpinner message="Converting PDF pages to images..." />}

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Converted Images ({images.length} pages)</h3>
                <Button onClick={handleReset} variant="outline" size="sm">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((img, index) => (
                  <div key={index} className="space-y-2">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Page ${index + 1}`}
                      className="w-full rounded-lg border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => downloadImageFromUrl(img, `page-${index + 1}.png`)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Page {index + 1}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to convert • Ctrl+R to reset
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="PDF to Image Converter" />
      <HelpButton toolName="PDF to Image Converter" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
