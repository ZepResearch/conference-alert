"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, BookOpen, ArrowRight, Tag } from "lucide-react"
import { getCategoriesList, getTopicsByCategory } from "@/lib/topics-data"
import { createSlug } from "@/lib/search-utils"

export function ConferenceByTopics() {
  const [selectedCategory, setSelectedCategory] = useState("Engineering and Technology")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = getCategoriesList()
  const currentTopics = getTopicsByCategory(selectedCategory)

  // Filter topics based on search term
  const filteredTopics = currentTopics.filter((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleTopicClick = (topic) => {
    const topicSlug = createSlug(topic)
    return `/search/all/topic/${topicSlug}`
  }

  const getCategoryIcon = (category) => {
    const icons = {
      "Engineering and Technology": "⚙️",
      "Medical And Health Science": "🏥",
      "Business and Economics": "💼",
      Education: "🎓",
      "Social Sciences and Humanities": "📚",
      "Sports Science": "🏃",
      "Physical and life sciences": "🔬",
      Agriculture: "🌾",
      "Mathematics and statistics": "📊",
      Law: "⚖️",
      Interdisciplinary: "🔗",
    }
    return icons[category] || "📋"
  }

  const getCategoryColor = (category, isSelected) => {
    const baseColors = {
      "Engineering and Technology": isSelected ? "bg-blue-100 text-blue-800 border-blue-300" : "hover:bg-blue-50",
      "Medical And Health Science": isSelected ? "bg-red-100 text-red-800 border-red-300" : "hover:bg-red-50",
      "Business and Economics": isSelected ? "bg-green-100 text-green-800 border-green-300" : "hover:bg-green-50",
      Education: isSelected ? "bg-purple-100 text-purple-800 border-purple-300" : "hover:bg-purple-50",
      "Social Sciences and Humanities": isSelected
        ? "bg-orange-100 text-orange-800 border-orange-300"
        : "hover:bg-orange-50",
      "Sports Science": isSelected ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "hover:bg-yellow-50",
      "Physical and life sciences": isSelected
        ? "bg-indigo-100 text-indigo-800 border-indigo-300"
        : "hover:bg-indigo-50",
      Agriculture: isSelected ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "hover:bg-emerald-50",
      "Mathematics and statistics": isSelected ? "bg-pink-100 text-pink-800 border-pink-300" : "hover:bg-pink-50",
      Law: isSelected ? "bg-gray-100 text-gray-800 border-gray-300" : "hover:bg-gray-50",
      Interdisciplinary: isSelected ? "bg-teal-100 text-teal-800 border-teal-300" : "hover:bg-teal-50",
    }
    return baseColors[category] || (isSelected ? "bg-gray-100 text-gray-800 border-gray-300" : "hover:bg-gray-50")
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-gray-900">Conference By Topics</h3>
          <p className="mt-4 text-lg text-gray-600">Explore conferences by academic categories and specific topics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Section - Left Side */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Categories
                </CardTitle>
                <p className="text-sm text-gray-600">Select a category to view related topics</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setSearchTerm("") // Clear search when switching categories
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${getCategoryColor(category, selectedCategory === category)}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getCategoryIcon(category)}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm leading-tight">{category}</h4>
                            <p className="text-xs text-gray-500 mt-1">{getTopicsByCategory(category).length} topics</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Topics Section - Right Side */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-green-600" />
                    <CardTitle>{selectedCategory} Topics</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-gray-50">
                    {filteredTopics.length} topics
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Click on any topic to find related conferences</p>
              </CardHeader>
              <CardContent>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Input
                      placeholder={`Search topics in ${selectedCategory}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Topics Grid */}
                <ScrollArea className="h-80">
                  {filteredTopics.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No topics found</h4>
                      <p className="text-gray-600">Try adjusting your search term</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredTopics.map((topic) => (
                        <Link key={topic} href={handleTopicClick(topic)}>
                          <div className="group p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm group-hover:text-blue-700 transition-colors">
                                {topic}
                              </span>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* View All Topics Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link href={`/search/all/category/${createSlug(selectedCategory)}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All {selectedCategory} Conferences
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access Topics */}
        {/* <div className="mt-12">
          <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Popular Topics</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Artificial Intelligence",
              "Machine Learning",
              "Data Science",
              "Cybersecurity",
              "Public Health",
              "Climate Change",
              "Blockchain",
              "Robotics",
              "Biotechnology",
              "Digital Marketing",
              "Renewable Energy",
              "Mental Health",
            ].map((topic) => (
              <Link key={topic} href={handleTopicClick(topic)}>
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  {topic}
                </Badge>
              </Link>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  )
}
