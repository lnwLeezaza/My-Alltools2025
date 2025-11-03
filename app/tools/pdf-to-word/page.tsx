"use client"

import { useState } from "react"
import { FileText, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout } from "@/components/tool-layout"
import { HowToUseModal } from "@/components/how-to-use-modal"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { ToolFeedback } from "@/components/tool-feedback"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { step: 1, title: "Upload PDF", description: "Click or drag your PDF file into the upload zone" },
  { step: 2, title: "Convert", description: 'Click "Convert to Word" and wait for processing' },
  { step: 3, title: "Download", description: "Download your converted Word document" },
]

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const { error, setError, clearError } = useToolError()

  const handleConvert = async () => {
    if (!file) {
      setError("Please upload a PDF file first")
      return
    }

    clearError()
    setConverting(true)

    try {
      // Simulate conversion process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setConverted(true)
    } catch (err) {
      setError("Failed to convert PDF. Please try again.")
    } finally {
      setConverting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setConverted(false)
    clearError()
  }

  const handleDownload = () => {
    // Simulate download
    const blob = new Blob(["Converted Word content"], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file?.name.replace(".pdf", ".docx") || "converted.docx"
    a.click()
    URL.revokeObjectURL(url)
  }

  useKeyboardShortcuts({
    onRun: handleConvert,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="PDF to Word Converter"
      description="Convert PDF documents to editable Word files"
      icon={FileText}
    >
      <HowToUseModal toolName="PDF to Word Converter" steps={howToSteps} />

      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FileUploadZone accept=".pdf" onFileSelect={setFile} file={file} label="Upload PDF File" />

        {file && !converted && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button onClick={handleConvert} disabled={converting}>
                {converting ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Converting...
                  </>
                ) : (
                  "Convert to Word"
                )}
              </Button>
            </div>
          </Card>
        )}

        {converted && (
          <ResultPreview title="Conversion Complete!" description="Your PDF has been converted to Word format">
            <div className="flex gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Word File
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Convert Another
              </Button>
            </div>
          </ResultPreview>
        )}

        <ToolFeedback toolName="PDF to Word Converter" />
      </div>
    </ToolLayout>
  )
}
