"use client"

import type React from "react"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Download, Crop } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ImageCropperPage() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [width, setWidth] = useState("800")
  const [height, setHeight] = useState("600")
  const [cropped, setCropped] = useState<string>("")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
      setCropped("")
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      })
    }
  }

  const cropImage = async () => {
    if (!preview) return

    try {
      const canvas = document.createElement("canvas")
      const img = new Image()
      img.src = preview

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const targetWidth = Number.parseInt(width)
      const targetHeight = Number.parseInt(height)

      canvas.width = targetWidth
      canvas.height = targetHeight

      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight)

      const croppedDataUrl = canvas.toDataURL("image/png")
      setCropped(croppedDataUrl)

      toast({
        title: "Success",
        description: "Image cropped successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to crop image",
        variant: "destructive",
      })
    }
  }

  return (
    <ToolLayout
      title="Image Cropper & Resizer"
      description="Crop and resize images to any dimension. Perfect for social media posts, avatars, and thumbnails."
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
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

          {preview && (
            <>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Width (px)</label>
                    <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Height (px)</label>
                    <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="600" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setWidth("1920")
                      setHeight("1080")
                    }}
                    variant="outline"
                    size="sm"
                  >
                    1920×1080
                  </Button>
                  <Button
                    onClick={() => {
                      setWidth("1080")
                      setHeight("1080")
                    }}
                    variant="outline"
                    size="sm"
                  >
                    1080×1080
                  </Button>
                  <Button
                    onClick={() => {
                      setWidth("1200")
                      setHeight("630")
                    }}
                    variant="outline"
                    size="sm"
                  >
                    1200×630
                  </Button>
                </div>

                <Button onClick={cropImage} className="w-full">
                  <Crop className="mr-2 h-4 w-4" />
                  Crop & Resize
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Original</h3>
                  <img src={preview || "/placeholder.svg"} alt="Original" className="w-full rounded-lg border" />
                </div>

                {cropped && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Cropped</h3>
                    <img src={cropped || "/placeholder.svg"} alt="Cropped" className="w-full rounded-lg border" />
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a href={cropped} download="cropped-image.png">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
