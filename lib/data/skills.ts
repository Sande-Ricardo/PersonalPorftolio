export interface Skill {
  name: string
  isActive?: boolean
}

export interface SkillCategory {
  title: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: "FRONTEND",
    skills: [
      { name: "React.js", isActive: true },
      { name: "TypeScript", isActive: true },
      { name: "Next.js", isActive: true },
      { name: "TailwindCSS" },
      { name: "WebGL" }
    ]
  },
  {
    title: "BACKEND",
    skills: [
      { name: "Node.js" },
      { name: "Python" },
      { name: "Go", isActive: true },
      { name: "PostgreSQL", isActive: true },
      { name: "Redis" }
    ]
  },
  {
    title: "AI/ML",
    skills: [
      { name: "RAG Systems", isActive: true },
      { name: "LLMOps", isActive: true },
      { name: "PyTorch" },
      { name: "LangChain" }
    ]
  },
  {
    title: "INFRA",
    skills: [
      { name: "Docker", isActive: true },
      { name: "Kubernetes", isActive: true },
      { name: "AWS" },
      { name: "Terraform" },
      { name: "CI/CD" }
    ]
  }
]
