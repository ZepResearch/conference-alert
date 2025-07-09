"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Clock, ExternalLink, Search, Filter, ArrowLeft } from "lucide-react"
import pocketbase from "@/lib/pocketbase"
import { parseSlug, buildSearchFilter } from "@/lib/search-utils"

export default function CitySearchPage() {
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
  const [sortBy, setSortBy] = useState("date")

  const cityName = params.slug ? parseSlug(params.slug) : ""

  useEffect(() => {
    if (cityName) {
      fetchEvents()
    }
  }, [cityName, currentPage, selectedType, sortBy])

  const fetchEvents = async () => {
    setLoading(true)
    setError("")

    try {
      // Build filter for city search
      let filter = buildSearchFilter("", cityName, "city")

      // Add additional filters
      if (selectedType !== "All Types") {
        filter += ` && event_type = "${selectedType}"`
      }

      if (searchQuery.trim()) {
        filter += ` && (event_name ~ "${searchQuery}" || event_topic ~ "${searchQuery}" || organizing_society ~ "${searchQuery}")`
      }

      console.log("City search filter:", filter)

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
      console.error("City search error:", err)
    }

    setLoading(false)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchEvents()
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-2" />
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Conference Alert
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb and Title */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conferences in {cityName}</h1>
          <p className="text-gray-600">{loading ? "Loading..." : `${totalItems} events found`}</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Refine Your Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search in results</label>
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Event Type</label>
                <Select onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Event Date</SelectItem>
                    <SelectItem value="created">Recently Added</SelectItem>
                    <SelectItem value="deadline">Abstract Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium opacity-0">Search</label>
                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found in {cityName}</h3>
              <p className="text-gray-600 mb-4">Try browsing events in other cities or check back later</p>
              <Link href="/">
                <Button>Back to Search</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getEventTypeColor(event.event_type)}>{event.event_type}</Badge>
                      {event.website_address && (
                        <a
                          href={event.website_address}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight">{event.event_name}</CardTitle>
                    <CardDescription>{event.event_category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {event.event_topic && (
                        <div className="text-sm">
                          <span className="font-medium">Topic:</span> {event.event_topic}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.city && event.country
                          ? `${event.city}, ${event.country}`
                          : event.country || "Location TBA"}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.event_start_date)}
                        {event.event_end_date && event.event_end_date !== event.event_start_date && (
                          <span> - {formatDate(event.event_end_date)}</span>
                        )}
                      </div>

                      {event.abstract_deadline && (
                        <div className="flex items-center text-sm text-orange-600">
                          <Clock className="h-4 w-4 mr-2" />
                          Abstract deadline: {formatDate(event.abstract_deadline)}
                        </div>
                      )}

                      {event.organizing_society && (
                        <div className="text-sm">
                          <span className="font-medium">Organizer:</span> {event.organizing_society}
                        </div>
                      )}

                      {event.short_description && (
                        <div className="text-sm text-gray-600 line-clamp-3">
                          {event.short_description.replace(/<[^>]*>/g, "").substring(0, 150)}...
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      {event.website_address ? (
                        <a href={event.website_address} target="_blank" rel="noopener noreferrer">
                          <Button size="sm">
                            View Details
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </a>
                      ) : (
                        <Button size="sm" disabled>
                          No Website
                        </Button>
                      )}

                      {event.enquiries_email && (
                        <a
                          href={`mailto:${event.enquiries_email}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Contact
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
