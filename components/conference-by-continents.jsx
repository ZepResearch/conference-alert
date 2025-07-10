"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, ArrowRight, MapPin, ExternalLink, Globe, Users } from 'lucide-react'
import {
  getContinentsList,
  getContinentInfo,
  getCountriesByContinent,
  popularCountriesByContinent,
} from "@/lib/continents-data"
import { createSlug } from "@/lib/search-utils"

export function ConferenceByContinents() {
  const [selectedContinent, setSelectedContinent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const continents = getContinentsList()

  const handleCountryClick = (country) => {
    const countrySlug = createSlug(country)
    return `/search/${countrySlug}`
  }

  const handleContinentClick = (continent) => {
    setSelectedContinent(continent)
    setSearchTerm("")
    setIsDialogOpen(true)
  }

  const filteredCountries = selectedContinent
    ? getCountriesByContinent(selectedContinent).filter((country) =>
        country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50/50 to-gray-100/30" />

      {/* Floating decorative elements - minimal and subtle */}
      <motion.div variants={floatingVariants} animate="float" className="absolute top-20 left-16 w-12 h-12 opacity-10">
        <Globe className="w-full h-full text-gray-400" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "2s" }}
        className="absolute top-40 right-20 w-16 h-16 opacity-8"
      >
        <div className="w-full h-full bg-gray-200 rounded-2xl rotate-12" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "4s" }}
        className="absolute bottom-32 left-1/4 w-10 h-10 opacity-12"
      >
        <Users className="w-full h-full text-gray-300" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "3s" }}
        className="absolute bottom-20 right-16 w-14 h-14 opacity-8"
      >
        <div className="w-full h-full bg-gray-300 rounded-full" />
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
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">Continents</span>
          </h3>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Explore conferences across all continents and countries worldwide
          </p>
        </motion.div>

        {/* Continents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {continents.map((continent, index) => {
            const continentInfo = getContinentInfo(continent)
            const popularCountries = popularCountriesByContinent[continent] || []
            const totalCountries = getCountriesByContinent(continent).length

            return (
              <motion.div
                key={continent}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/90 hover:border-gray-300/50 transition-all duration-500 hover:shadow-xl h-full">
                  <div className="p-8 text-center border-b border-gray-100/50">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-center mb-4"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300 overflow-hidden">
                        <img 
                          src={continentInfo.icon} 
                          alt={`${continent} icon`}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            // Fallback to a default icon if image fails to load
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML = '<span class="text-2xl">🌍</span>'
                          }}
                        />
                      </div>
                    </motion.div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{continent}</h4>
                    <p className="text-sm text-gray-500 font-light">{totalCountries} countries</p>
                  </div>

                  <div className="p-6">
                    {/* Popular Countries Preview */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-sm text-gray-700">Popular Countries:</h4>
                      <div className="space-y-2">
                        {popularCountries.map((country, countryIndex) => (
                          <motion.div
                            key={country}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: countryIndex * 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            <Link href={handleCountryClick(country)}>
                              <Badge
                                variant="outline"
                                className="w-full justify-start py-3 px-4 cursor-pointer transition-all duration-300 border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 hover:border-gray-300 text-gray-700 hover:text-gray-900 rounded-xl"
                              >
                                <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                                {country}
                              </Badge>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* View All Countries Button */}
                    <Dialog open={isDialogOpen && selectedContinent === continent} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                            onClick={() => handleContinentClick(continent)}
                          >
                            View All {continent} Countries
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] bg-white/95 backdrop-blur-sm border border-gray-200/50">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3 text-gray-900">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img 
                                src={continentInfo.icon} 
                                alt={`${continent} icon`}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.parentElement.innerHTML = '<span class="text-lg">🌍</span>'
                                }}
                              />
                            </div>
                            {continent} Countries
                          </DialogTitle>
                          <DialogDescription className="text-gray-600 font-light">
                            Click on any country to find conferences and events in that location
                          </DialogDescription>
                        </DialogHeader>

                        {/* Search Bar */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mb-4"
                        >
                          <div className="relative">
                            <Input
                              placeholder={`Search countries in ${continent}...`}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-12 h-12 border-0 bg-gray-50/50 hover:bg-gray-100/50 focus:bg-white transition-all duration-300 rounded-xl text-base placeholder:text-gray-400"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </motion.div>

                        {/* Countries List */}
                        <ScrollArea className="h-96">
                          {filteredCountries.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4 }}
                              className="text-center py-12"
                            >
                              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                              </div>
                              <h4 className="text-lg font-medium text-gray-900 mb-2">No countries found</h4>
                              <p className="text-gray-600 font-light">Try adjusting your search term</p>
                            </motion.div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <AnimatePresence>
                                {filteredCountries.map((country, countryIndex) => (
                                  <motion.div
                                    key={country}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: countryIndex * 0.05 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Link
                                      href={handleCountryClick(country)}
                                      onClick={() => setIsDialogOpen(false)}
                                    >
                                      <div className="group p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 cursor-pointer hover:shadow-lg">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                                              <MapPin className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <span className="font-medium text-sm text-gray-800 group-hover:text-gray-900 transition-colors">
                                              {country}
                                            </span>
                                          </div>
                                          <motion.div
                                            whileHover={{ x: 3 }}
                                            transition={{ duration: 0.2 }}
                                          >
                                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
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

                        {/* Stats */}
                        <div className="mt-4 pt-4 border-t border-gray-200/50 text-center">
                          <p className="text-sm text-gray-500 font-light">
                            {filteredCountries.length} of {totalCountries} countries
                            {searchTerm && ` matching "${searchTerm}"`}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </section>
  )
}