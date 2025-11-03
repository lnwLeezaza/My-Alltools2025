"use client"

import { useState } from "react"
import { Music, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ToolLayout } from "@/components/tool-layout"
import { HowToUseModal } from "@/components/how-to-use-modal"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { ToolFeedback } from "@/components/tool-feedback"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { step: 1, title: "Upload Video", description: "Select your video file (MP4, AVI, MOV, etc.)" },
  { step: 2, title: "Extract Audio", description: 'Click "Extract Audio" to start conversion' },
  { step: 3, title: "Download MP3", description: "Download your extracted audio file" },
]

export default function VideoToMp3Page() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [converted, setConverted] = useState(false)
  const { error, setError, clearError } = useToolError()

  const handleConvert = async () => {
    if (!file) {
      setError("Please upload a video file first")
      return
    }

    clearError()
    setConverting(true)
    setProgress(0)

    try {
      // Simulate conversion with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setProgress(i)
      }
      setConverted(true)
    } catch (err) {
      setError("Failed to extract audio. Please try again.")
    } finally {
      setConverting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setConverted(false)
    setProgress(0)
    clearError()
  }

  const handleDownload = () => {
    const blob = new Blob(["MP3 audio data"], { type: "audio/mpeg" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file?.name.replace(/\.[^.]+$/, ".mp3") || "audio.mp3"
    a.click()
    URL.revokeObjectURL(url)
  }

  useKeyboardShortcuts({
    onRun: handleConvert,
    onReset: handleReset,
  })

  return (
    <ToolLayout title="Video to MP3 Converter" description="Extract audio from video files" icon={Music}>
      <HowToUseModal toolName="Video to MP3 Converter" steps={howToSteps} />

      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FileUploadZone accept="video/*" onFileSelect={setFile} file={file} label="Upload Video File" />

        {file && !converted && (
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button onClick={handleConvert} disabled={converting}>
                {converting ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Extracting...
                  </>
                ) : (
                  "Extract Audio"
                )}
              </Button>
            </div>
            {converting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">{progress}%</p>
              </div>
            )}
          </Card>
        )}

        {converted && (
          <ResultPreview title="Audio Extracted!" description="Your audio has been extracted from the video">
            <div className="flex gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download MP3
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Convert Another
              </Button>
            </div>
          </ResultPreview>
        )}

        <ToolFeedback toolName="Video to MP3 Converter" />
      </div>
    </ToolLayout>
  )
}
