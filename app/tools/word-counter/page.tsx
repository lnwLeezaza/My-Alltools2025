"use client"

import { useState, useMemo } from "react"
import { Hash } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"
import { HowToUseModal } from "@/components/how-to-use-modal"
import { ToolFeedback } from "@/components/tool-feedback"

const howToSteps = [
  { step: 1, title: "Enter Text", description: "Type or paste your text in the input area" },
  { step: 2, title: "View Stats", description: "See real-time word and character counts" },
  { step: 3, title: "Analyze", description: "Review detailed statistics about your text" },
]

export default function WordCounterPage() {
  const [text, setText] = useState("")

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim()).length
    const readingTime = Math.ceil(words / 200) // Average reading speed

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
    }
  }, [text])

  return (
    <ToolLayout
      title="Word & Character Counter"
      description="Count words, characters, and analyze your text"
      icon={Hash}
    >
      <HowToUseModal toolName="Word & Character Counter" steps={howToSteps} />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Enter Your Text</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            rows={10}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.words}</p>
            <p className="text-sm text-muted-foreground">Words</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.characters}</p>
            <p className="text-sm text-muted-foreground">Characters</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.charactersNoSpaces}</p>
            <p className="text-sm text-muted-foreground">Characters (no spaces)</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.sentences}</p>
            <p className="text-sm text-muted-foreground">Sentences</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.paragraphs}</p>
            <p className="text-sm text-muted-foreground">Paragraphs</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.readingTime}</p>
            <p className="text-sm text-muted-foreground">Min. to Read</p>
          </Card>
        </div>

        <ToolFeedback toolName="Word & Character Counter" />
      </div>
    </ToolLayout>
  )
}
