"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onSidebarToggle: () => void
  className?: string
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  className,
}: EditorNavbarProps) {
  return (
    <header
      data-slot="editor-navbar"
      className={cn(
        "fixed top-0 left-0 right-0 z-40 h-12 flex items-center justify-between px-3",
        "bg-background border-b border-border",
        className
      )}
    >
      {/* Left section — sidebar toggle */}
      <div className="flex items-center">
        <button
          id="sidebar-toggle"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={onSidebarToggle}
          className={cn(
            "inline-flex items-center justify-center rounded-md p-1.5",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Center section — intentionally empty for now */}
      <div className="flex-1" />

      {/* Right section — intentionally empty for now */}
      <div className="flex items-center" />
    </header>
  )
}
