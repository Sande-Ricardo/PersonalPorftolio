export interface ContributionCell {
  date: string
  count: number
  level: number
}

export interface GitHubStats {
  totalContributions: number
  longestStreak: number
  activeRepos: number
  cells: ContributionCell[]
  updatedAt: string
}

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql"

const GITHUB_QUERY = `
  query {
    viewer {
      login
      repositories(ownerAffiliations: OWNER, privacy: PUBLIC) {
        totalCount
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              contributionLevel
            }
          }
        }
      }
    }
  }
`

function mapLevel(level: string): number {
  switch (level) {
    case "FIRST_QUARTILE":
      return 1
    case "SECOND_QUARTILE":
      return 2
    case "THIRD_QUARTILE":
      return 3
    case "FOURTH_QUARTILE":
      return 4
    default:
      return 0
  }
}

export async function fetchGitHubContributions(): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT

  if (!token) {
    throw new Error("Missing GITHUB_TOKEN or GITHUB_PAT environment variable.")
  }

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: GITHUB_QUERY }),
    // Cache the fetch results for 1 hour (3600 seconds)
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const json = await response.json()
  
  if (json.errors && json.errors.length > 0) {
    throw new Error(`GitHub GraphQL Error: ${json.errors[0].message}`)
  }

  const viewer = json.data?.viewer
  if (!viewer) {
    throw new Error("Failed to retrieve viewer details from GitHub response.")
  }

  const calendar = viewer.contributionsCollection?.contributionCalendar
  if (!calendar) {
    throw new Error("Failed to retrieve contribution calendar from GitHub response.")
  }

  const activeRepos = viewer.repositories?.totalCount || 0
  const totalContributions = calendar.totalContributions || 0

  // Flatten weeks and calculate streak
  const cells: ContributionCell[] = []
  const allDays: { contributionCount: number; date: string; contributionLevel: string }[] = []

  const weeks = calendar.weeks || []
  for (const week of weeks) {
    const days = week.contributionDays || []
    for (const day of days) {
      allDays.push(day)
    }
  }

  // Calculate streak and format cells
  let longestStreak = 0
  let currentStreak = 0

  for (const day of allDays) {
    // Format date to: MMM DD, YYYY (matches what the frontend previously simulated)
    const dateObj = new Date(day.date + "T00:00:00") // avoid timezone shifts
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    const count = day.contributionCount
    const level = mapLevel(day.contributionLevel)

    cells.push({
      date: formattedDate,
      count,
      level,
    })

    if (count > 0) {
      currentStreak++
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }
    } else {
      currentStreak = 0
    }
  }

  return {
    totalContributions,
    longestStreak,
    activeRepos,
    cells,
    updatedAt: new Date().toISOString(),
  }
}
