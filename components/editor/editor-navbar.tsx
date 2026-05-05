"use client"

import * as React from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EditorNavbarProps = {
  isSidebarOpen: boolean
  onToggleSidebar?: () => void
  centerContent?: React.ReactNode
  rightContent?: React.ReactNode
  className?: string
}

function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  centerContent,
  rightContent,
  className,
}: EditorNavbarProps) {
  const ToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b border-border bg-background",
        className
      )}
    >
      <div className="flex w-12 items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarOpen ? "Close project sidebar" : "Open project sidebar"
          }
          disabled={!onToggleSidebar}
        >
          <ToggleIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 text-center">{centerContent}</div>
      <div className="flex w-12 items-center justify-end">{rightContent}</div>
    </header>
  )
}

export { EditorNavbar }

