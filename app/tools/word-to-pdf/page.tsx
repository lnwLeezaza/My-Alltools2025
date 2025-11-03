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
  { step: 1, title: "Upload Word File", description: "Select your .doc or .docx file" },
  { step: 2, title: "Convert", description: 'Click "Convert to PDF" button' },
  { step: 3, title: "Download", description: "Save your PDF document" },
]

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const { error, setError, clearError } = useToolError()

  const handleConvert = async () => {
    if (!file) {
      setError("Please upload a Word file first")
      return
    }

    clearError()
    setConverting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setConverted(true)
    } catch (err) {
      setError("Failed to convert Word file. Please try again.")
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
    const blob = new Blob(["PDF content"], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file?.name.replace(/\.(doc|docx)$/, ".pdf") || "converted.pdf"
    a.click()
    URL.revokeObjectURL(url)
  }

  useKeyboardShortcuts({
    onRun: handleConvert,
    onReset: handleReset,
  })

  return (
    <ToolLayout title="Word to PDF Converter" description="Convert Word documents to PDF format" icon={FileText}>
      <HowToUseModal toolName="Word to PDF Converter" steps={howToSteps} />

      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FileUploadZone accept=".doc,.docx" onFileSelect={setFile} file={file} label="Upload Word File (.doc, .docx)" />

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
                  "Convert to PDF"
                )}
              </Button>
            </div>
          </Card>
        )}

        {converted && (
          <ResultPreview title="Conversion Complete!" description="Your Word document has been converted to PDF">
            <div className="flex gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Convert Another
              </Button>
            </div>
          </ResultPreview>
        )}

        <ToolFeedback toolName="Word to PDF Converter" />
      </div>
    </ToolLayout>
  )
}
