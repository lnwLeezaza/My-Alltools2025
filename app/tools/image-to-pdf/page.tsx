"use client"

import type React from "react"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ImageToPdfPage() {
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Please select only image files",
        variant: "destructive",
      })
    }

    setImages((prev) => [...prev, ...imageFiles])
    setPdfGenerated(false)
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPdfGenerated(false)
  }

  const generatePdf = async () => {
    if (images.length === 0) return

    setLoading(true)
    try {
      // Simulated PDF generation - in production, use jsPDF or similar library
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPdfGenerated(true)
      toast({
        title: "Success",
        description: "PDF generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolLayout
      title="Image to PDF Converter"
      description="Combine multiple images into a single PDF document. Upload images in any order and rearrange them as needed."
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Upload your images</p>
              <p className="text-xs text-muted-foreground">Select multiple images to combine into one PDF</p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <Button asChild>
              <label htmlFor="image-upload" className="cursor-pointer">
                Choose Images
              </label>
            </Button>
          </div>

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{images.length} image(s) selected</h3>
                <Button variant="outline" size="sm" onClick={() => setImages([])}>
                  Clear All
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(img) || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{img.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length > 0 && !pdfGenerated && (
            <Button onClick={generatePdf} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                "Generate PDF"
              )}
            </Button>
          )}

          {pdfGenerated && (
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
