import * as React from "react"
import { ContentEditor } from "@/components/admin/content-editor"

export default function ContentPage() {
  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Title */}
      <div className="border-b border-outline-variant pb-4">
        <span className="font-technical-label text-[10px] text-on-surface-variant block mb-1">
          [ CONFIG_DOCUMENT_EDITOR ]
        </span>
        <h1 className="font-display text-2xl font-medium text-primary uppercase">
          GLOBAL_CONTENT.SH
        </h1>
      </div>

      <p className="font-mono text-xs text-on-surface-variant max-w-2xl leading-relaxed">
        Modify the singleton strings, arrays, and media assets in Firestore. Saving updates will invalidate
        the static caches and propagate the telemetry to the public landing page.
      </p>

      {/* Editor Component */}
      <div className="mt-4">
        <ContentEditor />
      </div>
    </div>
  )
}
