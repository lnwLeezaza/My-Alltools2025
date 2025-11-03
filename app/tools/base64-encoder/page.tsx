"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw } from "lucide-react"
import { ResultPreview } from "@/components/result-preview"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import { downloadTextFile } from "@/lib/download-utils"

const HOW_TO_STEPS = [
  {
    title: "Choose Mode",
    description: "Select 'Encode' to convert text to Base64, or 'Decode' to convert Base64 back to text",
  },
  { title: "Enter Text", description: "Paste or type your text in the input area" },
  { title: "Convert", description: "Click the encode/decode button or press Ctrl+Enter" },
  { title: "Copy Result", description: "Use the copy button to copy the result to your clipboard" },
]

export default function Base64EncoderPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState("encode")
  const { handleError } = useToolError()
  const { toast } = useToast()

  const encode = () => {
    try {
      if (!input.trim()) {
        toast({
          title: "Error",
          description: "Please enter text to encode",
          variant: "destructive",
        })
        return
      }
      const encoded = btoa(input)
      setOutput(encoded)
      toast({
        title: "Success",
        description: "Text encoded successfully",
      })
    } catch (err) {
      handleError(err, "Failed to encode text")
    }
  }

  const decode = () => {
    try {
      if (!input.trim()) {
        toast({
          title: "Error",
          description: "Please enter Base64 string to decode",
          variant: "destructive",
        })
        return
      }
      const decoded = atob(input)
      setOutput(decoded)
      toast({
        title: "Success",
        description: "Text decoded successfully",
      })
    } catch (err) {
      handleError(err, "Invalid Base64 string")
    }
  }

  const handleReset = () => {
    setInput("")
    setOutput("")
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    })
  }

  useKeyboardShortcuts({
    onRun: mode === "encode" ? encode : decode,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 strings back to plain text."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <Tabs value={mode} onValueChange={setMode} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>

            <TabsContent value="encode" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plain Text</label>
                <Textarea
                  placeholder="Enter text to encode..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={encode} className="flex-1">
                  Encode to Base64
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="decode" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base64 String</label>
                <Textarea
                  placeholder="Enter Base64 string to decode..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={decode} className="flex-1">
                  Decode from Base64
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {output && (
              <ResultPreview
                title="Result"
                onCopy={copyToClipboard}
                onDownload={() =>
                  downloadTextFile(output, mode === "encode" ? "encoded.txt" : "decoded.txt", "text/plain")
                }
                downloadLabel="Download as TXT"
              >
                <Textarea value={output} readOnly className="min-h-[150px] font-mono text-sm bg-muted" />
                <p className="text-xs text-muted-foreground">Character count: {output.length}</p>
              </ResultPreview>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to encode/decode • Ctrl+R to reset
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="Base64 Encoder" />
      <HelpButton toolName="Base64 Encoder" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
