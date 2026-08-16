"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Project } from "@/lib/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  onNewProject: () => void
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
  className?: string
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onNewProject,
  onRename,
  onDelete,
  className,
}: ProjectSidebarProps) {
  // ── Mobile backdrop detection ─────────────────────────────────
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const owned = projects.filter((p) => p.isOwned)
  const shared = projects.filter((p) => !p.isOwned)

  return (
    <>
      {/* Mobile backdrop — tap outside to close */}
      {isOpen && isMobile && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

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

          {/* My Projects tab */}
          <TabsContent value="my-projects" className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              {owned.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    No projects yet.
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Create a new project to get started.
                  </p>
                </div>
              ) : (
                <ul className="py-1">
                  {owned.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      showActions
                      onRename={onRename}
                      onDelete={onDelete}
                      onSelect={() => {
                        if (isMobile) onClose()
                      }}
                    />
                  ))}
                </ul>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Shared tab */}
          <TabsContent value="shared" className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              {shared.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    No shared projects.
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Projects shared with you will appear here.
                  </p>
                </div>
              ) : (
                <ul className="py-1">
                  {shared.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      showActions={false}
                      onRename={onRename}
                      onDelete={onDelete}
                      onSelect={() => {
                        if (isMobile) onClose()
                      }}
                    />
                  ))}
                </ul>
              )}
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
            onClick={onNewProject}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

// ── Project list item ──────────────────────────────────────────

interface ProjectItemProps {
  project: Project
  showActions: boolean
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
  onSelect?: () => void
}

function ProjectItem({
  project,
  showActions,
  onRename,
  onDelete,
  onSelect,
}: ProjectItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <li className="relative group">
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-md mx-1",
          "hover:bg-accent transition-colors cursor-pointer"
        )}
      >
        {/* Project name + slug navigation */}
        <Link
          href={`/editor/${project.id}`}
          onClick={onSelect}
          className="flex flex-col min-w-0 flex-1 pr-2"
        >
          <span className="text-sm font-medium text-foreground truncate">
            {project.name}
          </span>
          <span className="text-xs text-muted-foreground/60 truncate font-mono">
            {project.slug}
          </span>
        </Link>

        {/* Action menu — owned projects only */}
        {showActions && (
          <div className="relative shrink-0 ml-2">
            <button
              id={`project-menu-${project.id}`}
              aria-label={`Actions for ${project.name}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setMenuOpen((prev) => !prev)
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-md p-1",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "opacity-0 group-hover:opacity-100 focus:opacity-100",
                "transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <>
                {/* Click-away */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMenuOpen(false)
                  }}
                />
                <div
                  className={cn(
                    "absolute right-0 top-full mt-1 z-50 w-36",
                    "bg-popover border border-border rounded-md shadow-lg py-1"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    id={`rename-${project.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMenuOpen(false)
                      onRename(project)
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-1.5 text-sm",
                      "text-foreground hover:bg-accent transition-colors text-left"
                    )}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    Rename
                  </button>
                  <button
                    id={`delete-${project.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMenuOpen(false)
                      onDelete(project)
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-1.5 text-sm",
                      "text-destructive hover:bg-accent transition-colors text-left"
                    )}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </li>
  )
}
