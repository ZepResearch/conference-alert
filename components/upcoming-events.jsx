"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react"
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

      const result = await pocketbase.searchEvents(filter, 1, 6)

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
      Conference: "bg-blue-100 text-blue-800",
      Seminar: "bg-green-100 text-green-800",
      Workshop: "bg-purple-100 text-purple-800",
      Webinar: "bg-orange-100 text-orange-800",
      "Continuing professional development event": "bg-red-100 text-red-800",
      "Online conference": "bg-indigo-100 text-indigo-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold text-gray-900">Upcoming Events & Conferences</h3>
            <p className="mt-4 text-lg text-gray-600">Discover the latest academic events happening soon</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-gray-900">Upcoming Events & Conferences</h3>
          <p className="mt-4 text-lg text-gray-600">Discover the latest academic events happening soon</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h4>
            <p className="text-gray-600">Check back soon for new events!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {events.map((event) => {
                const thumbnailUrl = getThumbnailUrl(event)
                const eventSlug = generateEventSlug(event)

                return (
                  <Link key={event.id} href={`/event/${eventSlug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      {/* Thumbnail or Info Card */}
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl || "/placeholder.svg"}
                            alt={event.event_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white p-4">
                            <div className="text-center">
                              <Calendar className="h-8 w-8 mx-auto mb-2" />
                              <h4 className="font-semibold text-sm mb-1">{event.event_type}</h4>
                              <p className="text-xs opacity-90">{event.event_category}</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className={getEventTypeColor(event.event_type)}>{event.event_type}</Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {event.event_name}
                        </CardTitle>
                        <CardDescription className="text-sm">{event.event_category}</CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {event.event_topic && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Topic:</span> {event.event_topic}
                            </div>
                          )}

                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {event.city && event.country
                                ? `${event.city}, ${event.country}`
                                : event.country || "Location TBA"}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>
                              {formatDate(event.event_start_date)}
                              {event.event_end_date && event.event_end_date !== event.event_start_date && (
                                <span> - {formatDate(event.event_end_date)}</span>
                              )}
                            </span>
                          </div>

                          {event.abstract_deadline && (
                            <div className="flex items-center text-sm text-orange-600">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>Deadline: {formatDate(event.abstract_deadline)}</span>
                            </div>
                          )}

                          {event.organizing_society && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{event.organizing_society}</span>
                            </div>
                          )}

                          {event.short_description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {event.short_description.replace(/<[^>]*>/g, "").substring(0, 100)}...
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-600 font-medium group-hover:text-blue-800">
                              View Details
                            </span>
                            <ArrowRight className="h-4 w-4 text-blue-600 group-hover:text-blue-800 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {/* View More Button */}
            <div className="text-center">
              <Link href="/search/all">
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  View All Events
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
