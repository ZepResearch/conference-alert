"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, CalendarDays, ArrowRight } from "lucide-react"

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

  const getMonthIcon = (monthIndex) => {
    const icons = {
      0: "❄️", // January
      1: "💝", // February
      2: "🌸", // March
      3: "🌷", // April
      4: "🌺", // May
      5: "☀️", // June
      6: "🏖️", // July
      7: "🌻", // August
      8: "🍂", // September
      9: "🎃", // October
      10: "🦃", // November
      11: "🎄", // December
    }
    return icons[monthIndex] || "📅"
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-gray-900">Conference Calendar</h3>
          <p className="mt-4 text-lg text-gray-600">
            Browse conferences by month - click on any month to see all events
          </p>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigateMonths(-1)} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous Year
          </Button>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">
              {formatMonthYear(currentDate)} -{" "}
              {formatMonthYear(new Date(currentDate.getFullYear(), currentDate.getMonth() + 11, 1))}
            </span>
          </div>

          <Button variant="outline" onClick={() => navigateMonths(12)} className="flex items-center gap-2">
            Next Year
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Month Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
          {displayMonths.map((month, index) => {
            const isCurrent = isCurrentMonth(month)
            const monthIcon = getMonthIcon(month.getMonth())

            return (
              <Link key={`${month.getFullYear()}-${month.getMonth()}`} href={getMonthUrl(month)}>
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    isCurrent
                      ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                      : "hover:border-blue-200 hover:bg-gray-50"
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="space-y-3">
                      {/* <div className="text-3xl">{monthIcon}</div> */}
                      <div className={`text-lg font-medium ${isCurrent ? "text-blue-700" : "text-gray-600"}`}>
                        {formatMonthShort(month)}
                      </div>
                      <div className={`text-lg font-bold ${isCurrent ? "text-blue-800" : "text-gray-900"}`}>
                        {month.getFullYear()}
                      </div>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Current
                        </Badge>
                      )}
                      <div className="flex items-center justify-center">
                        <ArrowRight className={`h-4 w-4 ${isCurrent ? "text-blue-600" : "text-gray-400"}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

       
    
      </div>
    </section>
  )
}
