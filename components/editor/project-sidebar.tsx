"use client"

import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ProjectSidebar({
  isOpen,
  onClose,
  className,
}: ProjectSidebarProps) {
  return (
    <>
      {/* Floating sidebar — slides in from left, does not push content */}
      <aside
        data-slot="project-sidebar"
        data-open={isOpen || undefined}
        className={cn(
          "fixed top-12 left-0 z-30 h-[calc(100vh-3rem)] w-72 flex flex-col",
          "bg-card border-r border-border shadow-xl",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-foreground">Projects</h2>
          <button
            id="sidebar-close"
            aria-label="Close sidebar"
            onClick={onClose}
            className={cn(
              "inline-flex items-center justify-center rounded-md p-1",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-projects" className="flex flex-col flex-1 min-h-0 px-2 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1 text-xs">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1 text-xs">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-2">
                <p className="text-sm text-muted-foreground">
                  No projects yet.
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Create a new project to get started.
                </p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shared" className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-2">
                <p className="text-sm text-muted-foreground">
                  No shared projects.
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Projects shared with you will appear here.
                </p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* New Project button */}
        <div className="px-3 py-3 border-t border-border shrink-0">
          <Button
            id="new-project-btn"
            className="w-full gap-2"
            variant="default"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
