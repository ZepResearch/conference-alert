"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, ArrowLeft, Sparkles, Building } from "lucide-react"
import { indianCities } from "@/lib/cities-data"
import { createSlug } from "@/lib/search-utils"
import { Navbar } from "@/components/Navbar"

export default function IndianCitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCities, setFilteredCities] = useState(indianCities)

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredCities(indianCities)
    } else {
      const filtered = indianCities.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          (city.state && city.state.toLowerCase().includes(query.toLowerCase())),
      )
      setFilteredCities(filtered)
    }
  }

  const handleCityClick = (cityName) => {
    const slug = createSlug(cityName)
    return `/search/city/${slug}`
  }

  const floatingVariants = {
    float: {
      y: [-8, 8, -8],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 relative overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        variants={floatingVariants}
        animate="float"
        className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl opacity-30"
      />
      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "2s" }}
        className="absolute top-40 right-20 w-48 h-48 bg-purple-200/20 rounded-full blur-xl opacity-20"
      />
      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "4s" }}
        className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-200/25 rounded-full blur-xl opacity-25"
      />

      {/* Header */}
     <Navbar/>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Conference Cities in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
              India
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Discover conferences in major Indian cities - {filteredCities.length} cities available
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/80 transition-all duration-500 shadow-xl">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Search Cities</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="relative">
                <Input
                  placeholder="Search by city or state name..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-12 border-0 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 rounded-xl text-base placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredCities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link href={handleCityClick(city.name)}>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 hover:border-white/50 transition-all duration-500 hover:shadow-2xl overflow-hidden h-full">
                    <div className="p-6 text-center">
                      {/* City Icon */}
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl mb-4 group-hover:drop-shadow-lg transition-all duration-300"
                      >
                        {city.icon}
                      </motion.div>

                      {/* City Name */}
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300 text-gray-900">
                        {city.name}
                      </h3>

                      {/* State Info */}
                      <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                        <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-blue-100 transition-colors duration-300">
                          <MapPin className="h-3 w-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                        </div>
                        <span className="font-medium">{city.state || "India"}</span>
                      </div>

                      {/* Hover Effect Indicator */}
                      <div className="pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-center">
                          <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            View Conferences
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results State */}
        {filteredCities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-medium text-gray-900 mb-3">No cities found</h4>
              <p className="text-gray-600 font-light mb-6">
                Try adjusting your search criteria or browse all available cities
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleSearch("")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                >
                  Show All Cities
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        {filteredCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: filteredCities.length.toString(), label: "Cities Available" },
              { number: "28+", label: "States Covered" },
              { number: "1000+", label: "Events Listed" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="text-center p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 hover:bg-white/60 transition-all duration-300"
              >
                <div className="text-3xl font-light text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-light">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
