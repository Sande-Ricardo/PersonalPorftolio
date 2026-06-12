"use client"

import * as React from "react"
import { ImageUploader } from "@/components/admin/ui/image-uploader"
import { CopyButton } from "@/components/ui/copy-button"

export default function ImagesPage() {
  const [avatarUrl, setAvatarUrl] = React.useState("")
  const [coverUrl, setCoverUrl] = React.useState("")
  const [screenshotUrl, setScreenshotUrl] = React.useState("")
  const [diagramUrl, setDiagramUrl] = React.useState("")

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Title */}
      <div className="border-b border-outline-variant pb-4">
        <span className="font-technical-label text-[10px] text-on-surface-variant block mb-1">
          [ MEDIA_ASSET_MANAGER ]
        </span>
        <h1 className="font-display text-2xl font-medium text-primary uppercase">
          IMAGE_MANAGEMENT.EXE
        </h1>
      </div>

      <p className="font-mono text-xs text-on-surface-variant max-w-2xl leading-relaxed">
        Upload assets to Cloudinary. The generated secure URLs will be outputted below, ready to be copied
        and referenced in project collections or general content editors.
      </p>

      {/* Grid of upload categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Category 1: Avatar */}
        <div className="bg-[#191A1E] border border-outline-variant p-6 relative rounded-none flex flex-col gap-4">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/40"></div>
          <div className="border-b border-outline-variant pb-3 mb-2 flex justify-between items-center">
            <span className="font-technical-label text-xs text-primary font-bold">
              01 // OWNER_AVATAR
            </span>
            <span className="font-technical-label text-[8px] bg-white/10 text-outline px-1.5 py-0.5">
              avatar/
            </span>
          </div>

          <ImageUploader
            folder="portfolio/avatar"
            value={avatarUrl}
            onChange={setAvatarUrl}
            label="AVATAR PHOTO"
          />

          {avatarUrl && (
            <div className="mt-2 flex items-center gap-2 bg-black/40 border border-outline-variant p-2 justify-between">
              <span className="font-technical-label text-[9px] text-outline truncate flex-grow">
                {avatarUrl}
              </span>
              <CopyButton text={avatarUrl} />
            </div>
          )}
        </div>

        {/* Category 2: Project Covers */}
        <div className="bg-[#191A1E] border border-outline-variant p-6 relative rounded-none flex flex-col gap-4">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/40"></div>
          <div className="border-b border-outline-variant pb-3 mb-2 flex justify-between items-center">
            <span className="font-technical-label text-xs text-primary font-bold">
              02 // PROJECT_COVERS
            </span>
            <span className="font-technical-label text-[8px] bg-white/10 text-outline px-1.5 py-0.5">
              covers/
            </span>
          </div>

          <ImageUploader
            folder="portfolio/projects/covers"
            value={coverUrl}
            onChange={setCoverUrl}
            label="COVER IMAGE"
          />

          {coverUrl && (
            <div className="mt-2 flex items-center gap-2 bg-black/40 border border-outline-variant p-2 justify-between">
              <span className="font-technical-label text-[9px] text-outline truncate flex-grow">
                {coverUrl}
              </span>
              <CopyButton text={coverUrl} />
            </div>
          )}
        </div>

        {/* Category 3: Screenshots */}
        <div className="bg-[#191A1E] border border-outline-variant p-6 relative rounded-none flex flex-col gap-4">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/40"></div>
          <div className="border-b border-outline-variant pb-3 mb-2 flex justify-between items-center">
            <span className="font-technical-label text-xs text-primary font-bold">
              03 // SCREENSHOTS
            </span>
            <span className="font-technical-label text-[8px] bg-white/10 text-outline px-1.5 py-0.5">
              screenshots/
            </span>
          </div>

          <ImageUploader
            folder="portfolio/projects/screenshots"
            value={screenshotUrl}
            onChange={setScreenshotUrl}
            label="GALLERY SCREENSHOT"
          />

          {screenshotUrl && (
            <div className="mt-2 flex items-center gap-2 bg-black/40 border border-outline-variant p-2 justify-between">
              <span className="font-technical-label text-[9px] text-outline truncate flex-grow">
                {screenshotUrl}
              </span>
              <CopyButton text={screenshotUrl} />
            </div>
          )}
        </div>

        {/* Category 4: Diagrams */}
        <div className="bg-[#191A1E] border border-outline-variant p-6 relative rounded-none flex flex-col gap-4">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/40"></div>
          <div className="border-b border-outline-variant pb-3 mb-2 flex justify-between items-center">
            <span className="font-technical-label text-xs text-primary font-bold">
              04 // ARCH_DIAGRAMS
            </span>
            <span className="font-technical-label text-[8px] bg-white/10 text-outline px-1.5 py-0.5">
              diagrams/
            </span>
          </div>

          <ImageUploader
            folder="portfolio/diagrams"
            value={diagramUrl}
            onChange={setDiagramUrl}
            label="ARCHITECTURE DIAGRAM"
          />

          {diagramUrl && (
            <div className="mt-2 flex items-center gap-2 bg-black/40 border border-outline-variant p-2 justify-between">
              <span className="font-technical-label text-[9px] text-outline truncate flex-grow">
                {diagramUrl}
              </span>
              <CopyButton text={diagramUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
