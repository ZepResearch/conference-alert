// Cities data for India and Global

export const indianCities = [
  { name: "Mumbai", state: "Maharashtra", icon: "🏙️" },
  { name: "Delhi", state: "Delhi", icon: "🏛️" },
  { name: "Bangalore", state: "Karnataka", icon: "💻" },
  { name: "Hyderabad", state: "Telangana", icon: "🏢" },
  { name: "Chennai", state: "Tamil Nadu", icon: "🏭" },
  { name: "Kolkata", state: "West Bengal", icon: "🎭" },
  { name: "Pune", state: "Maharashtra", icon: "🎓" },
  { name: "Ahmedabad", state: "Gujarat", icon: "🏭" },
  { name: "Jaipur", state: "Rajasthan", icon: "🏰" },
  { name: "Surat", state: "Gujarat", icon: "💎" },
  { name: "Lucknow", state: "Uttar Pradesh", icon: "🕌" },
  { name: "Kanpur", state: "Uttar Pradesh", icon: "🏭" },
  { name: "Nagpur", state: "Maharashtra", icon: "🍊" },
  { name: "Indore", state: "Madhya Pradesh", icon: "🏛️" },
  { name: "Thane", state: "Maharashtra", icon: "🌆" },
  { name: "Bhopal", state: "Madhya Pradesh", icon: "🏞️" },
  { name: "Visakhapatnam", state: "Andhra Pradesh", icon: "⚓" },
  { name: "Pimpri-Chinchwad", state: "Maharashtra", icon: "🏭" },
  { name: "Patna", state: "Bihar", icon: "🏛️" },
  { name: "Vadodara", state: "Gujarat", icon: "🎨" },
]

export const globalCities = [
  { name: "New York", country: "United States", icon: "🗽" },
  { name: "London", country: "United Kingdom", icon: "🏰" },
  { name: "Tokyo", country: "Japan", icon: "🗼" },
  { name: "Paris", country: "France", icon: "🗼" },
  { name: "Singapore", country: "Singapore", icon: "🏙️" },
  { name: "Sydney", country: "Australia", icon: "🏖️" },
  { name: "Toronto", country: "Canada", icon: "🍁" },
  { name: "Berlin", country: "Germany", icon: "🏛️" },
  { name: "Dubai", country: "United Arab Emirates", icon: "🏗️" },
  { name: "Hong Kong", country: "Hong Kong", icon: "🏙️" },
  { name: "Amsterdam", country: "Netherlands", icon: "🚲" },
  { name: "Barcelona", country: "Spain", icon: "🏛️" },
  { name: "Stockholm", country: "Sweden", icon: "🏰" },
  { name: "Zurich", country: "Switzerland", icon: "⛰️" },
  { name: "Vienna", country: "Austria", icon: "🎼" },
  { name: "Copenhagen", country: "Denmark", icon: "🚲" },
  { name: "Seoul", country: "South Korea", icon: "🏙️" },
  { name: "Melbourne", country: "Australia", icon: "☕" },
  { name: "Vancouver", country: "Canada", icon: "🏔️" },
  { name: "Munich", country: "Germany", icon: "🍺" },
]

export const indianStates = [
  { name: "Andhra Pradesh", icon: "🏛️" },
  { name: "Arunachal Pradesh", icon: "⛰️" },
  { name: "Assam", icon: "🌿" },
  { name: "Bihar", icon: "🏛️" },
  { name: "Chhattisgarh", icon: "🌲" },
  { name: "Goa", icon: "🏖️" },
  { name: "Gujarat", icon: "🦁" },
  { name: "Haryana", icon: "🌾" },
  { name: "Himachal Pradesh", icon: "🏔️" },
  { name: "Jharkhand", icon: "⛰️" },
  { name: "Karnataka", icon: "💻" },
  { name: "Kerala", icon: "🥥" },
  { name: "Madhya Pradesh", icon: "🐅" },
  { name: "Maharashtra", icon: "🏙️" },
  { name: "Manipur", icon: "🏔️" },
  { name: "Meghalaya", icon: "☔" },
  { name: "Mizoram", icon: "🌲" },
  { name: "Nagaland", icon: "🏔️" },
  { name: "Odisha", icon: "🏛️" },
  { name: "Punjab", icon: "🌾" },
  { name: "Rajasthan", icon: "🏰" },
  { name: "Sikkim", icon: "🏔️" },
  { name: "Tamil Nadu", icon: "🏛️" },
  { name: "Telangana", icon: "🏢" },
  { name: "Tripura", icon: "🌿" },
  { name: "Uttar Pradesh", icon: "🕌" },
  { name: "Uttarakhand", icon: "🏔️" },
  { name: "West Bengal", icon: "🎭" },
  { name: "Delhi", icon: "🏛️" },
  { name: "Jammu and Kashmir", icon: "🏔️" },
  { name: "Ladakh", icon: "🏔️" },
  { name: "Chandigarh", icon: "🏛️" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", icon: "🏖️" },
  { name: "Lakshadweep", icon: "🏝️" },
  { name: "Puducherry", icon: "🏖️" },
]

// Helper functions
export function getTopCities(cities, count = 12) {
  return cities.slice(0, count)
}

export function getCitiesByCountry(country) {
  return globalCities.filter((city) => city.country === country)
}

export function getCitiesByState(state) {
  return indianCities.filter((city) => city.state === state)
}
