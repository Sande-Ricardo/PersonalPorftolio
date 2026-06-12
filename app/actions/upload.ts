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
  base64Data: string,
  folder: string
): Promise<UploadActionResponse> {
  try {
    // Validate base64 structure
    if (!base64Data.startsWith("data:image/")) {
      return { success: false, error: "Invalid file type. Only image files are allowed." }
    }

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
