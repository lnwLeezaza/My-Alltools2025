"use client"

import { useEffect } from "react"

interface KeyboardShortcuts {
  onRun?: () => void
  onReset?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts({ onRun, onReset, onEscape }: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter - Run tool
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && onRun) {
        e.preventDefault()
        onRun()
      }

      // Ctrl/Cmd + R - Reset tool
      if ((e.ctrlKey || e.metaKey) && e.key === "r" && onReset) {
        e.preventDefault()
        onReset()
      }

      // Escape - Close modal or clear
      if (e.key === "Escape" && onEscape) {
        e.preventDefault()
        onEscape()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onRun, onReset, onEscape])
}
