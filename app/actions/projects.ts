"use server"

import { getProjectsList, getProjectBySlugDb, saveProjectDb, deleteProjectDb } from "@/lib/db/projects"
import { ProjectItem } from "@/lib/data/projects"
import { revalidatePath } from "next/cache"

export interface ProjectsActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Server Action to fetch all projects.
 */
export async function fetchProjectsAction(): Promise<ProjectsActionResponse<ProjectItem[]>> {
  try {
    const list = await getProjectsList()
    return { success: true, data: list }
  } catch (error: any) {
    console.error("fetchProjectsAction failed:", error)
    return { success: false, error: error?.message || "Failed to fetch projects list." }
  }
}

/**
 * Server Action to fetch a single project by slug.
 */
export async function fetchProjectBySlugAction(
  slug: string
): Promise<ProjectsActionResponse<ProjectItem | null>> {
  try {
    const project = await getProjectBySlugDb(slug)
    return { success: true, data: project }
  } catch (error: any) {
    console.error(`fetchProjectBySlugAction failed for ${slug}:`, error)
    return { success: false, error: error?.message || "Failed to fetch project details." }
  }
}

/**
 * Server Action to create or update a project.
 * Automatically revalidates affected paths.
 */
export async function saveProjectAction(
  projectData: ProjectItem,
  oldSlug?: string
): Promise<ProjectsActionResponse<void>> {
  try {
    // Basic validations
    if (!projectData.title || !projectData.slug) {
      return { success: false, error: "Title and Slug are required." }
    }

    await saveProjectDb(projectData, oldSlug)

    // Revalidate affected routes
    revalidatePath("/")
    revalidatePath(`/projects/${projectData.slug}`)
    if (oldSlug && oldSlug !== projectData.slug) {
      revalidatePath(`/projects/${oldSlug}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error("saveProjectAction failed:", error)
    return { success: false, error: error?.message || "Failed to save project." }
  }
}

/**
 * Server Action to delete a project by slug.
 */
export async function deleteProjectAction(
  slug: string
): Promise<ProjectsActionResponse<void>> {
  try {
    await deleteProjectDb(slug)

    // Revalidate routes
    revalidatePath("/")
    revalidatePath(`/projects/${slug}`)

    return { success: true }
  } catch (error: any) {
    console.error(`deleteProjectAction failed for ${slug}:`, error)
    return { success: false, error: error?.message || "Failed to delete project." }
  }
}
