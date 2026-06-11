"use client"

import * as React from "react"
import { Tag } from "../ui/tag"
import { skillCategories } from "../../lib/data/skills"

export const Skills: React.FC = () => {
  return (
    <section className="px-margin-mobile md:px-margin-desktop py-20 border-b border-outline-variant select-none">
      <div className="mb-12">
        <span className="font-technical-label text-technical-label text-on-surface-variant block mb-2">
          [ 03 ] STACK_&amp;_SKILLS
        </span>
        <h2 className="font-display text-[24px] font-medium text-primary uppercase">
          CAPABILITY.MATRIX
        </h2>
      </div>

      <div className="border border-outline-variant bg-outline-variant gap-px grid grid-cols-1 mt-12">
        {skillCategories.map((category) => (
          <div
            key={category.title}
            className="grid grid-cols-1 md:grid-cols-12 gap-px bg-outline-variant"
          >
            {/* Category header */}
            <div className="md:col-span-3 bg-surface-container-low p-4 flex items-center">
              <span className="font-technical-label text-technical-label text-primary font-semibold">
                [ {category.title} ]
              </span>
            </div>

            {/* Skills container */}
            <div className="md:col-span-9 bg-background p-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Tag
                  key={skill.name}
                  variant={skill.isActive ? "active" : "outline"}
                >
                  {skill.name}
                </Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
