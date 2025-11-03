"use client"

import { useState } from "react"
import ToolLayout from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { FileUploadZone } from "@/components/file-upload-zone"
import { ResultPreview } from "@/components/result-preview"
import { downloadTextFile } from "@/lib/download-utils"

export default function CsvToJsonPage() {
  const [csvInput, setCsvInput] = useState("")
  const [jsonOutput, setJsonOutput] = useState("")
  const [delimiter, setDelimiter] = useState(",")
  const { toast } = useToast()
  const { error, setError, clearError } = useToolError()

  const howToSteps = [
    { title: "Input CSV", description: "Paste your CSV data or upload a CSV file" },
    { title: "Choose Delimiter", description: "Select comma, semicolon, or tab as delimiter" },
    { title: "Convert", description: "Click Convert or press Ctrl+Enter to generate JSON" },
    { title: "Copy/Download", description: "Copy to clipboard or download as .json file" },
  ]

  const convertToJson = () => {
    clearError()

    if (!csvInput.trim()) {
      setError("Please enter CSV data to convert")
      return
    }

    try {
      const lines = csvInput.trim().split("\n")
      if (lines.length < 2) {
        setError("CSV must have at least a header row and one data row")
        return
      }

      const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ""))

      const result = lines.slice(1).map((line) => {
        const values = line.split(delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ""))
        const obj: Record<string, string> = {}
        headers.forEach((header, index) => {
          obj[header] = values[index] || ""
        })
        return obj
      })

      setJsonOutput(JSON.stringify(result, null, 2))
      toast({
        title: "Success",
        description: "CSV converted to JSON successfully",
      })
    } catch (err) {
      setError("Failed to convert CSV. Please check your data format.")
    }
  }

  const handleReset = () => {
    setCsvInput("")
    setJsonOutput("")
    setDelimiter(",")
    clearError()
  }

  const handleCopy = async () => {
    if (!jsonOutput) return
    await navigator.clipboard.writeText(jsonOutput)
    toast({
      title: "Copied",
      description: "JSON copied to clipboard",
    })
  }

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvInput(text)
    }
    reader.readAsText(file)
  }

  useKeyboardShortcuts({
    onRun: convertToJson,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="CSV to JSON Converter"
      description="Convert CSV data to JSON format instantly. Perfect for developers working with data transformation."
      howToSteps={howToSteps}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-input">CSV Input</Label>
              <Textarea
                id="csv-input"
                placeholder="name,age,city&#10;John,30,New York&#10;Jane,25,Los Angeles"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
              />
            </div>

            <FileUploadZone accept=".csv,.txt" onFileSelect={handleFileUpload} label="Or upload a CSV file" />

            <div className="space-y-2">
              <Label htmlFor="delimiter">Delimiter</Label>
              <select
                id="delimiter"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}

            <div className="flex gap-2">
              <Button onClick={convertToJson} className="flex-1">
                Convert to JSON
              </Button>
              <Button onClick={handleReset} variant="outline" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {jsonOutput && (
          <ResultPreview
            title="JSON Output"
            onCopy={handleCopy}
            onDownload={() => downloadTextFile(jsonOutput, "converted.json", "application/json")}
            downloadLabel="Download JSON"
          >
            <Textarea value={jsonOutput} readOnly className="min-h-[200px] font-mono text-sm bg-muted" />
            <p className="text-xs text-muted-foreground">Character count: {jsonOutput.length}</p>
          </ResultPreview>
        )}
      </div>
    </ToolLayout>
  )
}
