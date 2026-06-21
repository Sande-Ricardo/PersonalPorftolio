"use server"

import { uploadImageToCloudinary } from "@/lib/cloudinary"

export interface UploadActionResponse {
  success: boolean
  url?: string
  error?: string
}

/**
 * Server Action to upload a base64 encoded image to Cloudinary.
 * Validates the folder parameter against the allowed list in SRS.
 */
export async function uploadImageAction(
  formData: FormData
): Promise<UploadActionResponse> {
  try {
    const file = formData.get("file") as File | null
    const folder = formData.get("folder") as string | null

    if (!file || !folder) {
      return { success: false, error: "Missing file or folder parameter." }
    }

    // Validate structure
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Invalid file type. Only image files are allowed." }
    }

    // Convert file to base64 for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`

    // Validate that the folder is strictly one of the allowed options in SRS
    const allowedFolders = [
      "portfolio/avatar",
      "portfolio/projects/covers",
      "portfolio/projects/screenshots",
      "portfolio/diagrams",
    ]

    if (!allowedFolders.includes(folder)) {
      return { success: false, error: "Access denied: Invalid target upload folder." }
    }

    const result = await uploadImageToCloudinary(base64Data, folder)
    return { success: true, url: result.secure_url }
  } catch (error: any) {
    console.error("Upload Action Error:", error)
    return { success: false, error: error?.message || "Image upload failed." }
  }
}
