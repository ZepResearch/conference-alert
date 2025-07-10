"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Globe, Building, Sparkles, Users, Calendar } from "lucide-react"
import { indianCities, globalCities, indianStates, getTopCities } from "@/lib/cities-data"
import { createSlug } from "@/lib/search-utils"
import Image from "next/image"

export function FeaturedEvents() {
  const topIndianCities = getTopCities(indianCities, 12)
  const topGlobalCities = getTopCities(globalCities, 12)

  const handleCityClick = (cityName, isGlobal = false) => {
    const slug = createSlug(cityName)
    // Use the search page with city filter
    return `/search/city/${slug}`
  }

  const handleStateClick = (stateName) => {
    const slug = createSlug(stateName)
    return `/search/state/${slug}`
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />

      {/* Floating decorative elements */}
      <motion.div variants={floatingVariants} animate="float" className="absolute top-20 left-10 w-16 h-16 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl rotate-12 shadow-lg" />
      </motion.div>

  

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "4s" }}
        className="absolute bottom-32 left-1/4 w-20 h-20 opacity-15"
      >
        <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg" />
      </motion.div>

   
      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "3s" }}
        className="absolute bottom-20 right-10 w-18 h-18 opacity-25"
      >
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg rotate-45 shadow-lg" />
      </motion.div>


      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-light text-gray-900 mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
              Events
            </span>
          </h3>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Discover conferences by location across India and around the world
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conference by Cities in India */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group h-full"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/80 hover:border-white/50 transition-all duration-500 hover:shadow-2xl h-full overflow-hidden">
              {/* Header with gradient background */}
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                <div className="absolute inset-0 bg-black/10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute top-4 right-4 w-12 h-12 border border-white/20 rounded-full"
                />
                <div className="relative z-10 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm ">
                     <Image src={'/images/india.png'} alt="india" fill/>
                    </div>
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-2">Cities in India</h4>
                  <p className="text-blue-100 text-sm font-light">Explore events in major Indian cities</p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {topIndianCities.map((city, index) => (
                    <motion.div
                      key={city.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={handleCityClick(city.name)}>
                        <Badge
                          variant="outline"
                          className="w-full justify-center py-3 px-4 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-300 text-sm font-medium rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm"
                        >
                          {city.name}
                        </Badge>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Link href="/cities/india">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-white  transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl">
                      View All Indian Cities
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Conference by Global Cities */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group h-full"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/80 hover:border-white/50 transition-all duration-500 hover:shadow-2xl h-full overflow-hidden">
              {/* Header with gradient background */}
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                <div className="absolute inset-0 bg-black/10" />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute top-4 right-4 w-12 h-12 border border-white/20 rounded-full"
                />
                <div className="relative z-10 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                     <Image src={'/images/international.png'} alt="india" fill/>
                    </div>
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-2">Global Cities</h4>
                  <p className="text-blue-100 text-sm font-light">Find events in cities worldwide</p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {topGlobalCities.map((city, index) => (
                    <motion.div
                      key={city.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={handleCityClick(city.name, true)}>
                        <Badge
                          variant="outline"
                          className="w-full justify-center py-3 px-4 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-300 text-sm font-medium rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm"
                        >
                          {city.name}
                        </Badge>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Link href="/cities/global">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-white  transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl">
                      View All Global Cities
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Conference by States in India */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group h-full"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/80 hover:border-white/50 transition-all duration-500 hover:shadow-2xl h-full overflow-hidden">
              {/* Header with gradient background */}
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                <div className="absolute inset-0 bg-black/10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute top-4 right-4 w-12 h-12 border border-white/20 rounded-full"
                />
                <div className="relative z-10 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                     <Image src={'/images/states.png'} alt="india" fill/>
                    </div>
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-2">States in India</h4>
                  <p className="text-blue-100 text-sm font-light">Browse events by Indian states</p>
                </div>
              </div>

              <div className="p-6">
                <div className="max-h-90 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 gap-3">
                    {indianStates.map((state, index) => (
                      <motion.div
                        key={state.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link href={handleStateClick(state.name)}>
                          <Badge
                            variant="outline"
                            className="w-full justify-start py-3 px-4 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-300 text-sm font-medium rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm"
                          >
                            {state.name}
                          </Badge>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
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
