"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Check, RefreshCw, RotateCcw } from "lucide-react"
import { HelpButton } from "@/components/help-button"
import { ToolFeedback } from "@/components/tool-feedback"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"

const HOW_TO_STEPS = [
  "Adjust the password length using the slider (8-64 characters)",
  "Select which character types to include (uppercase, lowercase, numbers, symbols)",
  "Click 'Generate Password' or press Ctrl+Enter",
  "Copy the password and check its strength indicator",
]

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generatePassword = () => {
    let charset = ""
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let newPassword = ""
    const array = new Uint32Array(length[0])
    crypto.getRandomValues(array)

    for (let i = 0; i < length[0]; i++) {
      newPassword += charset[array[i] % charset.length]
    }

    setPassword(newPassword)
    toast({
      title: "Success",
      description: "Password generated successfully",
    })
  }

  const copyPassword = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    toast({
      title: "Copied",
      description: "Password copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setPassword("")
    setLength([16])
    setIncludeUppercase(true)
    setIncludeLowercase(true)
    setIncludeNumbers(true)
    setIncludeSymbols(true)
    toast({
      title: "Reset",
      description: "Settings reset to defaults",
    })
  }

  useKeyboardShortcuts({
    onRun: generatePassword,
    onReset: handleReset,
  })

  const getStrength = () => {
    if (!password) return { text: "", color: "" }
    const len = password.length
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSymbol = /[^A-Za-z0-9]/.test(password)

    const variety = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length

    if (len < 8 || variety < 2) return { text: "Weak", color: "text-destructive" }
    if (len < 12 || variety < 3) return { text: "Medium", color: "text-yellow-600" }
    if (len < 16 || variety < 4) return { text: "Strong", color: "text-green-600" }
    return { text: "Very Strong", color: "text-green-700" }
  }

  const strength = getStrength()

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure, and random passwords. Customize length and character types for your needs."
      howToSteps={HOW_TO_STEPS}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Generated Password</label>
                <span className={`text-sm font-medium ${strength.color}`}>{strength.text}</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 p-4 rounded-lg bg-muted font-mono text-lg break-all">{password}</div>
                <Button variant="outline" size="icon" onClick={copyPassword}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password Length: {length[0]}</label>
              </div>
              <Slider value={length} onValueChange={setLength} min={8} max={64} step={1} />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Character Types</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                  />
                  <label htmlFor="uppercase" className="text-sm cursor-pointer">
                    Uppercase Letters (A-Z)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                  />
                  <label htmlFor="lowercase" className="text-sm cursor-pointer">
                    Lowercase Letters (a-z)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                  />
                  <label htmlFor="numbers" className="text-sm cursor-pointer">
                    Numbers (0-9)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                  />
                  <label htmlFor="symbols" className="text-sm cursor-pointer">
                    Symbols (!@#$%^&*)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generatePassword} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Password
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
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

      <ToolFeedback toolName="Password Generator" />
      <HelpButton toolName="Password Generator" steps={HOW_TO_STEPS} />
    </ToolLayout>
  )
}
