"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Settings, LogOut, Users, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import pocketbase from "@/lib/pocketbase"

export default function DashboardPage() {
  const { user, signOut, isAuthenticated, loading, isInitialized } = useAuth()
  const [userEvents, setUserEvents] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  })
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUserEvents()
    }
  }, [user, isAuthenticated])

  const fetchUserEvents = async () => {
    setLoadingEvents(true)
    const result = await pocketbase.getUserEvents(user.id)

    if (result.success) {
      setUserEvents(result.events.items)

      // Calculate stats
      const events = result.events.items
      const stats = {
        total: events.length,
        pending: events.filter((e) => e.status === "pending").length,
        accepted: events.filter((e) => e.status === "accepted").length,
        rejected: events.filter((e) => e.status === "rejected").length,
      }
      setStats(stats)
    }
    setLoadingEvents(false)
  }

  const handleLogout = async () => {
    await signOut()
    // Navigation will be handled by useProtectedRoute
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Show loading while auth is initializing
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Only show redirect message if we're definitely not authenticated
  if (isInitialized && !loading && !isAuthenticated) {
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
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your conference submissions and track their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/dashboard/create-event">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Event
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Browse All Events
            </Button>
          </Link>
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Submissions</CardTitle>
            <CardDescription>Track the status of your conference submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingEvents ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : userEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events submitted yet</h3>
                <p className="text-gray-600 mb-4">Start by submitting your first conference or event</p>
                <Link href="/dashboard/create-event">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{event.event_name}</h3>
                      <Badge className={`${getStatusColor(event.status)} flex items-center gap-1`}>
                        {getStatusIcon(event.status)}
                        {event.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span> {event.event_type}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {event.event_category}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {event.city}, {event.country}
                      </div>
                    </div>
                    {event.event_start_date && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Start Date:</span>{" "}
                        {new Date(event.event_start_date).toLocaleDateString()}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      Submitted on {new Date(event.created).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
