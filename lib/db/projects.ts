import { adminDb } from "@/lib/firebase/admin"
import { ProjectItem } from "@/lib/data/projects"

/**
 * Fetches all project documents from Firestore, sorted by date or title.
 */
export async function getProjectsList(): Promise<ProjectItem[]> {
  try {
    const snapshot = await adminDb.collection("projects").get()
    const list: ProjectItem[] = []
    snapshot.forEach((doc) => {
      list.push(doc.data() as ProjectItem)
    })
    return list
  } catch (error) {
    console.error("Failed to fetch projects list from Firestore:", error)
    throw error
  }
}

/**
 * Fetches a single project document from Firestore by its slug (document ID).
 */
export async function getProjectBySlugDb(slug: string): Promise<ProjectItem | null> {
  try {
    const doc = await adminDb.collection("projects").doc(slug).get()
    return doc.exists ? (doc.data() as ProjectItem) : null
  } catch (error) {
    console.error(`Failed to fetch project by slug ${slug}:`, error)
    throw error
  }
}

/**
 * Creates or updates a project document in Firestore.
 * If the slug changes, we handle renaming (write new, delete old).
 */
export async function saveProjectDb(
  projectData: ProjectItem,
  oldSlug?: string
): Promise<void> {
  try {
    const newSlug = projectData.slug

    if (oldSlug && oldSlug !== newSlug) {
      // Slug has changed: rename document ID by copying and deleting the old one
      await adminDb.collection("projects").doc(newSlug).set(projectData)
      await adminDb.collection("projects").doc(oldSlug).delete()
    } else {
      // Slug remains same or new project: standard set
      await adminDb.collection("projects").doc(newSlug).set(projectData, { merge: true })
    }
  } catch (error) {
    console.error("Failed to save project to Firestore:", error)
    throw error
  }
}

/**
 * Deletes a project document from Firestore by its slug.
 */
export async function deleteProjectDb(slug: string): Promise<void> {
  try {
    await adminDb.collection("projects").doc(slug).delete()
  } catch (error) {
    console.error(`Failed to delete project ${slug}:`, error)
    throw error
  }
}
