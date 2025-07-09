"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import pocketbase from "@/lib/pocketbase"
import { useToast } from "@/hooks/use-toast"
import { getTopicsByCategory } from "@/lib/topics-data"
import { getCountriesWithStates, getStatesByCountry, getCitiesByCountryAndState } from "@/lib/location-data"

const eventTypes = [
  "Conference",
  "Seminar",
  "Workshop",
  "Webinar",
  "Continuing professional development event",
  "Online conference",
]

const eventCategories = [
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

const popularCountries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
  "China",
  "Brazil",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Singapore",
  "South Korea",
  "Mexico",
  "Argentina",
  "South Africa",
  "New Zealand",
]

export default function CreateEventPage() {
  const { user, isAuthenticated, loading, isInitialized } = useAuth()
  const [formData, setFormData] = useState({
    event_name: "",
    event_type: "",
    event_category: "",
    event_topic: "",
    country: "",
    state_or_province: "",
    city: "",
    organizing_society: "",
    contact_person: "",
    enquiries_email: "",
    website_address: "",
    event_start_date: "",
    event_end_date: "",
    abstract_deadline: "",
    short_description: "",
    event_keywords: [],
    thumbnail: null, // Add this line
  })
  const [availableTopics, setAvailableTopics] = useState([])
  const [availableStates, setAvailableStates] = useState([])
  const [availableCities, setAvailableCities] = useState([])
  const [showAllCountries, setShowAllCountries] = useState(false)
  const [keywords, setKeywords] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [thumbnailFile, setThumbnailFile] = useState(null)

  useEffect(() => {
    // Only redirect if not loading and definitely not authenticated
    if (!loading && !isAuthenticated && isInitialized) {
      console.log("Redirecting to login from create-event page")
      router.push("/login")
    }
  }, [isAuthenticated, loading, isInitialized, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
    }
  }

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      event_category: category,
      event_topic: "", // Reset topic when category changes
    }))

    // Get topics for selected category
    const topics = getTopicsByCategory(category)
    setAvailableTopics(topics)
  }

  const handleCountryChange = (country) => {
    setFormData((prev) => ({
      ...prev,
      country: country,
      state_or_province: "", // Reset state when country changes
      city: "", // Reset city when country changes
    }))

    // Get states for selected country
    const states = getStatesByCountry(country)
    setAvailableStates(states)
    setAvailableCities([]) // Clear cities when country changes
  }

  const handleStateChange = (state) => {
    setFormData((prev) => ({
      ...prev,
      state_or_province: state,
      city: "", // Reset city when state changes
    }))

    // Get cities for selected country and state
    const cities = getCitiesByCountryAndState(formData.country, state)
    setAvailableCities(cities)
  }

  // Get all countries (including those with and without state data)
  const allCountries = [
    ...getCountriesWithStates(),
    ...popularCountries.filter((country) => !getCountriesWithStates().includes(country)),
  ].sort()

  const displayedCountries = showAllCountries ? allCountries : popularCountries

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    // Basic validation
    if (!formData.event_name || !formData.event_type || !formData.event_category) {
      setError("Please fill in the required fields: Event Name, Type, and Category")
      setSubmitting(false)
      return
    }

    // Check authentication before proceeding
    if (!user || !isAuthenticated) {
      setError("You must be logged in to submit an event. Please refresh the page and try again.")
      setSubmitting(false)
      return
    }

    try {
      // Process keywords
      const keywordArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)

      const eventData = {
        ...formData,
        event_keywords: keywordArray,
        thumbnail: thumbnailFile, // Add this line
        // Ensure dates are in proper format or empty string
        event_start_date: formData.event_start_date ? new Date(formData.event_start_date).toISOString() : "",
        event_end_date: formData.event_end_date ? new Date(formData.event_end_date).toISOString() : "",
        abstract_deadline: formData.abstract_deadline ? new Date(formData.abstract_deadline).toISOString() : "",
      }

      console.log("Submitting event data:", eventData)
      console.log("Current user:", user)
      console.log("Is authenticated:", isAuthenticated)

      const result = await pocketbase.createEvent(eventData)

      if (result.success) {
        toast({
          title: "Event submitted successfully",
          description: "Your event has been submitted for review.",
        })
        router.push("/dashboard")
      } else {
        console.error("Event creation failed:", result.error)
        setError(result.error)

        // If it's an auth error, suggest re-login
        if (result.error.includes("not authenticated")) {
          setError("Your session has expired. Please log out and log back in.")
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setError("An unexpected error occurred. Please try again.")
    }

    setSubmitting(false)
  }

  // Show loading only while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Only show redirect message if we're definitely not authenticated
  if (isInitialized && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Conference Alert</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Event</CardTitle>
            <CardDescription>Fill out the form below to submit your conference or event for review</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_name">Event Name *</Label>
                    <Input
                      id="event_name"
                      name="event_name"
                      value={formData.event_name}
                      onChange={handleChange}
                      placeholder="Enter event name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event_type">Event Type *</Label>
                    <Select onValueChange={(value) => handleSelectChange("event_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_category">Event Category *</Label>
                    <Select onValueChange={handleCategoryChange} value={formData.event_category}>
                      <SelectTrigger className={'w-full'}>
                        <SelectValue placeholder="Select event category" />
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

                  <div className="space-y-2">
                    <Label htmlFor="event_topic">Event Topic</Label>
                    {availableTopics.length > 0 ? (
                      <Select
                        onValueChange={(value) => handleSelectChange("event_topic", value)}
                        value={formData.event_topic}
                      >
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select event topic" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="none">Select a topic (optional)</SelectItem>
                          {availableTopics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="event_topic"
                        name="event_topic"
                        value={formData.event_topic}
                        onChange={handleChange}
                        placeholder={
                          formData.event_category ? "First select a category to see topics" : "Enter event topic"
                        }
                        disabled={!formData.event_category}
                      />
                    )}
                    {formData.event_category && availableTopics.length > 0 && (
                      <p className="text-sm text-gray-600">
                        {availableTopics.length} topics available for {formData.event_category}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location Information</h3>

                <div className="space-y-4 md:grid grid-cols-3 gap-2">
                  {/* Country Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select onValueChange={handleCountryChange} value={formData.country}>
                      <SelectTrigger className={'w-full'}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="none">Select a country</SelectItem>
                        {displayedCountries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                        {!showAllCountries && (
                          <div className="p-2 border-t">
                            <button
                              type="button"
                              onClick={() => setShowAllCountries(true)}
                              className="text-sm text-blue-600 hover:text-blue-800 w-full text-left"
                            >
                              Show all countries...
                            </button>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State/Province Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="state_or_province">State/Province</Label>
                    {availableStates.length > 0 ? (
                      <Select onValueChange={handleStateChange} value={formData.state_or_province}>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select state/province" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="none">Select a state/province</SelectItem>
                          {availableStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="state_or_province"
                        name="state_or_province"
                        value={formData.state_or_province}
                        onChange={handleChange}
                        placeholder={formData.country ? "Enter state or province" : "First select a country"}
                        disabled={!formData.country}
                      />
                    )}
                    {formData.country && availableStates.length > 0 && (
                      <p className="text-sm text-gray-600">
                        {availableStates.length} states/provinces available for {formData.country}
                      </p>
                    )}
                  </div>

                  {/* City Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    {availableCities.length > 0 ? (
                      <Select onValueChange={(value) => handleSelectChange("city", value)} value={formData.city}>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="none">Select a city</SelectItem>
                          {availableCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={
                          formData.country && formData.state_or_province
                            ? "Enter city name"
                            : formData.country
                              ? "Select a state first or enter city name"
                              : "First select a country"
                        }
                        disabled={!formData.country}
                      />
                    )}
                    {formData.state_or_province && availableCities.length > 0 && (
                      <p className="text-sm text-gray-600">
                        {availableCities.length} cities available for {formData.state_or_province}, {formData.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Organization Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizing_society">Organizing Society</Label>
                    <Input
                      id="organizing_society"
                      name="organizing_society"
                      value={formData.organizing_society}
                      onChange={handleChange}
                      placeholder="Enter organizing society"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                      placeholder="Enter contact person"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="enquiries_email">Enquiries Email</Label>
                    <Input
                      id="enquiries_email"
                      name="enquiries_email"
                      type="email"
                      value={formData.enquiries_email}
                      onChange={handleChange}
                      placeholder="Enter enquiries email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website_address">Website Address</Label>
                    <Input
                      id="website_address"
                      name="website_address"
                      type="url"
                      value={formData.website_address}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Important Dates</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_start_date">Event Start Date</Label>
                    <Input
                      id="event_start_date"
                      name="event_start_date"
                      type="date"
                      value={formData.event_start_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event_end_date">Event End Date</Label>
                    <Input
                      id="event_end_date"
                      name="event_end_date"
                      type="date"
                      value={formData.event_end_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abstract_deadline">Abstract Deadline</Label>
                    <Input
                      id="abstract_deadline"
                      name="abstract_deadline"
                      type="date"
                      value={formData.abstract_deadline}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    placeholder="Enter a brief description of the event"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Event Keywords</Label>
                  <Input
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords separated by commas (e.g., AI, Machine Learning, Data Science)"
                  />
                  <p className="text-sm text-gray-600">Separate multiple keywords with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Event Thumbnail (Optional)</Label>
                  <Input id="thumbnail" type="file" accept="image/*" onChange={handleFileChange} />
                  <p className="text-sm text-gray-600">Upload an image to represent your event (JPG, PNG, GIF)</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
