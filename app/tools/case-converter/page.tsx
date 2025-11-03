"use client"

import { useState } from "react"
import { Type, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"
import { HowToUseModal } from "@/components/how-to-use-modal"
import { ToolFeedback } from "@/components/tool-feedback"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { step: 1, title: "Enter Text", description: "Type or paste your text in the input area" },
  { step: 2, title: "Choose Case", description: "Click on the desired case conversion button" },
  { step: 3, title: "Copy Result", description: "Copy the converted text to your clipboard" },
]

export default function CaseConverterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const convertCase = (type: string) => {
    let result = ""
    switch (type) {
      case "upper":
        result = input.toUpperCase()
        break
      case "lower":
        result = input.toLowerCase()
        break
      case "sentence":
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        break
      case "title":
        result = input.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        break
      case "camel":
        result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        break
      case "snake":
        result = input.toLowerCase().replace(/\s+/g, "_")
        break
    }
    setOutput(result)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setInput("")
    setOutput("")
  }

  useKeyboardShortcuts({
    onReset: handleReset,
  })

  return (
    <ToolLayout title="Text Case Converter" description="Convert text to different cases" icon={Type}>
      <HowToUseModal toolName="Text Case Converter" steps={howToSteps} />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Input Text</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
            rows={6}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button onClick={() => convertCase("upper")} variant="outline">
            UPPERCASE
          </Button>
          <Button onClick={() => convertCase("lower")} variant="outline">
            lowercase
          </Button>
          <Button onClick={() => convertCase("sentence")} variant="outline">
            Sentence case
          </Button>
          <Button onClick={() => convertCase("title")} variant="outline">
            Title Case
          </Button>
          <Button onClick={() => convertCase("camel")} variant="outline">
            camelCase
          </Button>
          <Button onClick={() => convertCase("snake")} variant="outline">
            snake_case
          </Button>
        </div>

        {output && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Converted Text</label>
              <Button size="sm" variant="ghost" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea value={output} readOnly rows={6} />
          </Card>
        )}

        <ToolFeedback toolName="Text Case Converter" />
      </div>
    </ToolLayout>
  )
}
