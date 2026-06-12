import { adminDb } from "@/lib/firebase/admin"

// --- TYPES & INTERFACES ---

export interface HeroContent {
  boot_sequence: string[]
  name: string
  title: string
}

export interface HighlightItem {
  label: string
  value: string
}

export interface AboutContent {
  bio_paragraphs: string[]
  avatar_url: string
  avatar_alt: string
  highlights: HighlightItem[]
}

export interface SkillItem {
  name: string
  isActive?: boolean
}

export interface SkillCategory {
  title: string
  skills: SkillItem[]
}

export interface StackContent {
  categories: SkillCategory[]
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  bullets: string[]
}

export interface ExperienceContent {
  entries: ExperienceItem[]
}

export interface SocialLink {
  name: string
  url: string
}

export interface ContactContent {
  availability_status: string
  availability_badge: string
  social_links: SocialLink[]
}

export interface SiteMetaContent {
  title: string
  description: string
}

// Map document IDs to their TypeScript types
export interface ContentMap {
  hero: HeroContent
  about: AboutContent
  stack: StackContent
  experience: ExperienceContent
  contact: ContactContent
  site_meta: SiteMetaContent
}

// --- DATABASE OPERATIONS ---

/**
 * Fetches a singleton content document from Firestore.
 * Returns null if the document does not exist.
 */
export async function getContentDoc<K extends keyof ContentMap>(
  id: K
): Promise<ContentMap[K] | null> {
  try {
    const doc = await adminDb.collection("content").doc(id).get()
    return doc.exists ? (doc.data() as ContentMap[K]) : null
  } catch (error) {
    console.error(`Failed to get content doc for ${id}:`, error)
    throw error
  }
}

/**
 * Updates or creates a singleton content document in Firestore.
 */
export async function updateContentDoc<K extends keyof ContentMap>(
  id: K,
  data: Partial<ContentMap[K]>
): Promise<void> {
  try {
    await adminDb.collection("content").doc(id).set(data, { merge: true })
  } catch (error) {
    console.error(`Failed to update content doc for ${id}:`, error)
    throw error
  }
}
