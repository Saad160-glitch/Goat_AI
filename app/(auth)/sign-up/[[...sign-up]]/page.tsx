import { SignUp } from "@clerk/nextjs"
import { Bot, Share2, FileCode2 } from "lucide-react"

const features = [
  {
    Icon: Bot,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    Icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    Icon: FileCode2,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export default function SignUpPage() {
  return (
    <div className="auth-layout">
      {/* ── Left info panel ── */}
      <aside className="auth-panel">
        <div className="auth-panel__inner">

          {/* Brand header */}
          <header className="auth-panel__header">
            <div className="auth-panel__logo-mark" aria-hidden="true" />
            <span className="auth-panel__brand">Goat AI</span>
          </header>

          {/* Main copy */}
          <div className="auth-panel__body">
            <h1 className="auth-panel__heading">
              Build systems at the<br />speed of thought.
            </h1>
            <p className="auth-panel__tagline">
              Describe your architecture in plain English. Goat AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>

            <ul className="auth-panel__features">
              {features.map(({ Icon, title, description }) => (
                <li key={title} className="auth-feature">
                  <div className="auth-feature__icon" aria-hidden="true">
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="auth-feature__title">{title}</p>
                    <p className="auth-feature__desc">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <footer className="auth-panel__footer">
            <p className="auth-panel__copyright">
              © 2026 Goat AI. All rights reserved.
            </p>
          </footer>

        </div>
      </aside>

      {/* ── Right form panel ── */}
      <main className="auth-form">
        <SignUp />
      </main>
    </div>
  )
}
