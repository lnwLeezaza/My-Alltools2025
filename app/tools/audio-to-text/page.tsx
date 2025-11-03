"use client"

import { useState } from "react"
import { Upload, Download, Loader2, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import ToolLayout from "@/components/tool-layout"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { title: "Upload Audio", description: "Select an audio file (MP3, WAV, M4A)" },
  { title: "Process", description: 'Click "Transcribe" to convert speech to text' },
  { title: "Review & Copy", description: "Review the transcription and copy or download" },
]

export default function AudioToTextPage() {
  const [file, setFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { error, setError, clearError } = useToolError()

  const handleFileSelect = (selectedFile: File) => {
    clearError()
    const validTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"]
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a valid audio file (MP3, WAV, M4A)")
      return
    }
    setFile(selectedFile)
    setTranscription("")
  }

  const handleTranscribe = async () => {
    if (!file) return

    setIsProcessing(true)
    clearError()

    try {
      // Simulate transcription processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock transcription result
      const mockTranscription = `This is a simulated transcription of the audio file "${file.name}". 

In a real implementation, this would use a speech-to-text API like:
- OpenAI Whisper API
- Google Cloud Speech-to-Text
- AWS Transcribe
- Azure Speech Services

The transcription would contain the actual spoken words from your audio file, with proper punctuation and formatting.

For now, this is a demonstration of how the tool would work. Upload your audio file and the transcription would appear here with timestamps and speaker identification if available.`

      setTranscription(mockTranscription)
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setTranscription("")
    clearError()
  }

  const handleDownload = () => {
    const blob = new Blob([transcription], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${file?.name.replace(/\.[^/.]+$/, "")}_transcription.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  useKeyboardShortcuts({
    onRun: handleTranscribe,
    onReset: handleReset,
    canRun: !!file && !isProcessing,
  })

  return (
    <ToolLayout
      title="Audio to Text Converter"
      description="Convert speech to text transcription"
      howToSteps={howToSteps}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Upload Audio File
          </h2>

          <FileUploadZone
            onFileSelect={handleFileSelect}
            accept="audio/*"
            maxSize={50}
            icon={Upload}
            label="Drop audio file here or click to browse"
            description="Supports MP3, WAV, M4A (max 50MB)"
          />

          {file && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <div className="flex gap-2 mt-6">
            <Button onClick={handleTranscribe} disabled={!file || isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Transcribe Audio
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        <ResultPreview title="Transcription Result" show={!!transcription} icon={Download}>
          <Textarea value={transcription} readOnly className="min-h-[400px] font-mono text-sm" />
          <Button onClick={handleDownload} className="w-full mt-4">
            <Download className="mr-2 h-4 w-4" />
            Download Transcription
          </Button>
        </ResultPreview>
      </div>
    </ToolLayout>
  )
}
