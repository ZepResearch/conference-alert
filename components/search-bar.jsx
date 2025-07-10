"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Tag, BookOpen, Sparkles } from "lucide-react"
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

  const quickSearchOptions = [
    {
      title: "Tech Conferences",
      location: "USA",
      country: "United States",
      category: "Engineering and Technology",
      icon: "💻",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Medical Events",
      location: "UK",
      country: "United Kingdom",
      category: "Medical And Health Science",
      icon: "🏥",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Business Events",
      location: "Germany",
      country: "Germany",
      category: "Business and Economics",
      icon: "💼",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Education",
      location: "Worldwide",
      country: "all",
      category: "Education",
      icon: "🎓",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      {/* Main Search Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Search Type Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center space-x-2 mb-6"
          >
            <Button
              type="button"
              variant={searchType === "category" ? "default" : "outline"}
              onClick={() => setSearchType("category")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                searchType === "category"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-white/50 hover:bg-white/80 border-gray-200"
              }`}
            >
              <Tag className="h-4 w-4" />
              Search by Category
            </Button>
            <Button
              type="button"
              variant={searchType === "topic" ? "default" : "outline"}
              onClick={() => setSearchType("topic")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                searchType === "topic"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-white/50 hover:bg-white/80 border-gray-200"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Search by Topic
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Country Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-3"
            >
              <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-blue-500" />
                Country
              </label>
              <Select  onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full h-12 border-0 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500/20">
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
            </motion.div>

            {/* Category or Topic Selection */}
            {searchType === "category" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="space-y-3"
              >
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Tag className="h-4 w-4 text-purple-500" />
                  Category
                </label>
                <Select onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full h-12 border-0 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 rounded-xl text-base focus:ring-2 focus:ring-purple-500/20">
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
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="space-y-3"
              >
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  Topic
                </label>
                <Input
                  placeholder="Enter topic (e.g., AI, Machine Learning)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-0 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 rounded-xl text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </motion.div>
            )}

            {/* Search Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-3"
            >
              <label className="text-sm font-medium opacity-0">Search</label>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl text-base shadow-lg hover:shadow-xl"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Events
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </form>
      </div>

      {/* Quick Search Options */}
      {/* <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="space-y-4"
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Popular Searches
          </h3>
          <p className="text-gray-500 text-sm">Quick access to trending conference categories</p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickSearchOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer group"
              onClick={() => handleQuickSearch(option.country, option.category)}
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300 hover:shadow-xl group-hover:border-white/50">
                <div className="text-center space-y-3">
                  <div
                    className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${option.gradient} flex items-center justify-center text-white text-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors duration-300">
                      {option.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div> */}
    </motion.div>
  )
}
