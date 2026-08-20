"use client"

import { useState, useEffect, useCallback } from "react"
import { Share2, X, Copy, Check, UserPlus, Loader2, Link } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Types ───────────────────────────────────────────────────────

interface Collaborator {
  email: string
  displayName: string | null
  imageUrl: string | null
}

interface ShareDialogProps {
  projectId: string
  projectName: string
  isOwner: boolean
}

// ── Avatar ──────────────────────────────────────────────────────

function CollaboratorAvatar({
  email,
  displayName,
  imageUrl,
}: Pick<Collaborator, "email" | "displayName" | "imageUrl">) {
  const initials = (displayName || email)
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("")

  return (
    <div
      className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-[11px] font-semibold select-none"
      style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.20)", color: "rgba(34,211,238,0.8)" }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={displayName || email}
          className="w-full h-full object-cover"
          onError={(e) => {
            // hide broken image and show initials fallback
            e.currentTarget.style.display = "none"
          }}
        />
      ) : (
        initials
      )}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────

export function ShareDialog({ projectId, projectName, isOwner }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Invite form (owner only)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  // Removing
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)

  // Copy link
  const [copied, setCopied] = useState(false)

  // ── Fetch collaborators ───────────────────────────────────────

  const fetchCollaborators = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error || "Could not load collaborators. Please try again.")
      }
      setCollaborators(data?.collaborators ?? [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not load collaborators. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) {
      fetchCollaborators()
    }
  }, [open, fetchCollaborators])

  // ── Invite ────────────────────────────────────────────────────

  async function handleInvite() {
    const email = inviteEmail.trim().toLowerCase()
    if (!email) return
    setInviting(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setInviteError(data?.error ?? "Failed to invite collaborator")
      } else {
        setInviteEmail("")
        await fetchCollaborators()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setInviteError(message)
    } finally {
      setInviting(false)
    }
  }

  // ── Remove ────────────────────────────────────────────────────

  async function handleRemove(email: string) {
    setRemovingEmail(email)
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      )
      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.email !== email))
      }
    } finally {
      setRemovingEmail(null)
    }
  }

  // ── Copy link ─────────────────────────────────────────────────

  function handleCopy() {
    const url = `${window.location.origin}/editor/${projectId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <>
      {/* Trigger button — matches the workspace navbar style */}
      <button
        id="workspace-share-btn"
        onClick={() => setOpen(true)}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-7 px-2.5 text-xs gap-1.5"
        )}
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              Share &ldquo;{projectName}&rdquo;
            </DialogTitle>
          </DialogHeader>

          {/* ── Invite section (owner only) ─────────────────── */}
          {isOwner && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="share-invite-email"
                className="text-xs font-medium text-muted-foreground"
              >
                Invite by email
              </label>
              <div className="flex gap-2">
                <Input
                  id="share-invite-email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setInviteError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inviteEmail.trim() && !inviting) {
                      handleInvite()
                    }
                  }}
                  disabled={inviting}
                  className="h-8 text-sm"
                />
                <Button
                  id="share-invite-submit"
                  size="sm"
                  className="h-8 px-3 shrink-0"
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || inviting}
                >
                  {inviting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  <span className="sr-only">Invite</span>
                </Button>
              </div>
              {inviteError && (
                <p className="text-xs text-destructive">{inviteError}</p>
              )}
            </div>
          )}

          {/* ── Collaborators list ──────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              {collaborators.length === 0 && !loading
                ? "No collaborators yet"
                : "Collaborators"}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <p className="text-xs text-destructive py-2">{error}</p>
            ) : collaborators.length > 0 ? (
              <ul className="flex flex-col gap-1 max-h-52 overflow-y-auto -mx-1 px-1">
                {collaborators.map((c) => (
                  <li
                    key={c.email}
                    className="flex items-center gap-3 py-1.5 px-2 rounded-md group"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <CollaboratorAvatar
                      email={c.email}
                      displayName={c.displayName}
                      imageUrl={c.imageUrl}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      {c.displayName && (
                        <span className="text-xs font-medium text-foreground truncate leading-tight">
                          {c.displayName}
                        </span>
                      )}
                      <span
                        className="text-[11px] truncate"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {c.email}
                      </span>
                    </div>

                    {/* Remove button — owner only */}
                    {isOwner && (
                      <button
                        aria-label={`Remove ${c.email}`}
                        onClick={() => handleRemove(c.email)}
                        disabled={removingEmail === c.email}
                        className="shrink-0 w-6 h-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(239,68,68,0.8)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(255,255,255,0.4)")
                        }
                      >
                        {removingEmail === c.email ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* ── Copy link ────────────────────────────────────── */}
          <div
            className="flex items-center justify-between rounded-md px-3 py-2 mt-1"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Link
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "rgba(255,255,255,0.35)" }}
              />
              <span
                className="text-[11px] truncate"
                style={{ color: "rgba(255,255,255,0.40)" }}
              >
                {typeof window !== "undefined"
                  ? `${window.location.origin}/editor/${projectId}`
                  : `/editor/${projectId}`}
              </span>
            </div>
            <button
              id="share-copy-link-btn"
              onClick={handleCopy}
              className={cn(
                "shrink-0 flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded transition-colors ml-2",
                copied
                  ? "text-emerald-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
