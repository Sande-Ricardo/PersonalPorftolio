import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
}

/**
 * Uploads a base64 data URL string to Cloudinary in a specified folder.
 * @param base64Data The base64 data URL string (e.g., "data:image/png;base64,...")
 * @param folder The folder path in Cloudinary (e.g., "portfolio/projects/covers")
 */
export async function uploadImageToCloudinary(
  base64Data: string,
  folder: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64Data,
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload raw error:", error)
          reject(error || new Error("Upload response returned null result."))
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          })
        }
      }
    )
  })
}
