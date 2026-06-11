export interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  bullets: string[]
}

export const experiences: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Senior Systems Engineer",
    company: "TechCorp",
    period: "2023 - Presente",
    bullets: [
      "Architected and deployed a multi-region microservices infrastructure.",
      "Spearheaded the integration of LLMs into internal tooling, reducing operational latency.",
      "Optimized database query paths resulting in a 40% reduction in response times."
    ]
  },
  {
    id: "exp-2",
    role: "Backend Developer",
    company: "InnovateHub",
    period: "2021 - 2023",
    bullets: [
      "Developed RESTful APIs handling over 1M requests per day.",
      "Implemented robust CI/CD pipelines using GitHub Actions and Docker."
    ]
  },
  {
    id: "exp-3",
    role: "Frontend Dev",
    company: "CreativeSolutions",
    period: "2019 - 2021",
    bullets: [
      "Built responsive, high-performance UIs using React and Redux.",
      "Collaborated tightly with design teams to translate Figma specs into pixel-perfect code."
    ]
  }
]
