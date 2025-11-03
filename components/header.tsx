"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm sm:text-lg font-bold text-primary-foreground">AT</span>
          </div>
          <div className="hidden xs:block sm:block">
            <h1 className="text-base sm:text-lg font-bold leading-none">AllToolsHub Pro</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Free Online Tools</p>
          </div>
          <div className="block xs:hidden">
            <h1 className="text-sm font-bold leading-none">AllTools</h1>
            <p className="text-[10px] text-muted-foreground">Free Tools</p>
          </div>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="h-10 w-10 sm:h-11 sm:w-11"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  )
}
