"use client"

import { useState } from "react"
import { Bot, Settings2, Compass, PanelLeftOpen } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { ShareDialog } from "@/components/editor/dialogs/share-dialog"

interface WorkspaceShellProps {
  projectId: string
  projectName: string
  isOwner: boolean
}

export function WorkspaceShell({ projectId, projectName, isOwner }: WorkspaceShellProps) {
  // AI sidebar is open by default — matches the reference design
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true)

  function toggleSidebar() {
    window.dispatchEvent(new CustomEvent("editor:toggle-sidebar"))
  }

  return (
    <>
      {/* ── Workspace overlay navbar ──────────────────────────────────
          z-50 sits above the generic EditorNavbar (z-40), visually
          replacing it on workspace pages without touching EditorShell. */}
      <header
        data-slot="workspace-navbar"
        className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-3"
        style={{ background: "#0c0c0e", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Left — sidebar toggle + project name + subtitle */}
        <div className="flex items-center gap-2.5">
          <button
            id="workspace-sidebar-toggle"
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
            className={cn(
              "inline-flex items-center justify-center w-7 h-7 rounded-md",
              "text-muted-foreground hover:text-foreground transition-colors",
              "hover:bg-white/5"
            )}
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>

          <div
            aria-hidden="true"
            className="w-px h-4"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-[13px] font-semibold text-foreground">
              {projectName}
            </span>
            <span
              className="text-[9px] font-medium tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Workspace
            </span>
          </div>
        </div>

        {/* Right — Share + AI toggle + user avatar */}
        <div className="flex items-center gap-2">
          {/* Share */}
          <ShareDialog
            projectId={projectId}
            projectName={projectName}
            isOwner={isOwner}
          />

          {/* AI toggle */}
          <button
            id="workspace-ai-toggle"
            aria-label={isAISidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
            onClick={() => setIsAISidebarOpen((p) => !p)}
            className={cn(
              "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md",
              "text-xs font-medium border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isAISidebarOpen
                ? "text-cyan-400 border-cyan-400/30"
                : "text-muted-foreground border-border hover:text-foreground hover:bg-white/5"
            )}
            style={
              isAISidebarOpen
                ? { background: "rgba(34,211,238,0.08)" }
                : undefined
            }
          >
            <Bot className="h-3.5 w-3.5" />
            AI
          </button>

          {/* User avatar — keeps same Clerk button as the rest of the app */}
          <UserButton />
        </div>
      </header>

      {/* ── Content area ─────────────────────────────────────────────
          Fills the viewport below the navbar (main already has pt-12). */}
      <div className="flex h-[calc(100vh-3rem)]">

        {/* Canvas placeholder */}
        <div
          data-slot="canvas"
          className="relative flex flex-1 items-center justify-center overflow-hidden min-w-0"
          style={{
            background: "#0c0c0e",
            backgroundImage: [
              "radial-gradient(ellipse 55% 40% at 50% 80%, rgba(14,80,90,0.22) 0%, transparent 70%)",
              "radial-gradient(ellipse 35% 25% at 30% 90%, rgba(30,40,100,0.12) 0%, transparent 65%)",
            ].join(", "),
          }}
        >
          <div className="flex flex-col items-center gap-5 text-center px-8 max-w-md select-none">
            {/* Compass icon ring */}
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full"
              style={{
                border: "1px solid rgba(34,211,238,0.30)",
                background: "rgba(34,211,238,0.04)",
                boxShadow: "0 0 28px rgba(34,211,238,0.07), inset 0 0 16px rgba(34,211,238,0.03)",
              }}
            >
              <Compass
                className="h-6 w-6"
                strokeWidth={1.5}
                style={{ color: "rgba(34,211,238,0.65)" }}
              />
            </div>

            {/* Eyebrow label */}
            <p
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              Workspace Shell
            </p>

            {/* Main heading */}
            <h1 className="text-xl font-semibold text-foreground leading-snug -mt-2">
              Canvas and collaboration tooling land here next.
            </h1>

            {/* Description */}
            <p
              className="text-sm leading-relaxed -mt-1"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              This room is ready for the shared architecture canvas, durable AI
              workflows, and real-time presence. For now, the shell is wired
              with project context and navigation only.
            </p>
          </div>

          {/* "N" shortcut — bottom-left of canvas */}
          <div className="absolute bottom-4 left-4">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                className="text-[11px] font-bold"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                N
              </span>
            </div>
          </div>
        </div>

        {/* AI sidebar */}
        {isAISidebarOpen && (
          <aside
            data-slot="ai-sidebar"
            className="w-56 shrink-0 flex flex-col"
            style={{
              background: "#111114",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Sidebar header */}
            <div
              className="px-4 pt-4 pb-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold text-foreground">
                  AI Copilot
                </span>
                <button
                  aria-label="AI sidebar settings"
                  className="transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.5)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.25)")
                  }
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.30)" }}
              >
                Placeholder panel
              </p>
            </div>

            {/* Sidebar body */}
            <div className="flex flex-col flex-1 justify-between p-3 gap-3 min-h-0">
              {/* Chat surface pending card */}
              <div
                className="rounded-lg p-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  {/* Bot icon chip */}
                  <div
                    className="mt-0.5 shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
                    style={{
                      background: "rgba(34,211,238,0.08)",
                      border: "1px solid rgba(34,211,238,0.20)",
                    }}
                  >
                    <Bot
                      className="h-3.5 w-3.5"
                      style={{ color: "rgba(34,211,238,0.70)" }}
                    />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      Chat surface pending
                    </p>
                    <p
                      className="text-[11px] leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.36)" }}
                    >
                      The toggle is wired. Messaging and generation are
                      intentionally out of scope here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Future hooks card */}
              <div
                className="rounded-lg p-3"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-1.5"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Future Hooks
                </p>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                >
                  Prompt composer, run status, and architecture guidance will
                  attach to this sidebar.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
