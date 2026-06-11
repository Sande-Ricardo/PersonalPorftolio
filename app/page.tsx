"use client"

import * as React from "react"
import { Header } from "../components/layout/header"
import { Hero } from "../components/sections/hero"
import { BootSequence } from "../components/animations/boot-sequence"

import { About } from "../components/sections/about"
import { ExperienceTimeline } from "../components/sections/experience-timeline"
import { Skills } from "../components/sections/skills"
import { GitHubContributions } from "../components/sections/github-contributions"
import { ProjectsGrid } from "../components/sections/projects-grid"
import { Contact } from "../components/sections/contact"

export default function Home() {
  const [bootComplete, setBootComplete] = React.useState(false)
  const [currentSection, setCurrentSection] = React.useState("about")

  React.useEffect(() => {
    // Skip boot sequence if already shown in the session
    const hasBooted = sessionStorage.getItem("sys_booted")
    if (hasBooted === "true") {
      setBootComplete(true)
    }

    // Scroll observer to highlight active section in navbar
    const handleScroll = () => {
      const sections = ["about", "projects", "stack", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const offsetTop = el.offsetTop
          const offsetHeight = el.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleBootComplete = () => {
    sessionStorage.setItem("sys_booted", "true")
    setBootComplete(true)
  }

  if (!bootComplete) {
    return <BootSequence onComplete={handleBootComplete} />
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-on-background selection:bg-white selection:text-black antialiased overflow-x-hidden">
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none blueprint-grid z-0" />

      {/* Navigation Header */}
      <Header currentSection={currentSection} />

      {/* Main Canvas */}
      <main className="flex-grow pt-[69px] relative z-10 w-full max-w-[1440px] mx-auto flex flex-col">
        {/* About/Hero Section anchor */}
        <div id="about">
          <Hero
            onScrollToProjects={() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }}
          />
          <About />
          <ExperienceTimeline />
        </div>

        <div id="projects">
          <ProjectsGrid />
        </div>
        <div id="stack">
          <Skills />
          <GitHubContributions />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-background border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-8 gap-4">
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
