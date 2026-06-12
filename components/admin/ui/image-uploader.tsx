"use client"

import * as React from "react"
import { uploadImageAction } from "@/app/actions/upload"

interface ImageUploaderProps {
  folder: "portfolio/avatar" | "portfolio/projects/covers" | "portfolio/projects/screenshots" | "portfolio/diagrams"
  value?: string
  onChange: (url: string) => void
  label?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  folder,
  value,
  onChange,
  label = "SELECT_IMAGE",
}) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // 1. Validate size (Max 10MB as per SRS)
    const MAX_SIZE_MB = 10
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_SIZE_MB}MB limit.`)
      return
    }

    // 2. Validate format (JPG, PNG, WebP, GIF as per SRS)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file format. Allowed: JPG, PNG, WebP, GIF.")
      return
    }

    setLoading(true)

    try {
      // 3. Read file as base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (err) => reject(err)
      })
      reader.readAsDataURL(file)
      
      const base64Data = await base64Promise

      // 4. Trigger Server Action to upload
      const res = await uploadImageAction(base64Data, folder)

      if (res.success && res.url) {
        onChange(res.url)
      } else {
        setError(res.error || "Failed to upload image.")
      }
    } catch (err: any) {
      console.error("Uploader client error:", err)
      setError("An unexpected error occurred during upload.")
    } finally {
      setLoading(false)
      // Reset input value to allow uploading same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const triggerSelect = () => {
    if (fileInputRef.current && !loading) {
      fileInputRef.current.click()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Remove this image?")) {
      onChange("")
    }
  }

  return (
    <div className="flex flex-col gap-2 select-none">
      <span className="font-technical-label text-[10px] text-on-background uppercase">
        {label}
      </span>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp,.gif"
        className="hidden"
        disabled={loading}
      />

      {value ? (
        // Image Preview State
        <div className="relative border border-outline-variant bg-surface-container-lowest p-2 flex flex-col md:flex-row items-center gap-4 group">
          <div className="relative w-full md:w-32 h-20 bg-black/40 border border-outline-variant flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded thumbnail"
              className="object-contain max-h-full max-w-full"
            />
          </div>
          <div className="flex-grow flex flex-col gap-1 items-start">
            <span className="font-technical-label text-[9px] text-outline break-all">
              URL: {value}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="font-technical-label text-[10px] text-error hover:underline uppercase mt-1 cursor-pointer"
            >
              [ REMOVE_IMAGE ]
            </button>
          </div>
        </div>
      ) : (
        // Drag / Select State
        <div
          onClick={triggerSelect}
          className={`border border-dashed border-outline-variant bg-[#191A1E] hover:border-white p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <span className="font-technical-label text-xs text-primary">
            {loading ? "[ UPLOADING_FILE... ]" : "[ SELECT_OR_DRAG_FILE ]"}
          </span>
          <span className="font-mono text-[9px] text-on-surface-variant">
            MAX SIZE: 10MB // FORMATS: JPG, PNG, WEBP, GIF
          </span>
        </div>
      )}

      {error && (
        <span className="font-technical-label text-[10px] text-error uppercase mt-1">
          * ERROR: {error}
        </span>
      )}
    </div>
  )
}
