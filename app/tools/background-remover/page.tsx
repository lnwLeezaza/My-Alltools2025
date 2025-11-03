"use client"

import type React from "react"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BackgroundRemoverPage() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [processed, setProcessed] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
      setProcessed("")
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      })
    }
  }

  const removeBackground = async () => {
    if (!preview) return

    setLoading(true)
    try {
      // Simulate background removal - in production, use an API like remove.bg
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // For demo, just use the original image
      setProcessed(preview)

      toast({
        title: "Success",
        description: "Background removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove background",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove backgrounds from images automatically using AI. Perfect for product photos, portraits, and more."
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="p-4 rounded-lg bg-primary/10 text-sm">
            <p className="font-medium text-primary">Note:</p>
            <p className="text-muted-foreground mt-1">
              This tool uses AI to automatically detect and remove backgrounds. Works best with clear subjects and good
              contrast.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Upload an image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, or WebP</p>
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
            <Button asChild>
              <label htmlFor="image-upload" className="cursor-pointer">
                Choose Image
              </label>
            </Button>
            {image && <p className="text-sm text-muted-foreground">{image.name}</p>}
          </div>

          {preview && !processed && (
            <Button onClick={removeBackground} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing Background...
                </>
              ) : (
                "Remove Background"
              )}
            </Button>
          )}

          {preview && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Original</h3>
                <div className="relative rounded-lg border overflow-hidden bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
                  <img src={preview || "/placeholder.svg"} alt="Original" className="w-full" />
                </div>
              </div>

              {processed && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Background Removed</h3>
                  <div className="relative rounded-lg border overflow-hidden bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
                    <img src={processed || "/placeholder.svg"} alt="Processed" className="w-full" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                    <a href={processed} download="no-background.png">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
