import { LandingClient } from "@/components/layout/landing-client"
import { getContentDoc } from "@/lib/db/content"

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 3600

export default async function Home() {
  // Fetch all content concurrently from Firestore
  const [
    heroData,
    aboutData,
    stackData,
    experienceData,
    contactData
  ] = await Promise.all([
    getContentDoc("hero"),
    getContentDoc("about"),
    getContentDoc("stack"),
    getContentDoc("experience"),
    getContentDoc("contact")
  ])

  return (
    <LandingClient
      heroData={heroData}
      aboutData={aboutData}
      stackData={stackData}
      experienceData={experienceData}
      contactData={contactData}
    />
  )
}
