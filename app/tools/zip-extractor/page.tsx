"use client"

import { useState } from "react"
import { Archive, Download, FileIcon, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ToolLayout from "@/components/tool-layout"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { title: "Upload Archive", description: "Select a ZIP or RAR file to extract" },
  { title: "Extract", description: 'Click "Extract Files" to unpack the archive' },
  { title: "Download", description: "Download individual files or all at once" },
]

interface ExtractedFile {
  name: string
  size: number
  type: string
}

export default function ZipExtractorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { error, setError, clearError } = useToolError()

  const handleFileSelect = (selectedFile: File) => {
    clearError()
    const validTypes = ["application/zip", "application/x-zip-compressed", "application/x-rar-compressed"]
    if (
      !validTypes.includes(selectedFile.type) &&
      !selectedFile.name.endsWith(".zip") &&
      !selectedFile.name.endsWith(".rar")
    ) {
      setError("Please upload a valid ZIP or RAR file")
      return
    }
    setFile(selectedFile)
    setExtractedFiles([])
  }

  const handleExtract = async () => {
    if (!file) return

    setIsProcessing(true)
    clearError()

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock extracted files
      const mockFiles: ExtractedFile[] = [
        { name: "document.pdf", size: 245000, type: "application/pdf" },
        { name: "image.jpg", size: 156000, type: "image/jpeg" },
        { name: "data.json", size: 12000, type: "application/json" },
        { name: "readme.txt", size: 3400, type: "text/plain" },
        { name: "styles.css", size: 8900, type: "text/css" },
      ]

      setExtractedFiles(mockFiles)
    } catch (err) {
      setError("Failed to extract archive. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setExtractedFiles([])
    clearError()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1024 / 1024).toFixed(1) + " MB"
  }

  useKeyboardShortcuts({
    onRun: handleExtract,
    onReset: handleReset,
    canRun: !!file && !isProcessing,
  })

  return (
    <ToolLayout title="ZIP Extractor" description="Extract files from ZIP and RAR archives" howToSteps={howToSteps}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Upload Archive
          </h2>

          <FileUploadZone
            onFileSelect={handleFileSelect}
            accept=".zip,.rar"
            maxSize={100}
            icon={Archive}
            label="Drop ZIP or RAR file here"
            description="Supports ZIP, RAR (max 100MB)"
          />

          {file && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
            </div>
          )}

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <div className="flex gap-2 mt-6">
            <Button onClick={handleExtract} disabled={!file || isProcessing} className="flex-1">
              {isProcessing ? "Extracting..." : "Extract Files"}
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        <ResultPreview title="Extracted Files" show={extractedFiles.length > 0} icon={Folder}>
          <div className="space-y-2">
            {extractedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4">
            <Download className="mr-2 h-4 w-4" />
            Download All Files
          </Button>
        </ResultPreview>
      </div>
    </ToolLayout>
  )
}
