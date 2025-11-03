"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export function useToolError() {
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      const message =
        customMessage || (error instanceof Error ? error.message : "Something went wrong. Please try again.")

      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    },
    [toast],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}
