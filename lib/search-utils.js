// Utility functions for search and URL handling

// Category mapping for proper parsing
const categoryMap = {
  "engineering-and-technology": "Engineering and Technology",
  "medical-and-health-science": "Medical And Health Science",
  "business-and-economics": "Business and Economics",
  education: "Education",
  "social-sciences-and-humanities": "Social Sciences and Humanities",
  "sports-science": "Sports Science",
  "physical-and-life-sciences": "Physical and life sciences",
  agriculture: "Agriculture",
  "mathematics-and-statistics": "Mathematics and statistics",
  law: "Law",
  interdisciplinary: "Interdisciplinary",
}

export function parseSlug(slug) {
  if (!slug) return ""

  // Check if it's a known category
  if (categoryMap[slug.toLowerCase()]) {
    return categoryMap[slug.toLowerCase()]
  }

  // Default parsing for other terms
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

export function createSlug(text) {
  if (!text) return ""
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
}

export function buildSearchUrl(country, categoryOrTopic, searchType = "category") {
  const countrySlug = createSlug(country)
  const termSlug = createSlug(categoryOrTopic)

  if (searchType === "topic") {
    return `/search/${countrySlug}/topic/${termSlug}`
  } else {
    return `/search/${countrySlug}/category/${termSlug}`
  }
}

export function buildSearchFilter(country, categoryOrTopic, searchType = "category") {
  const filters = []

  // Only show accepted events
  filters.push('status = "accepted"')

  // Handle country filter
  if (country && country !== "all" && country.toLowerCase() !== "all") {
    filters.push(`country ~ "${country}"`)
  }

  // Handle category/topic filter
  if (categoryOrTopic && categoryOrTopic !== "all" && categoryOrTopic.toLowerCase() !== "all") {
    if (searchType === "topic") {
      filters.push(`event_topic ~ "${categoryOrTopic}"`)
    } else if (searchType === "city") {
      filters.push(`city ~ "${categoryOrTopic}"`)
    } else if (searchType === "state") {
      filters.push(`state_or_province ~ "${categoryOrTopic}"`)
    } else {
      filters.push(`event_category = "${categoryOrTopic}"`)
    }
  }

  return filters.join(" && ")
}

export const eventCategories = [
  "Engineering and Technology",
  "Medical And Health Science",
  "Business and Economics",
  "Education",
  "Social Sciences and Humanities",
  "Sports Science",
  "Physical and life sciences",
  "Agriculture",
  "Mathematics and statistics",
  "Law",
  "Interdisciplinary",
]

export const eventTypes = [
  "Conference",
  "Seminar",
  "Workshop",
  "Webinar",
  "Continuing professional development event",
  "Online conference",
]

// Common countries for the dropdown
export const popularCountries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Japan",
  "Singapore",
  "India",
  "China",
  "Brazil",
]
