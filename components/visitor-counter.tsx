"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"

export function VisitorCounter() {
  const [visitors, setVisitors] = useState<number>(0)
  const [onlineNow, setOnlineNow] = useState<number>(0)

  useEffect(() => {
    // Get or initialize visitor count from localStorage
    const storedCount = localStorage.getItem("visitor-count")
    const initialCount = storedCount ? Number.parseInt(storedCount) : 12847

    // Increment visitor count
    const newCount = initialCount + 1
    localStorage.setItem("visitor-count", newCount.toString())
    setVisitors(newCount)

    // Simulate online users (random between 15-45)
    const randomOnline = Math.floor(Math.random() * 30) + 15
    setOnlineNow(randomOnline)

    // Update online count every 10 seconds
    const interval = setInterval(() => {
      const newOnline = Math.floor(Math.random() * 30) + 15
      setOnlineNow(newOnline)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span>
          Total Visitors: <strong className="text-foreground">{visitors.toLocaleString()}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span>
          Online Now: <strong className="text-foreground">{onlineNow}</strong>
        </span>
      </div>
    </div>
  )
}
