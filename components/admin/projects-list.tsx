"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProjectItem } from "@/lib/data/projects"
import { deleteProjectAction } from "@/app/actions/projects"

interface ProjectsListProps {
  initialProjects: ProjectItem[]
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ initialProjects }) => {
  const router = useRouter()
  const [list, setList] = React.useState(initialProjects)
  const [loadingSlug, setLoadingSlug] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete project document "${slug}" permanently from Firestore?`)) {
      return
    }

    setLoadingSlug(slug)
    setError(null)

    try {
      const res = await deleteProjectAction(slug)
      if (res.success) {
        setList((prev) => prev.filter((p) => p.slug !== slug))
        router.refresh()
      } else {
        setError(res.error || "Failed to delete project.")
      }
    } catch (err: any) {
      setError("Network error occurred during deletion.")
    } finally {
      setLoadingSlug(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 select-none w-full">
      {error && (
        <div className="font-technical-label text-xs text-error border border-error bg-error/10 p-4 rounded-none">
          &gt; ERROR: {error}
        </div>
      )}

      {/* Table grid container */}
      <div className="border border-outline-variant bg-[#191A1E] w-full overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-outline-variant bg-white/5 font-technical-label text-[10px] text-outline uppercase">
              <th className="p-4">PROJECT TITLE</th>
              <th className="p-4">TYPE</th>
              <th className="p-4">CATEGORY</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">DATE</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                  &gt; NO_ENTRIES_FOUND // Collection is empty.
                </td>
              </tr>
            ) : (
              list.map((project) => (
                <tr key={project.slug} className="border-b border-outline-variant/60 hover:bg-white/2 transition-colors">
                  <td className="p-4 font-bold text-primary">{project.title}</td>
                  <td className="p-4 text-on-surface-variant">{project.type}</td>
                  <td className="p-4 text-on-surface-variant">{project.category}</td>
                  <td className="p-4 text-on-surface-variant">
                    <span className="border border-outline-variant/40 px-2 py-0.5 text-[9px] uppercase">
                      {project.status.split(" ")[0]}
                    </span>
                  </td>
                  <td className="p-4 text-on-surface-variant">{project.date}</td>
                  <td className="p-4 text-right flex gap-3 justify-end items-center">
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="text-primary hover:underline font-technical-label text-[10px] uppercase"
                    >
                      [ EDIT ]
                    </Link>
                    <button
                      onClick={() => handleDelete(project.slug)}
                      disabled={loadingSlug === project.slug}
                      className="text-error hover:underline font-technical-label text-[10px] uppercase cursor-pointer disabled:opacity-50"
                    >
                      {loadingSlug === project.slug ? "[ DELETING... ]" : "[ DELETE ]"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
