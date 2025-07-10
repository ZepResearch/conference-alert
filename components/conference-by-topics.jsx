"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, BookOpen, ArrowRight, Tag, Sparkles, Brain, Microscope, Calculator } from 'lucide-react'
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

  const getCategoryGradient = (category, isSelected) => {
    const gradients = {
      "Engineering and Technology": isSelected 
          ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      "Medical And Health Science": isSelected 
   ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      "Business and Economics": isSelected 
         ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      Education: isSelected 
          ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      "Social Sciences and Humanities": isSelected
       ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      "Sports Science": isSelected 
         ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      "Physical and life sciences": isSelected
          ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      Agriculture: isSelected 
          ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      "Mathematics and statistics": isSelected 
        ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      Law: isSelected 
        ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
      Interdisciplinary: isSelected 
         ? "from-gray-500 to-gray-600" 
        : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
    }
    return gradients[category] || (isSelected ? "from-gray-500 to-gray-600" : "from-gray-100 to-gray-200")
  }

  const floatingVariants = {
    float: {
      y: [-15, 15, -15],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-white" />

      {/* Floating decorative elements */}
     
      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "2s" }}
        className="absolute top-40 right-20 w-16 h-16 opacity-15"
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl rotate-12 shadow-lg" />
      </motion.div>

      

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "1s" }}
        className="absolute top-60 right-1/3 w-18 h-18 opacity-20"
      >
        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg" />
      </motion.div>

    

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-light text-gray-900 mb-4">
            Conference By{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">
              Topics
            </span>
          </h3>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Explore conferences by academic categories and specific topics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Section - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/80 transition-all duration-500 shadow-xl h-full">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Categories</h4>
                </div>
                <p className="text-sm text-gray-600 font-light">Select a category to view related topics</p>
              </div>

              <div className="p-6">
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {categories.map((category, index) => (
                        <motion.button
                          key={category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedCategory(category)
                            setSearchTerm("") // Clear search when switching categories
                          }}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                            selectedCategory === category
                              ? `bg-gradient-to-r ${getCategoryGradient(category, true)} text-white shadow-lg border-transparent`
                              : `bg-gradient-to-r ${getCategoryGradient(category, false)} border-white/30 hover:border-white/50 hover:shadow-md`
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{getCategoryIcon(category)}</span>
                            <div className="flex-1">
                              <h4 className={`font-medium text-sm leading-tight ${
                                selectedCategory === category ? 'text-white' : 'text-gray-800'
                              }`}>
                                {category}
                              </h4>
                              <p className={`text-xs mt-1 ${
                                selectedCategory === category ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {getTopicsByCategory(category).length} topics
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </motion.div>

          {/* Topics Section - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-50 backdrop-blur-sm rounded-3xl border border-white/30  transition-all duration-500 shadow-xl h-full">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Tag className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedCategory} Topics</h4>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                    {filteredTopics.length} topics
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 font-light">Click on any topic to find related conferences</p>
              </div>

              <div className="p-6">
                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="mb-6"
                >
                  <div className="relative">
                    <Input
                      placeholder={`Search topics in ${selectedCategory}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-0 bg-white shadow hover:bg-white/70 focus:bg-white transition-all duration-300 rounded-xl text-base placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/20"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                {/* Topics Grid */}
                <ScrollArea className="h-80 bg-white">
                  {filteredTopics.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No topics found</h4>
                      <p className="text-gray-600 font-light">Try adjusting your search term</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-2">
                      <AnimatePresence>
                        {filteredTopics.map((topic, index) => (
                          <motion.div
                            key={topic}

                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link href={handleTopicClick(topic)}>
                              <div className="group p-4 rounded-2xl bg-white shadow-xs backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 transition-all duration-300 cursor-pointer hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm text-gray-800 group-hover:text-gray-900 transition-colors leading-relaxed">
                                    {topic}
                                  </span>
                                  <motion.div
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                  >
                                    <ArrowRight className="h-4 w-4 text-white" />
                                  </motion.div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </ScrollArea>

                {/* View All Topics Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="mt-6 pt-6 border-t border-white/20"
                >
                  <Link href={`/search/all/category/${createSlug(selectedCategory)}`}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl h-12">
                        <Sparkles className="h-4 w-4 mr-2" />
                        View All {selectedCategory} Conferences
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.5);
        }
      `}</style>
    </section>
  )
}
