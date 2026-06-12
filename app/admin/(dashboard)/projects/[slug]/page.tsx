import * as React from "react"
import { notFound } from "next/navigation"
import { getProjectBySlugDb } from "@/lib/db/projects"
import { ProjectForm } from "@/components/admin/project-form"

export const dynamic = "force-dynamic"

interface EditProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlugDb(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6 select-none w-full">
      {/* Header section */}
      <div className="border-b border-outline-variant pb-4">
        <span className="font-technical-label text-[10px] text-on-surface-variant block mb-1">
          [ PORTFOLIO_ENTRY_MUTATION ]
        </span>
        <h1 className="font-display text-2xl font-medium text-primary uppercase">
          EDIT_PROJECT // {project.slug}.log
        </h1>
      </div>

      <p className="font-mono text-xs text-on-surface-variant max-w-2xl leading-relaxed mb-4">
        Modify the Firestore project fields. Changing the slug will rename the database key on save.
      </p>

      <ProjectForm initialData={project} isEdit={true} />
    </div>
  )
}
