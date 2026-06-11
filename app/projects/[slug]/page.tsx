import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "../../../components/layout/header"
import { CopyButton } from "../../../components/ui/copy-button"
import { getProjectBySlug, projects } from "../../../lib/data/projects"

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-on-background selection:bg-white selection:text-black antialiased overflow-x-hidden">
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none blueprint-grid z-0" />

      {/* Navigation Header */}
      <Header currentSection="projects" />

      {/* Main Canvas */}
      <main className="flex-grow pt-[100px] pb-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full relative z-10 select-none">
        {/* Navigation Breadcrumb */}
        <div className="w-full flex justify-between items-center py-4 border-b border-outline-variant mb-12">
          <Link
            className="font-technical-label text-technical-label text-primary hover:opacity-70 flex items-center gap-2"
            href="/#projects"
          >
            <span>&lt;-- BACK_TO_PROJECTS</span>
          </Link>
          <div className="font-technical-label text-technical-label text-on-surface-variant">
            root/projects/{project.slug}.md
          </div>
        </div>

        {/* Project Header Title & Info Block */}
        <section className="mb-16">
          <h1 className="font-display text-[42px] md:text-[80px] font-thin tracking-tighter text-primary mb-8 uppercase">
            {project.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 border border-outline-variant bg-outline-variant gap-px">
            <div className="p-6 bg-background">
              <div className="font-technical-label text-[10px] text-on-surface-variant mb-2">
                [ CATEGORY ]
              </div>
              <div className="font-display text-lg font-medium text-primary uppercase">
                {project.category}
              </div>
            </div>
            <div className="p-6 bg-background">
              <div className="font-technical-label text-[10px] text-on-surface-variant mb-2">
                [ DEPLOY_STATUS ]
              </div>
              <div className="font-display text-lg font-medium text-primary uppercase">
                {project.status}
              </div>
            </div>
            <div className="p-6 bg-background">
              <div className="font-technical-label text-[10px] text-on-surface-variant mb-2">
                [ DATE ]
              </div>
              <div className="font-display text-lg font-medium text-primary uppercase">
                {project.date}
              </div>
            </div>
            <div className="p-6 bg-background flex flex-col justify-end">
              <div className="font-technical-label text-[10px] text-on-surface-variant mb-2">
                [ LINKS ]
              </div>
              <div className="flex gap-4">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-outline-variant hover:border-white px-6 py-2 font-technical-label text-technical-label text-primary hover:bg-white hover:text-black transition-colors uppercase"
                >
                  [ GitHub ]
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-outline-variant hover:border-white px-6 py-2 font-technical-label text-technical-label text-primary hover:bg-white hover:text-black transition-colors uppercase"
                  >
                    [ Live_Demo ]
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Impact & Topology Section */}
        <section className="mb-16 bg-surface-container-low border border-outline-variant p-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {project.metrics.map((metric, idx) => (
              <div key={idx}>
                <div className="font-technical-label text-[10px] text-on-surface-variant mb-4 uppercase">
                  // {metric.label}
                </div>
                <div className="font-technical-label text-[48px] text-primary leading-none font-bold">
                  {metric.value}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  {metric.desc}
                </div>
              </div>
            ))}

            {/* Architecture graphic */}
            <div className="flex items-center justify-center relative w-full h-32 border border-outline-variant/60 grayscale bg-background p-2">
              <Image
                src="/architecture_abstract.png"
                alt="Architecture illustration"
                fill
                className="object-cover opacity-60 p-2"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>
          </div>

          {/* Topology diagram */}
          {project.asciiArt && (
            <div>
              <div className="font-technical-label text-[10px] text-on-surface-variant mb-6 uppercase tracking-widest">
                System_Topology_v2.1
              </div>
              <pre className="font-mono text-primary text-[10px] md:text-xs overflow-x-auto pb-4 bg-background p-4 border border-outline-variant/40 leading-normal select-text">
                {project.asciiArt}
              </pre>
            </div>
          )}
        </section>

        {/* Overview & Code Details */}
        <section className="max-w-4xl mx-auto select-text">
          <div className="mb-12">
            <h2 className="font-display text-[20px] font-semibold text-primary mb-4 pb-2 border-b border-outline-variant uppercase">
              PROJECT_OVERVIEW
            </h2>
            <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed mb-6">
              {project.longDescription}
            </p>
            <ul className="space-y-3 font-body-base text-body-base text-on-surface-variant">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="font-technical-label text-primary">-</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Implementation details */}
          {project.codeSnippet && project.codeFilename && (
            <div className="mb-12">
              <h3 className="font-display text-[20px] font-semibold text-primary mb-6 pb-2 border-b border-outline-variant uppercase">
                Implementation_Details
              </h3>

              {/* Code Panel */}
              <div className="border border-outline-variant bg-surface-container-low overflow-hidden rounded-none">
                <div className="flex justify-between items-center px-4 py-2 border-b border-outline-variant bg-white/5">
                  <span className="font-technical-label text-technical-label text-on-surface-variant">
                    {project.codeFilename}
                  </span>
                  <CopyButton text={project.codeSnippet} />
                </div>
                <pre className="p-6 overflow-x-auto">
                  <code className="font-mono text-xs text-white leading-relaxed">
                    {project.codeSnippet}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-background border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-8 gap-4 mt-auto">
        <div className="font-technical-label text-[10px] text-outline uppercase">
          SYSTEM_STAMP_2026
        </div>
        <div className="flex gap-6 font-technical-label text-technical-label">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-white px-2 py-1 transition-colors duration-100"
          >
            GITHUB
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-white px-2 py-1 transition-colors duration-100"
          >
            LINKEDIN
          </a>
        </div>
      </footer>
    </div>
  )
}
