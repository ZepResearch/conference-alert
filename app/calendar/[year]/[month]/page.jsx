"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Clock, ExternalLink, Search, Filter, ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import pocketbase from "@/lib/pocketbase"
import { createSlug } from "@/lib/search-utils"
import { Navbar } from "@/components/Navbar"

export default function MonthlyCalendarPage() {
  const params = useParams()
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const year = Number.parseInt(params.year)
  const month = Number.parseInt(params.month)
  const currentDate = new Date(year, month - 1, 1)

  useEffect(() => {
    if (year && month) {
      fetchMonthlyEvents()
    }
  }, [year, month, currentPage, selectedType, selectedCategory, searchQuery])

  const fetchMonthlyEvents = async () => {
    setLoading(true)
    setError("")

    try {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0) // Last day of the month
      const startDateStr = startDate.toISOString().split("T")[0]
      const endDateStr = endDate.toISOString().split("T")[0]

      let filter = `status = "accepted" && event_start_date >= "${startDateStr}" && event_start_date <= "${endDateStr}"`

      // Add additional filters
      if (selectedType !== "All Types") {
        filter += ` && event_type = "${selectedType}"`
      }

      if (selectedCategory !== "All Categories") {
        filter += ` && event_category = "${selectedCategory}"`
      }

      if (searchQuery.trim()) {
        filter += ` && (event_name ~ "${searchQuery}" || event_topic ~ "${searchQuery}" || organizing_society ~ "${searchQuery}")`
      }

      const result = await pocketbase.searchEvents(filter, currentPage, 12)

      if (result.success) {
        setEvents(result.events.items)
        setTotalPages(result.events.totalPages)
        setTotalItems(result.events.totalItems)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to fetch events")
      console.error("Monthly calendar error:", err)
    }

    setLoading(false)
  }

  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "TBA"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getEventTypeColor = (type) => {
    const colors = {
      Conference: "from-blue-500 to-blue-600",
      Seminar: "from-emerald-500 to-emerald-600",
      Workshop: "from-purple-500 to-purple-600",
      Webinar: "from-orange-500 to-orange-600",
      "Continuing professional development event": "from-red-500 to-red-600",
      "Online conference": "from-indigo-500 to-indigo-600",
    }
    return colors[type] || "from-gray-500 to-gray-600"
  }

  const generateEventSlug = (event) => {
    return `${createSlug(event.event_name)}-${event.id}`
  }

  const getPreviousMonth = () => {
    const prevMonth = new Date(year, month - 2, 1)
    return `/calendar/${prevMonth.getFullYear()}/${String(prevMonth.getMonth() + 1).padStart(2, "0")}`
  }

  const getNextMonth = () => {
    const nextMonth = new Date(year, month, 1)
    return `/calendar/${nextMonth.getFullYear()}/${String(nextMonth.getMonth() + 1).padStart(2, "0")}`
  }

  const eventCategories = [
    "All Categories",
    "Engineering and Technology",
    "Medical And Health Science",
    "Business and Economics",
    "Education",
    "Social Sciences and Humanities",
    "Sports Science",
    "Physical and life sciences",
    "Agriculture",
    "Mathematics and statistics",
    "Law",
    "Interdisciplinary",
  ]

  // Loading skeleton component
  const EventCardSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden"
    >
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </motion.div>
  )

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
     <Navbar></Navbar>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Navigation and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-3">
              <Link href={getPreviousMonth()}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                </motion.div>
              </Link>
              <Link href={getNextMonth()}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Conferences in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
              {formatMonthYear(currentDate)}
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-light">{loading ? "Loading..." : `${totalItems} events found`}</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white backdrop-blur-sm rounded-3xl border  transition-all duration-500 shadow-xl">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Filter Events</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Search events</label>
                  <Input
                    placeholder="Search by name, topic, or organizer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 border-1 bg-white shadow focus:bg-white transition-all duration-300 rounded-xl text-base placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Event Type</label>
                  <Select onValueChange={setSelectedType} value={selectedType}>
                    <SelectTrigger className="h-12 border-1 shadow w-full bg-white focus:bg-white transition-all duration-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Types">All Types</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Seminar">Seminar</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Webinar">Webinar</SelectItem>
                      <SelectItem value="Online conference">Online Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                    <SelectTrigger className="h-12 border-1 shadow w-full bg-white focus:bg-white transition-all duration-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium opacity-0">Apply</label>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setCurrentPage(1)}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Apply Filters
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 p-12 text-center"
          >
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </motion.div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 p-12 max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h4 className="text-xl font-medium text-gray-900 mb-3">
                No events found for {formatMonthYear(currentDate)}
              </h4>
              <p className="text-gray-600 font-light mb-6">Try adjusting your filters or check other months</p>
              <Link href="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl">
                    Back to Calendar
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
         {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <AnimatePresence>
                {events.map((event, index) => {
                  const eventSlug = generateEventSlug(event)
                  const gradientClass = getEventTypeColor(event.event_type)
                  const thumbnailUrl = event.thumbnail
                    ? `https://conference-alert.pockethost.io/api/files/events/${event.id}/${event.thumbnail}`
                    : null

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group"
                    >
                      <Link href={`/event/${eventSlug}`}>
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden hover:bg-white/80 hover:border-white/50 transition-all duration-500 hover:shadow-2xl h-full">
                          {/* Thumbnail or Info Card */}
                          <div className="relative h-48 overflow-hidden">
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl || "/placeholder.svg"}
                                alt={event.event_name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div
                                className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white p-6 relative overflow-hidden`}
                              >
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="text-center relative z-10">
                                  <Calendar className="h-10 w-10 mx-auto mb-3 opacity-90" />
                                  <h4 className="font-semibold text-base mb-2">{event.event_type}</h4>
                                  <p className="text-sm opacity-80">{event.event_category}</p>
                                </div>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="absolute -top-4 -right-4 w-16 h-16 border border-white/20 rounded-full"
                                />
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <Badge className={`bg-gradient-to-r ${gradientClass} text-white border-0 shadow-lg`}>
                                {event.event_type}
                              </Badge>
                            </div>
                            {event.website_address && (
                              <div className="absolute top-4 right-4">
                                <motion.a
                                  whileHover={{ scale: 1.1 }}
                                  href={event.website_address}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </motion.a>
                              </div>
                            )}
                          </div>

                          <div className="p-6">
                            <div className="mb-4">
                              <h4 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                                {event.event_name}
                              </h4>
                              <p className="text-sm text-gray-600 font-medium">{event.event_category}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                  <MapPin className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="truncate font-medium">
                                  {event.city && event.country
                                    ? `${event.city}, ${event.country}`
                                    : event.country || "Location TBA"}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                  <Calendar className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="font-medium">
                                  {formatDate(event.event_start_date)}
                                  {event.event_end_date && event.event_end_date !== event.event_start_date && (
                                    <span> - {formatDate(event.event_end_date)}</span>
                                  )}
                                </span>
                              </div>
                              {event.abstract_deadline && (
                                <div className="flex items-center text-sm text-orange-600">
                                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                                    <Clock className="h-4 w-4 text-orange-600" />
                                  </div>
                                  <span className="font-medium">
                                    Abstract deadline: {formatDate(event.abstract_deadline)}
                                  </span>
                                </div>
                              )}
                              {event.organizing_society && (
                                <div className="text-sm">
                                  <span className="font-medium text-gray-700">Organizer:</span>{" "}
                                  <span className="text-gray-600">{event.organizing_society}</span>
                                </div>
                              )}
                              {event.short_description && (
                                <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {event.short_description.replace(/<[^>]*>/g, "").substring(0, 120)}...
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  View Details
                                </span>
                                <motion.div
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
                                >
                                  <ArrowRight className="h-4 w-4 text-white" />
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

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex justify-center space-x-2"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                  >
                    Previous
                  </Button>
                </motion.div>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <motion.div key={page} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                            : "bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                        }
                      >
                        {page}
                      </Button>
                    </motion.div>
                  )
                })}

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                  >
                    Next
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
