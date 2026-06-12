"use client"

import * as React from "react"
import { fetchContentDocAction, updateContentDocAction } from "@/app/actions/content"
import { ImageUploader } from "./ui/image-uploader"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

type Tab = "hero" | "about" | "stack" | "experience" | "contact" | "site_meta"

export const ContentEditor: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("hero")
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<{ text: string; isError?: boolean } | null>(null)

  // --- STATE MODELS ---
  const [heroData, setHeroData] = React.useState({
    name: "",
    title: "",
    boot_sequence: [] as string[],
  })

  const [aboutData, setAboutData] = React.useState({
    bio_paragraphs: [] as string[],
    avatar_url: "",
    avatar_alt: "",
    highlights: [] as { label: string; value: string }[],
  })

  const [stackData, setStackData] = React.useState({
    categories: [] as { title: string; skills: { name: string; isActive?: boolean }[] }[],
  })

  const [experienceData, setExperienceData] = React.useState({
    entries: [] as { id: string; role: string; company: string; period: string; bullets: string[] }[],
  })

  const [contactData, setContactData] = React.useState({
    availability_status: "",
    availability_badge: "",
    social_links: [] as { name: string; url: string }[],
  })

  const [seoData, setSeoData] = React.useState({
    title: "",
    description: "",
  })

  // --- DATA FETCHING ---
  const loadAllDocs = React.useCallback(async () => {
    setLoading(true)
    setMessage(null)
    try {
      const [heroRes, aboutRes, stackRes, expRes, contactRes, seoRes] = await Promise.all([
        fetchContentDocAction("hero"),
        fetchContentDocAction("about"),
        fetchContentDocAction("stack"),
        fetchContentDocAction("experience"),
        fetchContentDocAction("contact"),
        fetchContentDocAction("site_meta"),
      ])

      if (heroRes.success && heroRes.data) setHeroData(heroRes.data as any)
      if (aboutRes.success && aboutRes.data) setAboutData(aboutRes.data as any)
      if (stackRes.success && stackRes.data) setStackData(stackRes.data as any)
      if (expRes.success && expRes.data) setExperienceData(expRes.data as any)
      if (contactRes.success && contactRes.data) setContactData(contactRes.data as any)
      if (seoRes.success && seoRes.data) setSeoData(seoRes.data as any)

    } catch (err: any) {
      setMessage({ text: "Failed to load database documents.", isError: true })
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadAllDocs()
  }, [loadAllDocs])

  // --- SAVE OPERATION ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      let res
      if (activeTab === "hero") res = await updateContentDocAction("hero", heroData)
      else if (activeTab === "about") res = await updateContentDocAction("about", aboutData)
      else if (activeTab === "stack") res = await updateContentDocAction("stack", stackData)
      else if (activeTab === "experience") res = await updateContentDocAction("experience", experienceData)
      else if (activeTab === "contact") res = await updateContentDocAction("contact", contactData)
      else res = await updateContentDocAction("site_meta", seoData)

      if (res.success) {
        setMessage({ text: `System log: [ ${activeTab.toUpperCase()}_UPDATE ] successfully saved and ISR cache revalidated.` })
      } else {
        setMessage({ text: res.error || "Save execution failed.", isError: true })
      }
    } catch (err: any) {
      setMessage({ text: "Save transaction failed.", isError: true })
    } finally {
      setSaving(false)
    }
  }

  // --- HELPER HANDLERS ---
  const handleArrayChange = (
    value: string,
    index: number,
    array: string[],
    setArray: (arr: string[]) => void
  ) => {
    const updated = [...array]
    updated[index] = value
    setArray(updated)
  }

  const handleArrayAdd = (array: string[], setArray: (arr: string[]) => void, defaultValue = "") => {
    setArray([...array, defaultValue])
  }

  const handleArrayRemove = (index: number, array: string[], setArray: (arr: string[]) => void) => {
    setArray(array.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="border border-outline-variant bg-[#191A1E] p-12 flex flex-col items-center justify-center font-mono text-sm gap-3">
        <span className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        <span>&gt; INITIATING_CMS_DATABASE_FETCH...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl select-none">
      {/* Tabs bar */}
      <div className="flex flex-wrap gap-2 border-b border-outline-variant pb-3">
        {(["hero", "about", "stack", "experience", "contact", "site_meta"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab)
              setMessage(null)
            }}
            className={`px-4 py-2 font-technical-label text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-white text-black border-white"
                : "bg-transparent text-outline border-transparent hover:border-outline-variant hover:text-white"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Message feedback */}
      {message && (
        <div
          className={`font-technical-label text-xs border p-4 rounded-none ${
            message.isError ? "border-error text-error bg-error/10" : "border-outline-variant text-primary bg-white/5"
          }`}
        >
          {message.isError ? `* ERROR: ${message.text}` : `> ${message.text}`}
        </div>
      )}

      {/* Editor Canvas */}
      <form onSubmit={handleSave} className="flex flex-col gap-6 bg-[#191A1E] border border-outline-variant p-6 relative">
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/40"></div>

        {/* --- HERO TAB --- */}
        {activeTab === "hero" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-technical-label text-[10px] text-outline uppercase">OWNER NAME</label>
              <Input
                value={heroData.name}
                onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                placeholder="Ricardo Sande"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-technical-label text-[10px] text-outline uppercase">TAGLINE TITLE</label>
              <Input
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                placeholder="Fullstack & AI Engineer"
                required
              />
            </div>

            <div className="flex flex-col gap-2 border-t border-outline-variant pt-4 mt-2">
              <label className="font-technical-label text-[10px] text-outline uppercase block mb-2">
                BOOT SEQUENCE LOGS (LINES)
              </label>
              <div className="flex flex-col gap-2">
                {heroData.boot_sequence.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={line}
                      onChange={(e) =>
                        handleArrayChange(
                          e.target.value,
                          idx,
                          heroData.boot_sequence,
                          (arr) => setHeroData({ ...heroData, boot_sequence: arr })
                        )
                      }
                      placeholder={`Log line ${idx + 1}`}
                      className="flex-grow font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleArrayRemove(idx, heroData.boot_sequence, (arr) =>
                          setHeroData({ ...heroData, boot_sequence: arr })
                        )
                      }
                      className="text-error border-error/20 hover:border-error"
                    >
                      [ X ]
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 self-start"
                onClick={() =>
                  handleArrayAdd(
                    heroData.boot_sequence,
                    (arr) => setHeroData({ ...heroData, boot_sequence: arr }),
                    "SYSTEM.LOG_STAMP"
                  )
                }
              >
                [ + ADD_LOG_LINE ]
              </Button>
            </div>
          </div>
        )}

        {/* --- ABOUT TAB --- */}
        {activeTab === "about" && (
          <div className="flex flex-col gap-6">
            <ImageUploader
              folder="portfolio/avatar"
              value={aboutData.avatar_url}
              onChange={(url) => setAboutData({ ...aboutData, avatar_url: url })}
              label="AVATAR PHOTO (CLOUDINARY)"
            />

            <div className="flex flex-col gap-2">
              <label className="font-technical-label text-[10px] text-outline uppercase">AVATAR ALT TEXT</label>
              <Input
                value={aboutData.avatar_alt}
                onChange={(e) => setAboutData({ ...aboutData, avatar_alt: e.target.value })}
                placeholder="Ricardo Sande Portrait"
              />
            </div>

            <div className="flex flex-col gap-2 border-t border-outline-variant pt-4">
              <label className="font-technical-label text-[10px] text-outline uppercase block mb-2">
                BIOGRAPHY PARAGRAPHS
              </label>
              <div className="flex flex-col gap-3">
                {aboutData.bio_paragraphs.map((para, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Textarea
                      value={para}
                      onChange={(e) =>
                        handleArrayChange(
                          e.target.value,
                          idx,
                          aboutData.bio_paragraphs,
                          (arr) => setAboutData({ ...aboutData, bio_paragraphs: arr })
                        )
                      }
                      placeholder={`Bio paragraph ${idx + 1}`}
                      className="flex-grow text-xs leading-relaxed"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleArrayRemove(idx, aboutData.bio_paragraphs, (arr) =>
                          setAboutData({ ...aboutData, bio_paragraphs: arr })
                        )
                      }
                      className="text-error border-error/20 hover:border-error"
                    >
                      [ X ]
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 self-start"
                onClick={() =>
                  handleArrayAdd(aboutData.bio_paragraphs, (arr) => setAboutData({ ...aboutData, bio_paragraphs: arr }), "")
                }
              >
                [ + ADD_PARAGRAPH ]
              </Button>
            </div>

            {/* Highlights metrics */}
            <div className="flex flex-col gap-2 border-t border-outline-variant pt-4">
              <label className="font-technical-label text-[10px] text-outline uppercase block mb-2">
                STAT HIGHLIGHTS
              </label>
              <div className="flex flex-col gap-3">
                {aboutData.highlights.map((hl, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={hl.value}
                      onChange={(e) => {
                        const updated = [...aboutData.highlights]
                        updated[idx].value = e.target.value
                        setAboutData({ ...aboutData, highlights: updated })
                      }}
                      placeholder="Value (e.g. 5+)"
                      className="w-1/3"
                    />
                    <Input
                      value={hl.label}
                      onChange={(e) => {
                        const updated = [...aboutData.highlights]
                        updated[idx].label = e.target.value
                        setAboutData({ ...aboutData, highlights: updated })
                      }}
                      placeholder="Label (e.g. YEARS EXPERIENCE)"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAboutData({
                          ...aboutData,
                          highlights: aboutData.highlights.filter((_, i) => i !== idx),
                        })
                      }}
                      className="text-error border-error/20 hover:border-error"
                    >
                      [ X ]
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 self-start"
                onClick={() =>
                  setAboutData({
                    ...aboutData,
                    highlights: [...aboutData.highlights, { label: "", value: "" }],
                  })
                }
              >
                [ + ADD_HIGHLIGHT ]
              </Button>
            </div>
          </div>
        )}

        {/* --- STACK TAB --- */}
        {activeTab === "stack" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {stackData.categories.map((cat, catIdx) => (
                <div key={catIdx} className="border border-outline-variant/60 p-4 flex flex-col gap-4 relative">
                  <div className="absolute top-0 right-0 p-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStackData({
                          categories: stackData.categories.filter((_, i) => i !== catIdx),
                        })
                      }}
                      className="text-error border-error/20 hover:border-error"
                    >
                      [ DELETE_CATEGORY ]
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 w-2/3">
                    <label className="font-technical-label text-[10px] text-outline uppercase">CATEGORY TITLE</label>
                    <Input
                      value={cat.title}
                      onChange={(e) => {
                        const updated = [...stackData.categories]
                        updated[catIdx].title = e.target.value.toUpperCase()
                        setStackData({ categories: updated })
                      }}
                      placeholder="E.G. FRONTEND"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <label className="font-technical-label text-[10px] text-outline uppercase block mb-1">
                      SKILLS ITEMS
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.skills.map((skill, skillIdx) => (
                        <div key={skillIdx} className="flex gap-2 items-center bg-black/20 p-2 border border-outline-variant/30">
                          <Input
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...stackData.categories]
                              updated[catIdx].skills[skillIdx].name = e.target.value
                              setStackData({ categories: updated })
                            }}
                            placeholder="Skill name"
                            className="flex-grow py-1.5 text-xs h-9"
                          />
                          <label className="flex items-center gap-1.5 cursor-pointer select-none px-2">
                            <input
                              type="checkbox"
                              checked={!!skill.isActive}
                              onChange={(e) => {
                                const updated = [...stackData.categories]
                                updated[catIdx].skills[skillIdx].isActive = e.target.checked
                                setStackData({ categories: updated })
                              }}
                              className="accent-white cursor-pointer w-3.5 h-3.5"
                            />
                            <span className="font-technical-label text-[9px] text-outline">CORE</span>
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = [...stackData.categories]
                              updated[catIdx].skills = updated[catIdx].skills.filter((_, i) => i !== skillIdx)
                              setStackData({ categories: updated })
                            }}
                            className="text-error border-error/10 hover:border-error py-1.5"
                          >
                            [ X ]
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 self-start py-1 text-[9px]"
                      onClick={() => {
                        const updated = [...stackData.categories]
                        updated[catIdx].skills.push({ name: "", isActive: false })
                        setStackData({ categories: updated })
                      }}
                    >
                      [ + ADD_SKILL ]
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="self-start mt-2"
              onClick={() => {
                setStackData({
                  categories: [...stackData.categories, { title: "NEW_CATEGORY", skills: [] }],
                })
              }}
            >
              [ + ADD_SKILLS_CATEGORY ]
            </Button>
          </div>
        )}

        {/* --- EXPERIENCE TAB --- */}
        {activeTab === "experience" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {experienceData.entries.map((entry, idx) => (
                <div key={entry.id || idx} className="border border-outline-variant p-4 flex flex-col gap-4 relative bg-black/10">
                  <div className="absolute top-0 right-0 p-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setExperienceData({
                          entries: experienceData.entries.filter((_, i) => i !== idx),
                        })
                      }}
                      className="text-error border-error/20 hover:border-error"
                    >
                      [ REMOVE_ENTRY ]
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-5/6">
                    <div className="flex flex-col gap-2">
                      <label className="font-technical-label text-[10px] text-outline uppercase">ROLE TITLE</label>
                      <Input
                        value={entry.role}
                        onChange={(e) => {
                          const updated = [...experienceData.entries]
                          updated[idx].role = e.target.value
                          setExperienceData({ entries: updated })
                        }}
                        placeholder="Senior Engineer"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-technical-label text-[10px] text-outline uppercase">COMPANY</label>
                      <Input
                        value={entry.company}
                        onChange={(e) => {
                          const updated = [...experienceData.entries]
                          updated[idx].company = e.target.value
                          setExperienceData({ entries: updated })
                        }}
                        placeholder="Tech Corp"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-technical-label text-[10px] text-outline uppercase">PERIOD</label>
                      <Input
                        value={entry.period}
                        onChange={(e) => {
                          const updated = [...experienceData.entries]
                          updated[idx].period = e.target.value
                          setExperienceData({ entries: updated })
                        }}
                        placeholder="2023 - Present"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-3 mt-2">
                    <label className="font-technical-label text-[10px] text-outline uppercase block mb-1">
                      BULLET DESCRIPTION
                    </label>
                    <div className="flex flex-col gap-2">
                      {entry.bullets.map((bullet, bullIdx) => (
                        <div key={bullIdx} className="flex gap-2">
                          <Input
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...experienceData.entries]
                              updated[idx].bullets[bullIdx] = e.target.value
                              setExperienceData({ entries: updated })
                            }}
                            placeholder="Describe achievement..."
                            className="flex-grow text-xs"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = [...experienceData.entries]
                              updated[idx].bullets = updated[idx].bullets.filter((_, i) => i !== bullIdx)
                              setExperienceData({ entries: updated })
                            }}
                            className="text-error border-error/10 hover:border-error"
                          >
                            [ X ]
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-1 self-start text-[9px] py-1"
                      onClick={() => {
                        const updated = [...experienceData.entries]
                        updated[idx].bullets.push("")
                        setExperienceData({ entries: updated })
                      }}
                    >
                      [ + ADD_BULLET ]
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="self-start mt-2"
              onClick={() => {
                setExperienceData({
                  entries: [
                    ...experienceData.entries,
                    {
                      id: "exp-" + Date.now(),
                      role: "New Role",
                      company: "New Company",
                      period: "2026",
                      bullets: [],
                    },
                  ],
                })
              }}
            >
              [ + ADD_EXPERIENCE_ENTRY ]
            </Button>
          </div>
        )}

        {/* --- CONTACT TAB --- */}
        {activeTab === "contact" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-technical-label text-[10px] text-outline uppercase">AVAILABILITY STATUS</label>
                <Input
                  value={contactData.availability_status}
                  onChange={(e) => setContactData({ ...contactData, availability_status: e.target.value })}
                  placeholder="AVAILABLE FOR PROJECTS"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-technical-label text-[10px] text-outline uppercase">AVAILABILITY BADGE STYLE</label>
                <div className="relative">
                  <select
                    value={contactData.availability_badge}
                    onChange={(e) => setContactData({ ...contactData, availability_badge: e.target.value })}
                    className="w-full bg-transparent border border-outline-variant focus:border-white text-primary p-3 rounded-none font-technical-label text-technical-label outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="active">ACTIVE // GREEN</option>
                    <option value="inactive">INACTIVE // RED</option>
                    <option value="limited">LIMITED // ORANGE</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-on-surface-variant font-mono text-xs">
                    [ V ]
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-col gap-2 border-t border-outline-variant pt-4 mt-2">
              <label className="font-technical-label text-[10px] text-outline uppercase block mb-2">
                SOCIAL & CONTACT LINKS
              </label>
              <div className="flex flex-col gap-3">
                {contactData.social_links.map((link, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={link.name}
                      onChange={(e) => {
                        const updated = [...contactData.social_links]
                        updated[idx].name = e.target.value.toUpperCase()
                        setContactData({ ...contactData, social_links: updated })
                      }}
                      placeholder="NAME (E.G. GITHUB)"
                      className="w-1/3"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...contactData.social_links]
                        updated[idx].url = e.target.value
                        setContactData({ ...contactData, social_links: updated })
                      }}
                      placeholder="URL (E.G. https://github.com/username)"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setContactData({
                          ...contactData,
                          social_links: contactData.social_links.filter((_, i) => i !== idx),
                        })
                      }}
                      className="text-error border-error/20 hover:border-error"
                    >
                      [ X ]
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 self-start"
                onClick={() =>
                  setContactData({
                    ...contactData,
                    social_links: [...contactData.social_links, { name: "", url: "" }],
                  })
                }
              >
                [ + ADD_LINK ]
              </Button>
            </div>
          </div>
        )}

        {/* --- SEO TAB --- */}
        {activeTab === "site_meta" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-technical-label text-[10px] text-outline uppercase">GLOBAL META TITLE</label>
              <Input
                value={seoData.title}
                onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                placeholder="SandeRicardo — Fullstack Portfolio"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-technical-label text-[10px] text-outline uppercase">GLOBAL META DESCRIPTION</label>
              <Textarea
                value={seoData.description}
                onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                placeholder="Personal portfolio description..."
                required
              />
            </div>
          </div>
        )}

        {/* Save button footer */}
        <div className="border-t border-outline-variant pt-4 flex justify-between items-center mt-4">
          <span className="font-technical-label text-[9px] text-outline uppercase">
            TRANSACTION: SECURE_WRITE // MERGE_TRUE
          </span>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "[ SAVING_DATA... ]" : "[ SAVE_CHANGES ]"}
          </Button>
        </div>
      </form>
    </div>
  )
}
