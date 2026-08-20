"use client"

import Link from "next/link"
import { LockKeyhole } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] gap-4 px-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted border border-border">
        <LockKeyhole className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <h1 className="text-lg font-semibold text-foreground">
          Access denied
        </h1>
        <p className="text-sm text-muted-foreground">
          This project doesn&apos;t exist or you don&apos;t have permission to
          view it.
        </p>
      </div>

      <Link
        href="/editor"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Back to dashboard
      </Link>
    </div>
  )
}
