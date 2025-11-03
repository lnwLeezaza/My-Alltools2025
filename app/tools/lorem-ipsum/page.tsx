"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw } from "lucide-react"
import { ResultPreview } from "@/components/result-preview"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import { downloadTextFile } from "@/lib/download-utils"

const HOW_TO_STEPS = [
  { title: "Choose Type", description: "Select paragraphs, sentences, or words" },
  { title: "Set Count", description: "Enter how many units you want to generate" },
  { title: "Generate", description: "Click 'Generate Lorem Ipsum' or press Ctrl+Enter" },
  { title: "Copy Text", description: "Use the copy button to copy the generated text" },
]

export default function LoremIpsumPage() {
  const [count, setCount] = useState("5")
  const [type, setType] = useState("paragraphs")
  const [output, setOutput] = useState("")
  const { toast } = useToast()

  const loremWords = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "duis",
    "aute",
    "irure",
    "in",
    "reprehenderit",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "fugiat",
    "nulla",
    "pariatur",
    "excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum",
  ]

  const generateSentence = () => {
    const length = Math.floor(Math.random() * 10) + 8
    let sentence = ""
    for (let i = 0; i < length; i++) {
      const word = loremWords[Math.floor(Math.random() * loremWords.length)]
      sentence += (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word) + " "
    }
    return sentence.trim() + "."
  }

  const generateParagraph = () => {
    const sentences = Math.floor(Math.random() * 4) + 4
    let paragraph = ""
    for (let i = 0; i < sentences; i++) {
      paragraph += generateSentence() + " "
    }
    return paragraph.trim()
  }

  const generateLorem = () => {
    const num = Number.parseInt(count) || 1
    let result = ""

    if (type === "paragraphs") {
      for (let i = 0; i < num; i++) {
        result += generateParagraph() + "\n\n"
      }
    } else if (type === "sentences") {
      for (let i = 0; i < num; i++) {
        result += generateSentence() + " "
      }
    } else {
      for (let i = 0; i < num; i++) {
        result += loremWords[Math.floor(Math.random() * loremWords.length)] + " "
      }
    }

    setOutput(result.trim())
    toast({
      title: "Success",
      description: "Lorem ipsum generated successfully",
    })
  }

  const handleReset = () => {
    setCount("5")
    setType("paragraphs")
    setOutput("")
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  const copyText = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    })
  }

  useKeyboardShortcuts({
    onRun: generateLorem,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs and mockups. Choose paragraphs, sentences, or words."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <Tabs value={type} onValueChange={setType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
                <TabsTrigger value="sentences">Sentences</TabsTrigger>
                <TabsTrigger value="words">Words</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of {type}</label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                max="100"
                placeholder="5"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={generateLorem} className="flex-1">
                Generate Lorem Ipsum
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {output && (
            <ResultPreview
              title="Generated Text"
              onCopy={copyText}
              onDownload={() => downloadTextFile(output, "lorem-ipsum.txt", "text/plain")}
              downloadLabel="Download TXT"
            >
              <div className="p-4 rounded-lg border bg-muted/50 max-h-96 overflow-y-auto">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
              </div>
              <p className="text-xs text-muted-foreground">Character count: {output.length}</p>
            </ResultPreview>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to generate • Ctrl+R to reset
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="Lorem Ipsum Generator" />
      <HelpButton toolName="Lorem Ipsum Generator" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
