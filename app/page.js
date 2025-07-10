import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Globe, Users, Search, TrendingUp, Clock } from "lucide-react"
import { UpcomingEvents } from "@/components/upcoming-events"
import { FeaturedEvents } from "@/components/featured-events"
import { ConferenceByTopics } from "@/components/conference-by-topics"
import { ConferenceByContinents } from "@/components/conference-by-continents"
import { ConferenceCalendar } from "@/components/conference-calendar"
import { BlogSection } from "@/components/BLOGS COMPONENTS/blog-section"
import Hero from "@/components/Hero"
import { Navbar } from "@/components/Navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <Navbar/>

      {/* Hero Section with Search */}
      <Hero/>
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
  {/* Blog Section */}
      <BlogSection />



  
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Conference Alert. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
