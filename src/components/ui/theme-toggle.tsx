import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "./button"

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
  size?: "sm" | "md" | "lg"
}

export function ThemeToggle({ isDark, onToggle, size = "md" }: ThemeToggleProps) {
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-[1.2rem] w-[1.2rem]"
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={`rounded-full ${size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"}`}
    >
      <Sun className={`${iconSize} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
      <Moon className={`absolute ${iconSize} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 
