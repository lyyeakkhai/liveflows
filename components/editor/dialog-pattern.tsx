import * as React from "react"

import { cn } from "@/lib/utils"

type DialogPatternProps = {
  title: string
  description?: string
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

function DialogPattern({
  title,
  description,
  footer,
  children,
  className,
}: DialogPatternProps) {
  return (
    <section
      className={cn(
        "grid gap-4 rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)] p-4 text-[color:var(--color-text-primary)]",
        className
      )}
    >
      <header className="grid gap-2">
        <h2 className="text-base font-medium">{title}</h2>
        {description ? (
          <p className="text-sm text-[color:var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
      </header>

      {children}

      {footer ? (
        <footer className="flex flex-col-reverse gap-2 border-t border-[color:var(--color-border-default)] pt-3 sm:flex-row sm:justify-end">
          {footer}
        </footer>
      ) : null}
    </section>
  )
}

export { DialogPattern }

