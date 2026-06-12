"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ProjectItem, ProjectMetric } from "@/lib/data/projects"
import { saveProjectAction } from "@/app/actions/projects"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

interface ProjectFormProps {
  initialData?: ProjectItem
  isEdit?: boolean
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Form states
  const [title, setTitle] = React.useState(initialData?.title || "")
  const [slug, setSlug] = React.useState(initialData?.slug || "")
  const [type, setType] = React.useState(initialData?.type || "")
  const [category, setCategory] = React.useState(initialData?.category || "")
  const [status, setStatus] = React.useState(initialData?.status || "")
  const [date, setDate] = React.useState(initialData?.date || "")
  const [description, setDescription] = React.useState(initialData?.description || "")
  const [longDescription, setLongDescription] = React.useState(initialData?.longDescription || "")
  const [githubUrl, setGithubUrl] = React.useState(initialData?.githubUrl || "")
  const [liveUrl, setLiveUrl] = React.useState(initialData?.liveUrl || "")
  const [asciiArt, setAsciiArt] = React.useState(initialData?.asciiArt || "")
  const [codeFilename, setCodeFilename] = React.useState(initialData?.codeFilename || "")
  const [codeSnippet, setCodeSnippet] = React.useState(initialData?.codeSnippet || "")

  // Array states
  const [bullets, setBullets] = React.useState<string[]>(initialData?.bullets || [])
  const [metrics, setMetrics] = React.useState<ProjectMetric[]>(initialData?.metrics || [])

  // Map state (Record<string, string> converted to key-value array for form editing)
  const [stats, setStats] = React.useState<{ key: string; value: string }[]>(() => {
    if (!initialData?.stats) return []
    return Object.entries(initialData.stats).map(([key, value]) => ({ key, value }))
  })

  // Auto-generate slug from title (only if not editing and slug is empty)
  React.useEffect(() => {
    if (!isEdit && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      setSlug(generatedSlug)
    }
  }, [title, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug) {
      setError("Title and Slug are required.")
      return
    }

    setSaving(true)
    setError(null)

    // Convert stats array back to Record<string, string>
    const statsRecord: Record<string, string> = {}
    stats.forEach((item) => {
      if (item.key.trim()) {
        statsRecord[item.key.trim().toUpperCase()] = item.value.trim()
      }
    })

    const projectData: ProjectItem = {
      title: title.trim(),
      slug: slug.trim(),
      type: type.trim().toUpperCase(),
      category: category.trim().toUpperCase(),
      status: status.trim().toUpperCase(),
      date: date.trim(),
      description: description.trim(),
      longDescription: longDescription.trim(),
      bullets: bullets.map((b) => b.trim()).filter(Boolean),
      metrics: metrics.filter((m) => m.label.trim()),
      stats: statsRecord,
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim() || undefined,
      asciiArt: asciiArt.trim() || undefined,
      codeFilename: codeFilename.trim() || undefined,
      codeSnippet: codeSnippet.trim() || undefined,
    }

    try {
      const res = await saveProjectAction(projectData, initialData?.slug)
      if (res.success) {
        router.push("/admin/projects")
        router.refresh()
      } else {
        setError(res.error || "Failed to save project document.")
      }
    } catch (err: any) {
      setError("Server connection failure.")
    } finally {
      setSaving(false)
    }
  }

  // Helper Array/Map functions
  const handleAddBullet = () => setBullets([...bullets, ""])
  const handleRemoveBullet = (index: number) => setBullets(bullets.filter((_, i) => i !== index))

  const handleAddMetric = () => setMetrics([...metrics, { label: "", value: "", desc: "" }])
  const handleRemoveMetric = (index: number) => setMetrics(metrics.filter((_, i) => i !== index))

