import * as React from "react"
import { ProjectForm } from "@/components/admin/project-form"

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6 select-none w-full">
      {/* Header section */}
      <div className="border-b border-outline-variant pb-4">
        <span className="font-technical-label text-[10px] text-on-surface-variant block mb-1">
          [ PORTFOLIO_ENTRY_PROVISIONING ]
        </span>
        <h1 className="font-display text-2xl font-medium text-primary uppercase">
          CREATE_PROJECT.SH
        </h1>
      </div>

      <p className="font-mono text-xs text-on-surface-variant max-w-2xl leading-relaxed mb-4">
        Provision a new project document inside the Firestore collection.
      </p>

      <ProjectForm />
    </div>
  )
}
