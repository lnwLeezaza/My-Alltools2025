"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw } from "lucide-react"
import { ResultPreview } from "@/components/result-preview"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useToolError } from "@/hooks/use-tool-error"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"

const HOW_TO_STEPS = [
  { title: "Choose Language", description: "Select the code language (JSON, HTML, CSS, JavaScript)" },
  { title: "Paste Code", description: "Paste your code in the input area" },
  { title: "Beautify", description: "Click 'Beautify Code' or press Ctrl+Enter" },
  { title: "Copy Result", description: "Copy the formatted code to your clipboard" },
]

export default function CodeBeautifierPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [language, setLanguage] = useState("json")
  const { handleError } = useToolError()
  const { toast } = useToast()

  const beautifyCode = () => {
    try {
      if (!input.trim()) {
        toast({
          title: "Error",
          description: "Please enter code to beautify",
          variant: "destructive",
        })
        return
      }

      let formatted = ""

      if (language === "json") {
        const parsed = JSON.parse(input)
        formatted = JSON.stringify(parsed, null, 2)
      } else {
        // For HTML/CSS/JS, basic formatting
        formatted = input
          .split("\n")
          .map((line) => line.trim())
          .join("\n")
      }

      setOutput(formatted)
      toast({
        title: "Success",
        description: "Code formatted successfully",
      })
    } catch (err) {
      handleError(err, "Failed to format code")
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

  const copyCode = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    })
  }

  useKeyboardShortcuts({
    onRun: beautifyCode,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="Code Beautifier"
      description="Format and beautify HTML, CSS, JavaScript, and JSON code. Make your code more readable and organized."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <Tabs value={language} onValueChange={setLanguage}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <label className="text-sm font-medium">Input Code</label>
            <Textarea
              placeholder={`Paste your ${language.toUpperCase()} code here...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={beautifyCode} className="flex-1">
              Beautify Code
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {output && (
            <ResultPreview title="Formatted Code" onCopy={copyCode}>
              <Textarea value={output} readOnly className="min-h-[200px] font-mono text-sm bg-muted" />
              <p className="text-xs text-muted-foreground">Lines: {output.split("\n").length}</p>
            </ResultPreview>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to beautify • Ctrl+R to reset
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="Code Beautifier" />
      <HelpButton toolName="Code Beautifier" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
