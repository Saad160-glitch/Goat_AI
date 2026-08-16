"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CreateProjectDialogProps {
  open: boolean
  nameValue: string
  slug?: string
  roomId?: string
  isLoading: boolean
  onNameChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  nameValue,
  slug,
  roomId,
  isLoading,
  onNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
  const displayId = roomId || slug

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Give your architecture workspace a name.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <Input
            id="create-project-name"
            autoFocus
            placeholder="Project name"
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && nameValue.trim() && !isLoading) onSubmit()
            }}
          />
          {/* Room ID preview */}
          <p className="text-xs text-muted-foreground min-h-[1.25rem]">
            {displayId ? (
              <>
                <span className="font-medium text-foreground/70">Room ID: </span>
                <code className="px-1 py-0.5 rounded bg-muted font-mono text-[11px]">
                  {displayId}
                </code>
              </>
            ) : null}
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            id="create-project-submit"
            onClick={onSubmit}
            disabled={!nameValue.trim() || isLoading}
          >
            {isLoading ? "Creating..." : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
