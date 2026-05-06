"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => {
          setIsSidebarOpen((current) => !current);
        }}
      />
      <div className="pt-12">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => {
            setIsSidebarOpen(false);
          }}
        />
        <main className="h-[calc(100vh-3rem)] bg-background p-6">
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            Editor canvas placeholder
          </div>
        </main>
      </div>
    </div>
  );
}
