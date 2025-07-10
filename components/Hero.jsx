"use client"

import { motion } from "framer-motion"
import { SearchBar } from "./search-bar"


export default function Hero() {
  return (
    <section className="relative min-h-full flex items-center justify-center overflow-hidden pt-24 ">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-40 right-20 w-48 h-48 bg-purple-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-indigo-200/25 rounded-full blur-xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-50">
        <div className="text-center mb-4    ">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight">
              Discover
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-medium"
              >
                Academic Conferences
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed font-light"
          >
            Find conferences, seminars, and workshops in your field. Search by country, category, or topic to discover
            relevant events worldwide.
          </motion.p>
        </div>

        {/* Search Bar Component */}
        <SearchBar />

        {/* Stats or Features */}
     
      </div>

      {/* Bottom Background Image */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 lg:h-90"
      >
        <div
          className="w-full h-full bg-contain bg-no-repeat bg-center opacity-60"
          style={{
            backgroundImage: "url('/images/travel-landmarks.png')",
            backgroundPosition: "center bottom",
          }}
        />
        {/* Gradient overlay to blend with background */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-slate-50/10" />
      </motion.div>
    </section>
  )
}
