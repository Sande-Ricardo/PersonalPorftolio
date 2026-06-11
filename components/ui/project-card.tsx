import * as React from "react"
import Link from "next/link"
import { ProjectItem } from "../../lib/data/projects"

export interface ProjectCardProps {
  project: ProjectItem
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-background hover:bg-surface-container-low border border-outline-variant p-6 flex flex-col group transition-colors duration-300 select-none">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-display text-lg font-semibold text-primary group-hover:underline underline-offset-4 decoration-1 uppercase">
          {project.title}
        </h3>
        <span className="font-technical-label text-[10px] text-on-surface-variant">
          [ {project.type} ]
        </span>
      </div>

      {/* Description */}
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-8 flex-grow leading-relaxed">
        {project.description}
      </p>

      {/* Card Footer Grid */}
      <div className="flex justify-between items-end border-t border-outline-variant pt-4 mt-auto">
        {/* Short telemetry stats */}
        <div className="font-technical-label text-[10px] text-on-surface-variant flex flex-col gap-0.5 uppercase">
          {Object.entries(project.stats).map(([key, val]) => (
            <div key={key}>
              {key}: <span className="text-primary">{val}</span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 font-technical-label text-technical-label">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-white text-on-surface-variant transition-colors duration-200"
          >
            [ Details ]
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-on-surface-variant transition-colors duration-200"
          >
            [ GitHub ]
          </a>
        </div>
      </div>
    </div>
  )
}
