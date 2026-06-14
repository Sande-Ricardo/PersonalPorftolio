import { MetadataRoute } from 'next'
import { adminDb } from '@/lib/firebase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.dev'

  try {
    // Fetch published projects from Firestore
    const projectsSnapshot = await adminDb
      .collection('projects')
      .where('status', '==', 'published')
      .get()

    const projectsUrls: MetadataRoute.Sitemap = projectsSnapshot.docs.map((doc) => {
      const project = doc.data()
      return {
        url: `${baseUrl}/projects/${project.slug || doc.id}`,
        lastModified: project.updated_at ? new Date(project.updated_at).toISOString() : new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    })

    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      ...projectsUrls,
    ]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    // Fallback to just the home page if db fetch fails
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 1,
      }
    ]
  }
}
