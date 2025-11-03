"use client"

import { useState } from "react"
import { Scissors, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"
import { HowToUseModal } from "@/components/how-to-use-modal"
import { ToolFeedback } from "@/components/tool-feedback"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const howToSteps = [
  { step: 1, title: "Paste Text", description: "Paste text with unwanted line breaks" },
  { step: 2, title: "Remove Breaks", description: 'Click "Remove Line Breaks" button' },
  { step: 3, title: "Copy Result", description: "Copy the cleaned text" },
]

export default function LineBreakRemoverPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const removeLineBreaks = () => {
    const result = input.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
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
    onRun: removeLineBreaks,
    onReset: handleReset,
  })

  return (
    <ToolLayout title="Line Break Remover" description="Remove unwanted line breaks from text" icon={Scissors}>
      <HowToUseModal toolName="Line Break Remover" steps={howToSteps} />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Input Text</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text with line breaks here..."
            rows={8}
          />
        </div>

        <Button onClick={removeLineBreaks} disabled={!input}>
          Remove Line Breaks
        </Button>

        {output && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Cleaned Text</label>
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
            <Textarea value={output} readOnly rows={8} />
          </Card>
        )}

        <ToolFeedback toolName="Line Break Remover" />
      </div>
    </ToolLayout>
  )
}
