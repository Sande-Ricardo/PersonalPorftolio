"use client"

import * as React from "react"
import { ProjectCard } from "../ui/project-card"
import { projects } from "../../lib/data/projects"

export const ProjectsGrid: React.FC = () => {
  return (
    <section className="px-margin-mobile md:px-margin-desktop py-20 border-b border-outline-variant select-none">
      <div className="mb-12">
        <span className="font-technical-label text-technical-label text-on-surface-variant block mb-2">
          [ 04 ] DEPLOYMENTS
        </span>
        <h2 className="font-display text-[24px] font-medium text-primary uppercase">
          SYSTEM.PROJECTS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant border border-outline-variant mt-12">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
