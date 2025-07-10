"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, CalendarDays, ArrowRight, Clock } from 'lucide-react'

export function ConferenceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Generate 12 months starting from current month
  const generateMonths = (startDate) => {
    const months = []
    const date = new Date(startDate)
    for (let i = 0; i < 12; i++) {
      months.push(new Date(date.getFullYear(), date.getMonth() + i, 1))
    }
    return months
  }

  const [displayMonths, setDisplayMonths] = useState(() => generateMonths(currentDate))

  // Update months when current date changes
  useEffect(() => {
    setDisplayMonths(generateMonths(currentDate))
  }, [currentDate])

  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const formatMonthShort = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
    })
  }

  const isCurrentMonth = (month) => {
    const now = new Date()
    return month.getMonth() === now.getMonth() && month.getFullYear() === now.getFullYear()
  }

  const navigateMonths = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getMonthUrl = (month) => {
    const year = month.getFullYear()
    const monthNum = String(month.getMonth() + 1).padStart(2, "0")
    return `/calendar/${year}/${monthNum}`
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
    <section className="py-20 relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-white" />

      {/* Floating decorative elements - minimal and subtle */}
      <motion.div variants={floatingVariants} animate="float" className="absolute top-20 left-16 w-10 h-10 opacity-8">
        <Calendar className="w-full h-full text-gray-300" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "2s" }}
        className="absolute top-40 right-20 w-12 h-12 opacity-6"
      >
        <div className="w-full h-full bg-gray-200 rounded-xl rotate-12" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "4s" }}
        className="absolute bottom-32 left-1/4 w-8 h-8 opacity-10"
      >
        <Clock className="w-full h-full text-gray-400" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "3s" }}
        className="absolute bottom-20 right-16 w-14 h-14 opacity-6"
      >
        <div className="w-full h-full bg-gray-300 rounded-2xl rotate-45" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-light text-gray-900 mb-4">
            Conference <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">Calendar</span>
          </h3>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Browse conferences by month - click on any month to see all events
          </p>
        </motion.div>

        {/* Calendar Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between mb-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => navigateMonths(-12)}
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Year
            </Button>
          </motion.div>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50 shadow">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-lg font-medium text-gray-800">
              {formatMonthYear(currentDate)} -{" "}
              {formatMonthYear(new Date(currentDate.getFullYear(), currentDate.getMonth() + 11, 1))}
            </span>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => navigateMonths(12)}
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
            >
              Next Year
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Month Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
          <AnimatePresence mode="wait">
            {displayMonths.map((month, index) => {
              const isCurrent = isCurrentMonth(month)

              return (
                <motion.div
                  key={`${month.getFullYear()}-${month.getMonth()}`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link href={getMonthUrl(month)}>
                    <div
                      className={`cursor-pointer transition-all duration-500 rounded-3xl border overflow-hidden hover:shadow-xl ${
                        isCurrent
                          ? "bg-gradient-to-tr from-purple-600 to-blue-600 border-gray-800 shadow-lg "
                          : "bg-white/70 backdrop-blur-sm border-gray-200/50 hover:bg-white hover:border-gray-300/50 shadow"
                      }`}
                    >
                      <div className="p-6 text-center">
                        <div className="space-y-4">
                          {/* Month Display */}
                          <div className="space-y-2">
                            <div
                              className={`text-lg font-medium transition-colors duration-300 ${
                                isCurrent ? "text-white" : "text-gray-600 group-hover:text-gray-800"
                              }`}
                            >
                              {formatMonthShort(month)}
                            </div>
                            <div
                              className={`text-2xl font-light transition-colors duration-300 ${
                                isCurrent ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {month.getFullYear()}
                            </div>
                          </div>

                          {/* Current Month Badge */}
                          {isCurrent && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                                Current
                              </Badge>
                            </motion.div>
                          )}

                          {/* Arrow Icon */}
                          <div className="flex items-center justify-center pt-2">
                            <motion.div
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                isCurrent
                                  ? "bg-white/20 backdrop-blur-sm"
                                  : "bg-gray-100 group-hover:bg-gray-200"
                              }`}
                            >
                              <ArrowRight
                                className={`h-4 w-4 transition-colors duration-300 ${
                                  isCurrent ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                                }`}
                              />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
