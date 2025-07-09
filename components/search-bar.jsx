"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Tag, BookOpen } from "lucide-react"
import { buildSearchUrl, eventCategories, popularCountries } from "@/lib/search-utils"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchType, setSearchType] = useState("category") // "category" or "topic"
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()

    const country = selectedCountry || "all"
    let searchTerm = ""

    if (searchType === "category" && selectedCategory && selectedCategory !== "all") {
      searchTerm = selectedCategory
    } else if (searchType === "topic" && searchQuery.trim()) {
      searchTerm = searchQuery.trim()
    }

    // Build URL based on what's selected
    if (!searchTerm || searchTerm === "all") {
      // If no specific search term or "all" selected, go to general country page
      if (country === "all") {
        router.push("/search/all")
      } else {
        router.push(`/search/${country.toLowerCase().replace(/\s+/g, "-")}`)
      }
    } else {
      // If specific search term, build full URL
      const url = buildSearchUrl(country, searchTerm, searchType)
      router.push(url)
    }
  }

  const handleQuickSearch = (country, category) => {
    const url = buildSearchUrl(country, category, "category")
    router.push(url)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Search Form */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type Toggle */}
            <div className="flex justify-center space-x-4 mb-4">
              <Button
                type="button"
                variant={searchType === "category" ? "default" : "outline"}
                onClick={() => setSearchType("category")}
                className="flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Search by Category
              </Button>
              <Button
                type="button"
                variant={searchType === "topic" ? "default" : "outline"}
                onClick={() => setSearchType("topic")}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Search by Topic
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Country
                </label>
                <Select onValueChange={setSelectedCountry}>
                  <SelectTrigger  className={'w-full'}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {popularCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category or Topic Selection */}
              {searchType === "category" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </label>
                  <Select onValueChange={setSelectedCategory}>
                    <SelectTrigger className={'w-full'}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {eventCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Topic
                  </label>
                  <Input
                    placeholder="Enter topic (e.g., AI, Machine Learning)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              {/* Search Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium opacity-0">Search</label>
                <Button type="submit" className="w-full h-10">
                  <Search className="h-4 w-4 mr-2" />
                  Search Events
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Search Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickSearch("United States", "Engineering and Technology")}
        >
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold">Tech Conferences</h3>
            <p className="text-sm text-gray-600">USA</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickSearch("United Kingdom", "Medical And Health Science")}
        >
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold">Medical Events</h3>
            <p className="text-sm text-gray-600">UK</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickSearch("Germany", "Business and Economics")}
        >
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold">Business Events</h3>
            <p className="text-sm text-gray-600">Germany</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickSearch("all", "Education")}
        >
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold">Education</h3>
            <p className="text-sm text-gray-600">Worldwide</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
