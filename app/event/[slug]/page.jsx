"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Mail,
  ArrowLeft,
  Share2,
  Globe,
  Building,
  User,
  Tag,
} from "lucide-react"
import pocketbase from "@/lib/pocketbase"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.slug) {
      fetchEventDetails()
    }
  }, [params.slug])

  const fetchEventDetails = async () => {
    try {
      const result = await pocketbase.getEventBySlug(params.slug)

      if (result.success) {
        setEvent(result.event)
      } else {
        setError("Event not found")
      }
    } catch (err) {
      setError("Failed to load event details")
      console.error("Event detail error:", err)
    }
    setLoading(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "TBA"
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateShort = (dateString) => {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.event_name,
          text: `Check out this event: ${event.event_name}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-2" />
                <Link href="/" className="text-2xl font-bold text-gray-900">
                  Conference Alert
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const thumbnailUrl = getThumbnailUrl(event)

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card>
              <CardContent className="p-0">
                {thumbnailUrl && (
                  <div className="h-64 overflow-hidden rounded-t-lg">
                    <img
                      src={thumbnailUrl || "/placeholder.svg"}
                      alt={event.event_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getEventTypeColor(event.event_type)}>{event.event_type}</Badge>
                        <Badge variant="outline">{event.event_category}</Badge>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.event_name}</h1>
                      {event.event_topic && (
                        <p className="text-lg text-gray-600 mb-4">
                          <Tag className="h-4 w-4 inline mr-2" />
                          {event.event_topic}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Event Date</p>
                        <p className="text-sm">
                          {formatDateShort(event.event_start_date)}
                          {event.event_end_date && event.event_end_date !== event.event_start_date && (
                            <span> - {formatDateShort(event.event_end_date)}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm">
                          {event.city && event.country
                            ? `${event.city}, ${event.country}`
                            : event.country || "Location TBA"}
                        </p>
                      </div>
                    </div>

                    {event.abstract_deadline && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-3 text-orange-600" />
                        <div>
                          <p className="font-medium">Abstract Deadline</p>
                          <p className="text-sm">{formatDateShort(event.abstract_deadline)}</p>
                        </div>
                      </div>
                    )}

                    {event.organizing_society && (
                      <div className="flex items-center text-gray-600">
                        <Building className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <p className="font-medium">Organizer</p>
                          <p className="text-sm">{event.organizing_society}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {event.website_address && (
                      <a href={event.website_address} target="_blank" rel="noopener noreferrer">
                        <Button>
                          <Globe className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      </a>
                    )}
                    {event.enquiries_email && (
                      <a href={`mailto:${event.enquiries_email}`}>
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Organizer
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {event.short_description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.short_description }} />
                </CardContent>
              </Card>
            )}

            {/* Keywords */}
            {event.event_keywords && event.event_keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.event_keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Event Type</h4>
                  <p className="text-sm text-gray-600">{event.event_type}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                  <p className="text-sm text-gray-600">{event.event_category}</p>
                </div>

                {event.state_or_province && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">State/Province</h4>
                      <p className="text-sm text-gray-600">{event.state_or_province}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Event Dates</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Start:</strong> {formatDate(event.event_start_date)}
                  </p>
                  {event.event_end_date && event.event_end_date !== event.event_start_date && (
                    <p className="text-sm text-gray-600">
                      <strong>End:</strong> {formatDate(event.event_end_date)}
                    </p>
                  )}
                </div>

                {event.abstract_deadline && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Important Deadline</h4>
                      <p className="text-sm text-orange-600 font-medium">
                        Abstract Submission: {formatDate(event.abstract_deadline)}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.contact_person && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Contact Person
                    </h4>
                    <p className="text-sm text-gray-600">{event.contact_person}</p>
                  </div>
                )}

                {event.enquiries_email && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </h4>
                    <a href={`mailto:${event.enquiries_email}`} className="text-sm text-blue-600 hover:text-blue-800">
                      {event.enquiries_email}
                    </a>
                  </div>
                )}

                {event.website_address && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </h4>
                    <a
                      href={event.website_address}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Visit Event Website
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Events */}
            <Card>
              <CardHeader>
                <CardTitle>Find Similar Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href={`/search/all/category/${event.event_category.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      More {event.event_category} Events
                    </Button>
                  </Link>
                  {event.country && (
                    <Link href={`/search/${event.country.toLowerCase().replace(/\s+/g, "-")}`}>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        More Events in {event.country}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
