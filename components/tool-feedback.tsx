"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface ToolFeedbackProps {
  toolName: string
}

export function ToolFeedback({ toolName }: ToolFeedbackProps) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)
  const { toast } = useToast()

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type)
    // Store feedback in localStorage
    const existingFeedback = JSON.parse(localStorage.getItem("toolFeedback") || "{}")
    existingFeedback[toolName] = { type, timestamp: Date.now() }
    localStorage.setItem("toolFeedback", JSON.stringify(existingFeedback))

    toast({
      title: "Thank you!",
      description: "Your feedback helps us improve.",
    })
  }

  if (feedback) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
        <CardContent className="pt-4 sm:pt-6">
          <p className="text-sm text-center text-green-700 dark:text-green-400">Thank you for your feedback!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <div className="text-center space-y-3">
          <p className="text-sm font-medium">Was this tool helpful?</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback("positive")}
              className="w-full sm:w-auto h-11 sm:h-9"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Yes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback("negative")}
              className="w-full sm:w-auto h-11 sm:h-9"
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              No
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
