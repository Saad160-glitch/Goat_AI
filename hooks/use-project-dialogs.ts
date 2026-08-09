"use client"

import { useState, useCallback } from "react"
import type { Project } from "@/lib/projects"

export type DialogKind = "create" | "rename" | "delete" | null

interface DialogState {
  kind: DialogKind
  target: Project | null
  nameValue: string
  isLoading: boolean
}

const INITIAL: DialogState = {
  kind: null,
  target: null,
  nameValue: "",
  isLoading: false,
}

export function useProjectDialogs() {
  const [state, setState] = useState<DialogState>(INITIAL)

  // ── Openers ──────────────────────────────────────────────────
  const openCreate = useCallback(() => {
    setState({ kind: "create", target: null, nameValue: "", isLoading: false })
  }, [])

  const openRename = useCallback((project: Project) => {
    setState({
      kind: "rename",
      target: project,
      nameValue: project.name,
      isLoading: false,
    })
  }, [])

  const openDelete = useCallback((project: Project) => {
    setState({
      kind: "delete",
      target: project,
      nameValue: "",
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

  // ── Submit stubs (no API — log only) ──────────────────────────
  const submitCreate = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }))
    // TODO: replace with real API call
    console.log("[mock] create project:", state.nameValue)
    setState(INITIAL)
  }, [state.nameValue])

  const submitRename = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }))
    // TODO: replace with real API call
    console.log("[mock] rename project:", state.target?.id, "→", state.nameValue)
    setState(INITIAL)
  }, [state.target, state.nameValue])

  const submitDelete = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }))
    // TODO: replace with real API call
    console.log("[mock] delete project:", state.target?.id)
    setState(INITIAL)
  }, [state.target])

  // ── Derived ───────────────────────────────────────────────────
  const slug = state.nameValue
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return {
    kind: state.kind,
    target: state.target,
    nameValue: state.nameValue,
    isLoading: state.isLoading,
    slug,
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
