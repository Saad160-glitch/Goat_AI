"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Project } from "@/lib/projects"

export type DialogKind = "create" | "rename" | "delete" | null

interface DialogState {
  kind: DialogKind
  target: Project | null
  nameValue: string
  createSuffix: string
  isLoading: boolean
}

const INITIAL: DialogState = {
  kind: null,
  target: null,
  nameValue: "",
  createSuffix: "",
  isLoading: false,
}

function generateShortSuffix(): string {
  return Math.random().toString(36).substring(2, 6)
}

export function useProjectActions() {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<DialogState>(INITIAL)

  // ── Openers ──────────────────────────────────────────────────
  const openCreate = useCallback(() => {
    setState({
      kind: "create",
      target: null,
      nameValue: "",
      createSuffix: generateShortSuffix(),
      isLoading: false,
    })
  }, [])

  const openRename = useCallback((project: Project) => {
    setState({
      kind: "rename",
      target: project,
      nameValue: project.name,
      createSuffix: "",
      isLoading: false,
    })
  }, [])

  const openDelete = useCallback((project: Project) => {
    setState({
      kind: "delete",
      target: project,
      nameValue: "",
      createSuffix: "",
      isLoading: false,
    })
  }, [])

  // ── Close ─────────────────────────────────────────────────────
  const close = useCallback(() => {
    setState(INITIAL)
  }, [])

  // ── Field updater ─────────────────────────────────────────────
  const setNameValue = useCallback((value: string) => {
    setState((prev) => ({ ...prev, nameValue: value }))
  }, [])

  // ── Derived room ID ───────────────────────────────────────────
  const { slug, roomId } = useMemo(() => {
    const cleanSlug = state.nameValue
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const fullRoomId = cleanSlug
      ? `${cleanSlug}-${state.createSuffix}`
      : state.createSuffix

    return {
      slug: cleanSlug,
      roomId: fullRoomId,
    }
  }, [state.nameValue, state.createSuffix])

  // ── Mutations ─────────────────────────────────────────────────
  const submitCreate = useCallback(async () => {
    if (!state.nameValue.trim() || state.isLoading) return
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.nameValue.trim(),
          id: roomId,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create project")
      }

      const project = await res.json()
      close()
      router.push(`/editor/${project.id}`)
      router.refresh()
    } catch (err) {
      console.error("Create project error:", err)
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [state.nameValue, state.isLoading, roomId, close, router])

  const submitRename = useCallback(async () => {
    if (!state.target || !state.nameValue.trim() || state.isLoading) return
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const res = await fetch(`/api/projects/${state.target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.nameValue.trim(),
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to rename project")
      }

      close()
      router.refresh()
    } catch (err) {
      console.error("Rename project error:", err)
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [state.target, state.nameValue, state.isLoading, close, router])

  const submitDelete = useCallback(async () => {
    if (!state.target || state.isLoading) return
    const targetId = state.target.id
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const res = await fetch(`/api/projects/${targetId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete project")
      }

      close()
      const isCurrentWorkspace =
        pathname === `/editor/${targetId}` ||
        pathname.startsWith(`/editor/${targetId}/`)

      if (isCurrentWorkspace) {
        router.push("/editor")
      }
      router.refresh()
    } catch (err) {
      console.error("Delete project error:", err)
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [state.target, state.isLoading, pathname, close, router])

  return {
    kind: state.kind,
    target: state.target,
    nameValue: state.nameValue,
    isLoading: state.isLoading,
    slug,
    roomId,
    openCreate,
    openRename,
    openDelete,
    close,
    setNameValue,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
