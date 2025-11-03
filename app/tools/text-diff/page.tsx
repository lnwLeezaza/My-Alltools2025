"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RotateCcw } from "lucide-react"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"

const HOW_TO_STEPS = [
  { title: "Enter Original", description: "Paste the original text in the left text area" },
  { title: "Enter Modified", description: "Paste the modified text in the right text area" },
  { title: "Compare", description: "Click 'Compare Texts' or press Ctrl+Enter" },
  { title: "Review Changes", description: "Green highlights show additions, red shows deletions" },
]

export default function TextDiffPage() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [diff, setDiff] = useState<{ type: string; value: string }[]>([])
  const { toast } = useToast()

  const comparTexts = () => {
    if (!text1 || !text2) {
      toast({
        title: "Error",
        description: "Please enter text in both fields",
        variant: "destructive",
      })
      return
    }

    // Simple word-by-word diff
    const words1 = text1.split(/\s+/)
    const words2 = text2.split(/\s+/)
    const result: { type: string; value: string }[] = []

    let i = 0
    let j = 0

    while (i < words1.length || j < words2.length) {
      if (i >= words1.length) {
        result.push({ type: "added", value: words2[j] })
        j++
      } else if (j >= words2.length) {
        result.push({ type: "removed", value: words1[i] })
        i++
      } else if (words1[i] === words2[j]) {
        result.push({ type: "unchanged", value: words1[i] })
        i++
        j++
      } else {
        result.push({ type: "removed", value: words1[i] })
        result.push({ type: "added", value: words2[j] })
        i++
        j++
      }
    }

    setDiff(result)
    toast({
      title: "Success",
      description: "Text comparison complete",
    })
  }

  const handleReset = () => {
    setText1("")
    setText2("")
    setDiff([])
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  useKeyboardShortcuts({
    onRun: comparTexts,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two texts and highlight the differences. Perfect for reviewing changes and finding modifications."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Original Text</label>
              <Textarea
                placeholder="Enter original text..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Modified Text</label>
              <Textarea
                placeholder="Enter modified text..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={comparTexts} className="flex-1">
              Compare Texts
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {diff.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-green-500/20 border border-green-500" />
                  <span>Added</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-red-500/20 border border-red-500" />
                  <span>Removed</span>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/50 font-mono text-sm leading-relaxed">
                {diff.map((item, index) => (
                  <span
                    key={index}
                    className={
                      item.type === "added"
                        ? "bg-green-500/20 text-green-700 dark:text-green-400 px-1 rounded"
                        : item.type === "removed"
                          ? "bg-red-500/20 text-red-700 dark:text-red-400 px-1 rounded line-through"
                          : ""
                    }
                  >
                    {item.value}{" "}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to compare • Ctrl+R to reset
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="Text Diff Checker" />
      <HelpButton toolName="Text Diff Checker" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
