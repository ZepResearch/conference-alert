"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Globe, Building } from "lucide-react"
import { indianCities, globalCities, indianStates, getTopCities } from "@/lib/cities-data"
import { createSlug } from "@/lib/search-utils"

export function FeaturedEvents() {
  const topIndianCities = getTopCities(indianCities, 12)
  const topGlobalCities = getTopCities(globalCities, 12)

  const handleCityClick = (cityName, isGlobal = false) => {
    const slug = createSlug(cityName)
    // Use the search page with city filter
    return `/search/city/${slug}`
  }

  const handleStateClick = (stateName) => {
    const slug = createSlug(stateName)
    return `/search/state/${slug}`
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-gray-900">Featured Events</h3>
          <p className="mt-4 text-lg text-gray-600">Discover conferences by location</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conference by Cities in India */}
          <Card className="h-full">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Conference by Cities in India</CardTitle>
              <p className="text-sm text-gray-600">Explore events in major Indian cities</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {topIndianCities.map((city) => (
                  <Link key={city.name} href={handleCityClick(city.name)}>
                    <Badge
                      variant="outline"
                      className="w-full justify-center py-2 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors text-sm"
                    >
                      {/* <span className="mr-1">{city.icon}</span> */}
                      {city.name}
                    </Badge>
                  </Link>
                ))}
              </div>
              <Link href="/cities/india">
                <Button className="w-full bg-transparent" variant="outline">
                  View All Indian Cities
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Conference by Global Cities */}
          <Card className="h-full">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Conference by Global Cities</CardTitle>
              <p className="text-sm text-gray-600">Find events in cities worldwide</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {topGlobalCities.map((city) => (
                  <Link key={city.name} href={handleCityClick(city.name, true)}>
                    <Badge
                      variant="outline"
                      className="w-full justify-center py-2 hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors text-sm"
                    >
                      {/* <span className="mr-1">{city.icon}</span> */}
                      {city.name}
                    </Badge>
                  </Link>
                ))}
              </div>
              <Link href="/cities/global">
                <Button className="w-full bg-transparent" variant="outline">
                  View All Global Cities
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Conference by States in India */}
          <Card className="h-full">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Conference by States in India</CardTitle>
              <p className="text-sm text-gray-600">Browse events by Indian states</p>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {indianStates.map((state) => (
                    <Link key={state.name} href={handleStateClick(state.name)}>
                      <Badge
                        variant="outline"
                        className="w-full justify-start py-2 hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-colors text-sm"
                      >
                        {/* <span className="mr-2">{state.icon}</span> */}
                        {state.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
