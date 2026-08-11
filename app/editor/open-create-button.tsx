"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

/**
 * Tiny client island — fires a custom event so EditorShell can open
 * the Create Project dialog without lifting dialog state into the page.
 */
export function OpenCreateButton() {
  return (
    <Button
      id="home-new-project-btn"
      className="mt-2 gap-2"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("editor:open-create-dialog"))
      }
    >
      <Plus className="h-4 w-4" />
      New project
    </Button>
  )
}
