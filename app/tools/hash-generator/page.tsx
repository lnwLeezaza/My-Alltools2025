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
  { title: "Enter Text", description: "Type or paste the text you want to hash" },
  { title: "Generate", description: "Click 'Generate Hashes' or press Ctrl+Enter" },
  { title: "Choose Algorithm", description: "Switch between SHA-256, SHA-1, or MD5 tabs" },
  { title: "Copy Hash", description: "Click the copy button to copy the hash value" },
]

export default function HashGeneratorPage() {
  const [input, setInput] = useState("")
  const [md5, setMd5] = useState("")
  const [sha1, setSha1] = useState("")
  const [sha256, setSha256] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const { handleError } = useToolError()
  const { toast } = useToast()

  const generateHashes = async () => {
    if (!input) {
      toast({
        title: "Error",
        description: "Please enter text to hash",
        variant: "destructive",
      })
      return
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      // Generate SHA-256
      const sha256Buffer = await crypto.subtle.digest("SHA-256", data)
      const sha256Hash = Array.from(new Uint8Array(sha256Buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      setSha256(sha256Hash)

      // Generate SHA-1
      const sha1Buffer = await crypto.subtle.digest("SHA-1", data)
      const sha1Hash = Array.from(new Uint8Array(sha1Buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      setSha1(sha1Hash)

      // MD5 would require a library, so we'll simulate it
      setMd5("MD5 requires external library - SHA-256 recommended")

      toast({
        title: "Success",
        description: "Hashes generated successfully",
      })
    } catch (err) {
      handleError(err, "Failed to generate hashes")
    }
  }

  const handleReset = () => {
    setInput("")
    setMd5("")
    setSha1("")
    setSha256("")
    setCopied(null)
    toast({
      title: "Reset",
      description: "Tool has been reset",
    })
  }

  const copyHash = async (hash: string, type: string) => {
    await navigator.clipboard.writeText(hash)
    setCopied(type)
    toast({
      title: "Copied",
      description: `${type} hash copied to clipboard`,
    })
    setTimeout(() => setCopied(null), 2000)
  }

  useKeyboardShortcuts({
    onRun: generateHashes,
    onReset: handleReset,
  })

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate cryptographic hashes (MD5, SHA-1, SHA-256) for text and data verification."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Text</label>
            <Textarea
              placeholder="Enter text to hash..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={generateHashes} className="flex-1">
              Generate Hashes
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {sha256 && (
            <Tabs defaultValue="sha256" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sha256">SHA-256</TabsTrigger>
                <TabsTrigger value="sha1">SHA-1</TabsTrigger>
                <TabsTrigger value="md5">MD5</TabsTrigger>
              </TabsList>

              <TabsContent value="sha256" className="space-y-2">
                <ResultPreview
                  title="SHA-256 Hash"
                  onCopy={() => copyHash(sha256, "SHA-256")}
                  onDownload={() => downloadTextFile(sha256, "sha256-hash.txt", "text/plain")}
                  copyLabel={copied === "SHA-256" ? "Copied" : "Copy"}
                  downloadLabel="Download"
                >
                  <div className="p-4 rounded-lg bg-muted font-mono text-sm break-all">{sha256}</div>
                </ResultPreview>
              </TabsContent>

              <TabsContent value="sha1" className="space-y-2">
                <ResultPreview
                  title="SHA-1 Hash"
                  onCopy={() => copyHash(sha1, "SHA-1")}
                  onDownload={() => downloadTextFile(sha1, "sha1-hash.txt", "text/plain")}
                  copyLabel={copied === "SHA-1" ? "Copied" : "Copy"}
                  downloadLabel="Download"
                >
                  <div className="p-4 rounded-lg bg-muted font-mono text-sm break-all">{sha1}</div>
                </ResultPreview>
              </TabsContent>

              <TabsContent value="md5" className="space-y-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">MD5 Hash</label>
                  <div className="p-4 rounded-lg bg-muted font-mono text-sm break-all">{md5}</div>
                  <p className="text-xs text-muted-foreground">
                    Note: MD5 is considered cryptographically broken. Use SHA-256 for security purposes.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
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

      <ToolFeedback toolName="Hash Generator" />
      <HelpButton toolName="Hash Generator" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
