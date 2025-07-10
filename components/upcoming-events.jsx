"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react"
import pocketbase from "@/lib/pocketbase"
import { createSlug } from "@/lib/search-utils"

export function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingEvents()
  }, [])

  const fetchUpcomingEvents = async () => {
    try {
      // Get upcoming accepted events
      const today = new Date().toISOString().split("T")[0]
      const filter = `status = "accepted" && event_start_date >= "${today}"`
      const result = await pocketbase.searchEvents(filter, 1, 4)
      if (result.success) {
        setEvents(result.events.items)
      }
    } catch (error) {
      console.error("Failed to fetch upcoming events:", error)
    }
    setLoading(false)
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

  const getThumbnailUrl = (event) => {
    if (event.thumbnail) {
      return `https://conference-alert.pockethost.io/api/files/events/${event.id}/${event.thumbnail}`
    }
    return null
  }

  const generateEventSlug = (event) => {
    return `${createSlug(event.event_name)}-${event.id}`
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden"
        >
          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0  bg-white" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-20 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-xl"
        />

        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-light text-gray-900 mb-4">
              Upcoming Events &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                Conferences
              </span>
            </h3>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Discover the latest academic events happening soon
            </p>
          </motion.div>
          <LoadingSkeleton />
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-white" />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-20 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        className="absolute bottom-20 left-10 w-32 h-32 bg-purple-200/15 rounded-full blur-xl"
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-light text-gray-900 mb-4">
            Upcoming Events &{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
              Conferences
            </span>
          </h3>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Discover the latest academic events happening soon
          </p>
        </motion.div>

        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 p-12 max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h4 className="text-xl font-medium text-gray-900 mb-3">No upcoming events</h4>
              <p className="text-gray-600 font-light">Check back soon for new events!</p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <AnimatePresence>
                {events.map((event, index) => {
                  const thumbnailUrl = getThumbnailUrl(event)
                  const eventSlug = generateEventSlug(event)
                  const gradientClass = getEventTypeColor(event.event_type)

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
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden hover:bg-white/80 hover:border-white/50 transition-all duration-500 hover:shadow-2xl h-full shadow-xl">
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
                              <Badge className={`bg-neutral-950 text-white border-0 shadow-lg`}>
                                {event.event_type}
                              </Badge>
                            </div>
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
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                  <MapPin className="h-4 w-4 text-purple-600" />
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
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium bg-neutral-900 bg-clip-text text-transparent">
                                  View Details
                                </span>
                                <motion.div
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center"
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

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <Link href="/search/all">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="px-8 py-4 bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    View All Events
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
