"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RotateCcw } from "lucide-react"
import { ResultPreview } from "@/components/result-preview"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import { downloadTextFile } from "@/lib/download-utils"

const HOW_TO_STEPS = [
  "Paste your JSON data into the input text area",
  "Click 'Format & Validate' to beautify or 'Minify' to compress",
  "Copy the formatted output or fix any validation errors shown",
  "Use Ctrl+Enter to format quickly",
]

export default function JsonFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const { handleError } = useToolError()
  const { toast } = useToast()

  const formatJson = () => {
    try {
      if (!input.trim()) {
        toast({
          title: "Error",
          description: "Please enter JSON data",
          variant: "destructive",
        })
        return
      }
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError("")
      toast({
        title: "Success",
        description: "JSON formatted successfully",
      })
    } catch (err) {
      const errorMsg = "Invalid JSON: " + (err as Error).message
      setError(errorMsg)
      setOutput("")
      handleError(err, errorMsg)
    }
  }

  const minifyJson = () => {
    try {
      if (!input.trim()) {
        toast({
          title: "Error",
          description: "Please enter JSON data",
          variant: "destructive",
        })
        return
      }
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError("")
      toast({
        title: "Success",
        description: "JSON minified successfully",
      })
    } catch (err) {
      const errorMsg = "Invalid JSON: " + (err as Error).message
      setError(errorMsg)
      setOutput("")
      handleError(err, errorMsg)
    }
  }

  const handleReset = () => {
    setInput("")
    setOutput("")
    setError("")
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied",
      description: "JSON copied to clipboard",
    })
  }

  useKeyboardShortcuts({
    onRun: formatJson,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, and minify JSON data. Paste your JSON to beautify or compress it."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input JSON</label>
            <Textarea
              placeholder='{"name": "John", "age": 30}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={formatJson} className="flex-1">
              Format & Validate
            </Button>
            <Button onClick={minifyJson} variant="outline" className="flex-1 bg-transparent">
              Minify
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              <p className="font-semibold mb-1">Validation Error</p>
              <p className="text-xs">{error}</p>
            </div>
          )}

          {output && (
            <ResultPreview
              title="Formatted Output"
              onCopy={copyToClipboard}
              onDownload={() => downloadTextFile(output, "formatted.json", "application/json")}
              downloadLabel="Download JSON"
            >
              <Textarea value={output} readOnly className="min-h-[200px] font-mono text-sm bg-muted" />
              <p className="text-xs text-muted-foreground">Character count: {output.length}</p>
            </ResultPreview>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to format • Ctrl+R to reset
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="JSON Formatter" />
      <HelpButton toolName="JSON Formatter" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