  const handleAddStat = () => setStats([...stats, { key: "", value: "" }])
  const handleRemoveStat = (index: number) => setStats(stats.filter((_, i) => i !== index))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[#191A1E] border border-outline-variant p-6 relative w-full max-w-4xl select-none">
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/40"></div>

      {error && (
        <div className="font-technical-label text-xs text-error border border-error bg-error/10 p-4 rounded-none">
          &gt; ERROR: {error}
        </div>
      )}

      {/* Basic Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">PROJECT TITLE</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.G. NEXUS.CORE" required />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">URL SLUG</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="nexus-core" required />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">PROJECT TYPE</label>
          <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="E.G. DISTRIBUTED" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">CATEGORY</label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="E.G. DISTRIBUTED SYSTEMS" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">DEPLOY STATUS</label>
          <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="E.G. STABLE / PRODUCTION" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">RELEASE DATE (MM/YYYY)</label>
          <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="05/2024" />
        </div>
      </div>

      {/* Descriptions */}
      <div className="flex flex-col gap-2">
        <label className="font-technical-label text-[10px] text-outline uppercase">SHORT DESCRIPTION (CARD PREVIEW)</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short pitch..." />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-technical-label text-[10px] text-outline uppercase">LONG DESCRIPTION (OVERVIEW)</label>
        <Textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder="Full architectural details..." rows={5} />
      </div>

      {/* Bullets List */}
      <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-4 mt-2">
        <label className="font-technical-label text-[10px] text-outline uppercase block mb-1">
          PROJECT KEY BULLETS
        </label>
        <div className="flex flex-col gap-2">
          {bullets.map((bullet, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={bullet}
                onChange={(e) => {
                  const updated = [...bullets]
                  updated[idx] = e.target.value
                  setBullets(updated)
                }}
                placeholder={`Bullet item ${idx + 1}`}
                className="flex-grow text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveBullet(idx)} className="text-error border-error/20 hover:border-error">
                [ X ]
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={handleAddBullet} className="self-start mt-1">
          [ + ADD_BULLET ]
        </Button>
      </div>

      {/* Dynamic Performance Metrics */}
      <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-4 mt-2">
        <label className="font-technical-label text-[10px] text-outline uppercase block mb-2">
          PERFORMANCE METRICS
        </label>
        <div className="flex flex-col gap-3">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-black/10 p-3 border border-outline-variant/30 relative">
              <Input
                value={metric.label}
                onChange={(e) => {
                  const updated = [...metrics]
                  updated[idx].label = e.target.value.toUpperCase()
                  setMetrics(updated)
                }}
                placeholder="LABEL (E.G. ACCURACY)"
                className="sm:w-1/3 text-xs"
              />
              <Input
                value={metric.value}
                onChange={(e) => {
                  const updated = [...metrics]
                  updated[idx].value = e.target.value
                  setMetrics(updated)
                }}
                placeholder="VALUE (E.G. 98.4%)"
                className="sm:w-1/4 text-xs"
              />
              <Input
                value={metric.desc}
                onChange={(e) => {
                  const updated = [...metrics]
                  updated[idx].desc = e.target.value
                  setMetrics(updated)
                }}
                placeholder="SHORT EXPLANATION"
                className="flex-grow text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveMetric(idx)} className="text-error border-error/20 hover:border-error">
                [ X ]
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={handleAddMetric} className="self-start mt-1">
          [ + ADD_METRIC ]
        </Button>
      </div>

      {/* Telemetry Stats Card Map */}
      <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-4 mt-2">
        <label className="font-technical-label text-[10px] text-outline uppercase block mb-2">
          TELEMETRY STATS (CARD PREVIEWS)
        </label>
        <div className="flex flex-col gap-2">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={stat.key}
                onChange={(e) => {
                  const updated = [...stats]
                  updated[idx].key = e.target.value
                  setStats(updated)
                }}
                placeholder="KEY (E.G. LATENCY)"
                className="w-1/3 text-xs font-mono"
              />
              <Input
                value={stat.value}
                onChange={(e) => {
                  const updated = [...stats]
                  updated[idx].value = e.target.value
                  setStats(updated)
                }}
                placeholder="VALUE (E.G. < 10ms)"
                className="flex-grow text-xs font-mono"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveStat(idx)} className="text-error border-error/20 hover:border-error">
                [ X ]
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={handleAddStat} className="self-start mt-1">
          [ + ADD_TELEMETRY_STAT ]
        </Button>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline-variant/30 pt-4 mt-2">
        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">GITHUB REPOSITORY URL</label>
          <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." required />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">LIVE DEMO URL (OPTIONAL)</label>
          <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." />
        </div>
      </div>

      {/* ASCII Art Topology */}
      <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-4 mt-2">
        <label className="font-technical-label text-[10px] text-outline uppercase">ASCII ART TOPOLOGY DIAGRAM (OPTIONAL)</label>
        <Textarea value={asciiArt} onChange={(e) => setAsciiArt(e.target.value)} placeholder="ASCII wireframe..." rows={8} className="font-mono text-xs leading-normal" />
      </div>

      {/* Implementation Code Snippet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline-variant/30 pt-4 mt-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">CODE FILE NAME (OPTIONAL)</label>
          <Input value={codeFilename} onChange={(e) => setCodeFilename(e.target.value)} placeholder="main.go" />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-technical-label text-[10px] text-outline uppercase">CODE SNIPPET DETAILED (OPTIONAL)</label>
          <Textarea value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)} placeholder="func main() { ... }" rows={10} className="font-mono text-xs leading-normal" />
        </div>
      </div>

      {/* Footer controls */}
      <div className="border-t border-outline-variant pt-4 flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="font-technical-label text-xs text-outline hover:underline uppercase tracking-widest cursor-pointer"
        >
          [ CANCEL_OPERATION ]
        </button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "[ TRANSACTING_WRITE... ]" : "[ COMMIT_DATA ]"}
        </Button>
      </div>
    </form>
  )
}
