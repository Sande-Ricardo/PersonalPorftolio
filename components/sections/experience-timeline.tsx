"use client"

import * as React from "react"
import { experiences } from "../../lib/data/experience"

export const ExperienceTimeline: React.FC = () => {
  return (
    <section className="px-margin-mobile md:px-margin-desktop py-20 border-b border-outline-variant select-none">
      <div className="mb-12">
        <span className="font-technical-label text-technical-label text-on-surface-variant block mb-2">
          [ 03 ] EXPERIENCE
        </span>
        <h2 className="font-display text-[24px] font-medium text-primary uppercase">
          GIT.LOG --TIMELINE
        </h2>
      </div>

      <div className="relative pl-6 md:pl-8 max-w-4xl">
        {/* Vertical timeline line */}
        <div className="absolute left-0 top-2 bottom-0 w-px bg-outline-variant" />

        {/* Timeline items */}
        <div className="space-y-12">
          {experiences.map((item) => (
            <div key={item.id} className="relative">
              {/* Timeline dot node */}
              <div className="absolute -left-6 md:-left-8 top-2 w-[6px] h-[6px] bg-primary transform -translate-x-[3.5px] border border-background" />

              {/* Title & Period */}
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                <h3 className="font-display text-lg font-semibold text-primary">
                  {item.role} <span className="text-outline">@</span> {item.company}
                </h3>
                <span className="font-technical-label text-xs text-on-surface-variant whitespace-nowrap">
                  {item.period}
                </span>
              </div>

              {/* Bullet points */}
              <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant pl-4 border-l border-outline-variant ml-1 mt-4">
                {item.bullets.map((bullet, idx) => (
                  <p
                    key={idx}
                    className="relative before:content-['>'] before:absolute before:-left-4 before:text-primary"
                  >
                    {bullet}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
