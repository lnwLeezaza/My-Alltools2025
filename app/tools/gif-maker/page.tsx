"use client"

import { useState } from "react"
import { Video, Download, Plus, X } from "lucide-react"
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
  { title: "Upload Images", description: "Select 2 or more images for your GIF" },
  { title: "Adjust Settings", description: "Set frame delay and loop options" },
  { title: "Create & Download", description: "Generate and download your animated GIF" },
]

export default function GifMakerPage() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [delay, setDelay] = useState([500])
  const [gifUrl, setGifUrl] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { error, setError, clearError } = useToolError()

  const handleFileSelect = (selectedFile: File) => {
    clearError()
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload valid image files")
      return
    }

    const newFiles = [...files, selectedFile]
    setFiles(newFiles)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviews([...previews, e.target?.result as string])
    }
    reader.readAsDataURL(selectedFile)
    setGifUrl("")
  }

  const removeImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleCreate = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 images")
      return
    }

    setIsProcessing(true)
    clearError()

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would use a library like gif.js
      setGifUrl("/animated-gif.jpg")
    } catch (err) {
      setError("Failed to create GIF. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setPreviews([])
    setGifUrl("")
    setDelay([500])
    clearError()
  }

  useKeyboardShortcuts({
    onRun: handleCreate,
    onReset: handleReset,
    canRun: files.length >= 2 && !isProcessing,
  })

  return (
    <ToolLayout title="GIF Maker" description="Create animated GIFs from images" howToSteps={howToSteps}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Video className="h-5 w-5" />
            Upload Images ({files.length})
          </h2>

          <FileUploadZone
            onFileSelect={handleFileSelect}
            accept="image/*"
            maxSize={5}
            icon={Plus}
            label="Add images to GIF"
            description="Upload 2+ images (max 5MB each)"
          />

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Frame ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <Label>Frame Delay: {delay[0]}ms</Label>
              <Slider value={delay} onValueChange={setDelay} min={100} max={2000} step={100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">Time between frames (lower = faster animation)</p>
            </div>
          </div>

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <div className="flex gap-2 mt-6">
            <Button onClick={handleCreate} disabled={files.length < 2 || isProcessing} className="flex-1">
              {isProcessing ? "Creating GIF..." : "Create GIF"}
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        <ResultPreview title="Animated GIF" show={!!gifUrl} icon={Download}>
          <img src={gifUrl || "/placeholder.svg"} alt="Generated GIF" className="w-full rounded-lg border" />
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p>Frames: {files.length}</p>
            <p>Delay: {delay[0]}ms per frame</p>
          </div>
          <Button className="w-full mt-4" asChild>
            <a href={gifUrl} download="animated.gif">
              <Download className="mr-2 h-4 w-4" />
              Download GIF
            </a>
          </Button>
        </ResultPreview>
      </div>
    </ToolLayout>
  )
}
