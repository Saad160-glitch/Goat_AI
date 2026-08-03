import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-4 flex-col">
      <p className="text-muted-foreground text-sm">Goat AI</p>
      <Link
        href="/editor"
        className="text-xs text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        Open Editor →
      </Link>
    </div>
  )
}
