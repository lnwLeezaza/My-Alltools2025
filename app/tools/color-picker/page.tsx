"use client"

import type React from "react"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Copy, Check, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Color {
  hex: string
  rgb: string
  hsl: string
  count: number
}

export default function ColorPickerPage() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [colors, setColors] = useState<Color[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const howToSteps = [
    { title: "Upload Image", description: "Select any image file (PNG, JPG, WebP)" },
    { title: "Auto Extract", description: "Colors are automatically extracted and sorted by dominance" },
    { title: "Copy Colors", description: "Click any color to copy its HEX, RGB, or HSL value" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      setIsProcessing(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        extractColors(result)
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      })
    }
  }

  const extractColors = async (imageData: string) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageData

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d", { willReadFrequently: true })

    // Resize for performance while maintaining accuracy
    const maxSize = 200
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
    canvas.width = img.width * scale
    canvas.height = img.height * scale

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

    const imageDataObj = ctx?.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageDataObj?.data

    if (!pixels) {
      setIsProcessing(false)
      return
    }

    // Collect all colors with better sampling
    const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>()

    // Sample every 4th pixel for better accuracy
    for (let i = 0; i < pixels.length; i += 4 * 4) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const a = pixels[i + 3]

      // Skip transparent pixels
      if (a < 128) continue

      // Quantize colors to reduce similar shades (group by 10)
      const qr = Math.round(r / 10) * 10
      const qg = Math.round(g / 10) * 10
      const qb = Math.round(b / 10) * 10

      const key = `${qr},${qg},${qb}`

      if (colorMap.has(key)) {
        const existing = colorMap.get(key)!
        existing.count++
        // Average the colors for better accuracy
        existing.r = Math.round((existing.r * (existing.count - 1) + r) / existing.count)
        existing.g = Math.round((existing.g * (existing.count - 1) + g) / existing.count)
        existing.b = Math.round((existing.b * (existing.count - 1) + b) / existing.count)
      } else {
        colorMap.set(key, { r, g, b, count: 1 })
      }
    }

    // Sort by frequency and get top colors
    const sortedColors = Array.from(colorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(({ r, g, b, count }) => {
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
        const hsl = rgbToHsl(r, g, b)
        return {
          hex,
          rgb: `rgb(${r}, ${g}, ${b})`,
          hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          count,
        }
      })

    setColors(sortedColors)
    setIsProcessing(false)
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const copyColor = async (color: Color, format: "hex" | "rgb" | "hsl", index: number) => {
    const value = format === "hex" ? color.hex : format === "rgb" ? color.rgb : color.hsl
    await navigator.clipboard.writeText(value)
    setCopiedIndex(index)
    toast({
      title: "Copied!",
      description: `${value} copied to clipboard`,
    })
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <ToolLayout
      title="Color Picker & Palette Generator"
      description="Extract accurate dominant colors from images and generate color palettes. Perfect for design inspiration."
      howToSteps={howToSteps}
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
                <Palette className="h-4 w-4 mr-2" />
                Choose Image
              </label>
            </Button>
            {image && <p className="text-sm text-muted-foreground">{image.name}</p>}
          </div>

          {isProcessing && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-2 text-sm text-muted-foreground">Extracting colors...</p>
            </div>
          )}

          {preview && !isProcessing && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Image Preview</h3>
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
              </div>

              {colors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Extracted Color Palette ({colors.length} colors)</h3>
                  <div className="grid gap-3">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary transition-colors"
                      >
                        <div
                          className="h-16 w-16 rounded-lg border-2 border-border flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-sm font-medium">{color.hex}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => copyColor(color, "hex", index)}
                            >
                              {copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                          <p className="font-mono text-xs text-muted-foreground">{color.rgb}</p>
                          <p className="font-mono text-xs text-muted-foreground">{color.hsl}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
