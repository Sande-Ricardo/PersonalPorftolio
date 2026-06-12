import * as React from "react"
import Link from "next/link"
import { getProjectsList } from "@/lib/db/projects"
import { ProjectsList } from "@/components/admin/projects-list"
import { ProjectItem } from "@/lib/data/projects"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  let projectsList: ProjectItem[] = []
  try {
    projectsList = await getProjectsList()
  } catch (err) {
    console.error("Failed to load projects list in admin page:", err)
  }

  return (
    <div className="flex flex-col gap-6 select-none w-full">
      {/* Header section */}
      <div className="border-b border-outline-variant pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-technical-label text-[10px] text-on-surface-variant block mb-1">
            [ PORTFOLIO_ENTRIES_MANAGEMENT ]
          </span>
          <h1 className="font-display text-2xl font-medium text-primary uppercase">
            PROJECTS_INDEX.LOG
          </h1>
        </div>

        <Link
          href="/admin/projects/new"
          className="bg-white text-black border border-white hover:bg-transparent hover:text-white px-6 py-2.5 font-technical-label text-[10px] uppercase tracking-wider transition-colors duration-200"
        >
          [ ADD_NEW_PROJECT ]
        </Link>
      </div>

      <p className="font-mono text-xs text-on-surface-variant max-w-2xl leading-relaxed">
        Manage the project items in Firestore. Changes will dynamically trigger cache invalidation for the
        individual project path and the homepage dashboard.
      </p>

      {/* Projects Table List */}
      <div className="mt-4">
        <ProjectsList initialProjects={projectsList} />
      </div>
    </div>
  )
}
