"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, RefreshCw, RotateCcw, Download } from "lucide-react"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import { downloadTextFile } from "@/lib/download-utils"

const HOW_TO_STEPS = [
  { title: "Set Count", description: "Enter how many UUIDs you want to generate (1-50)" },
  { title: "Generate", description: "Click 'Generate UUIDs' or press Ctrl+Enter" },
  { title: "Copy Individual", description: "Click the copy icon next to any UUID" },
  { title: "Copy All", description: "Use 'Copy All' button to copy all UUIDs at once" },
]

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState("5")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const generateUUID = () => {
    return crypto.randomUUID()
  }

  const generateUUIDs = () => {
    const num = Math.min(Number.parseInt(count) || 1, 50)
    const newUuids = Array.from({ length: num }, () => generateUUID())
    setUuids(newUuids)
    toast({
      title: "Success",
      description: `Generated ${num} UUID${num > 1 ? "s" : ""}`,
    })
  }

  const handleReset = () => {
    setUuids([])
    setCount("5")
    setCopiedIndex(null)
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  const copyUuid = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid)
    setCopiedIndex(index)
    toast({
      title: "Copied",
      description: "UUID copied to clipboard",
    })
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"))
    toast({
      title: "Copied",
      description: "All UUIDs copied to clipboard",
    })
  }

  const downloadAll = () => {
    downloadTextFile(uuids.join("\n"), "uuids.txt", "text/plain")
    toast({
      title: "Downloaded",
      description: "UUIDs downloaded successfully",
    })
  }

  useKeyboardShortcuts({
    onRun: generateUUIDs,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate unique identifiers (UUIDs/GUIDs) for databases, APIs, and applications. Version 4 (random) UUIDs."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of UUIDs</label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                max="50"
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">Maximum 50 UUIDs at once</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={generateUUIDs} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate UUIDs
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {uuids.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{uuids.length} UUID(s) Generated</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyAll}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg border hover:border-primary transition-colors"
                  >
                    <span className="flex-1 font-mono text-sm break-all">{uuid}</span>
                    <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => copyUuid(uuid, index)}>
                      {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-muted/50 text-sm space-y-2">
            <p className="font-medium">About UUIDs</p>
            <p className="text-muted-foreground">
              UUIDs (Universally Unique Identifiers) are 128-bit numbers used to uniquely identify information. They are
              commonly used in databases, distributed systems, and APIs.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Keyboard shortcuts:</strong> Ctrl+Enter to generate • Ctrl+R to reset
          </p>
        </CardContent>
      </Card>

      <ToolFeedback toolName="UUID Generator" />
      <HelpButton toolName="UUID Generator" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
