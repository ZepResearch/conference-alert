import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Globe, Users, Search, TrendingUp, Clock } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { UpcomingEvents } from "@/components/upcoming-events"
import { FeaturedEvents } from "@/components/featured-events"
import { ConferenceByTopics } from "@/components/conference-by-topics"
import { ConferenceByContinents } from "@/components/conference-by-continents"
import { ConferenceCalendar } from "@/components/conference-calendar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Conference Alert</h1>
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

      {/* Hero Section with Search */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
              Discover Academic
              <span className="text-blue-600"> Conferences</span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
              Find conferences, seminars, and workshops in your field. Search by country, category, or topic to discover
              relevant events worldwide.
            </p>
          </div>

          {/* Search Bar Component */}
          <SearchBar />
        </div>
      </section>
      {/* Upcoming Events Section */}
      <UpcomingEvents />

      {/* Featured Events Section */}
      <FeaturedEvents />

      {/* Conference By Topics Section */}
      <ConferenceByTopics />
{/* Conference By Continents Section */}
      <ConferenceByContinents/>
   {/* Conference Calendar Section */}
      <ConferenceCalendar />


      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Globe className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Countries Covered</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Calendar className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Events Listed</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold text-gray-900">Why Choose Conference Alert?</h3>
            <p className="mt-4 text-lg text-gray-600">Everything you need to stay updated with academic events</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Search by country, category, topic, or keywords to find exactly what you need
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Global Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Discover conferences from around the world in various academic fields</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Trending Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stay updated with the latest and most popular conferences in your field
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Get the latest information about deadlines, dates, and event details</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of researchers discovering and sharing academic events
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Create Your Account
              </Button>
            </Link>
            <Link href="/search/all">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
              >
                Browse All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Conference Alert. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
