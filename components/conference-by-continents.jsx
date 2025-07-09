"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, ArrowRight, MapPin, ExternalLink } from "lucide-react"
import {
  getContinentsList,
  getContinentInfo,
  getCountriesByContinent,
  popularCountriesByContinent,
} from "@/lib/continents-data"
import { createSlug } from "@/lib/search-utils"

export function ConferenceByContinents() {
  const [selectedContinent, setSelectedContinent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const continents = getContinentsList()

  const handleCountryClick = (country) => {
    const countrySlug = createSlug(country)
    return `/search/${countrySlug}`
  }

  const handleContinentClick = (continent) => {
    setSelectedContinent(continent)
    setSearchTerm("")
    setIsDialogOpen(true)
  }

  const getColorClasses = (color, variant = "card") => {
    const colorMap = {
      blue: {
        card: "border-blue-200 hover:border-blue-300 hover:bg-blue-50",
        badge: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        button: "bg-blue-600 hover:bg-blue-700",
        icon: "text-blue-600",
      },
      green: {
        card: "border-green-200 hover:border-green-300 hover:bg-green-50",
        badge: "bg-green-100 text-green-800 hover:bg-green-200",
        button: "bg-green-600 hover:bg-green-700",
        icon: "text-green-600",
      },
      red: {
        card: "border-red-200 hover:border-red-300 hover:bg-red-50",
        badge: "bg-red-100 text-red-800 hover:bg-red-200",
        button: "bg-red-600 hover:bg-red-700",
        icon: "text-red-600",
      },
      orange: {
        card: "border-orange-200 hover:border-orange-300 hover:bg-orange-50",
        badge: "bg-orange-100 text-orange-800 hover:bg-orange-200",
        button: "bg-orange-600 hover:bg-orange-700",
        icon: "text-orange-600",
      },
      purple: {
        card: "border-purple-200 hover:border-purple-300 hover:bg-purple-50",
        badge: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        button: "bg-purple-600 hover:bg-purple-700",
        icon: "text-purple-600",
      },
      teal: {
        card: "border-teal-200 hover:border-teal-300 hover:bg-teal-50",
        badge: "bg-teal-100 text-teal-800 hover:bg-teal-200",
        button: "bg-teal-600 hover:bg-teal-700",
        icon: "text-teal-600",
      },
    }
    return colorMap[color]?.[variant] || colorMap.blue[variant]
  }

  const filteredCountries = selectedContinent
    ? getCountriesByContinent(selectedContinent).filter((country) =>
        country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-gray-900">Conference By Continents</h3>
          <p className="mt-4 text-lg text-gray-600">
            Explore conferences across all continents and countries worldwide
          </p>
        </div>

        {/* Continents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {continents.map((continent) => {
            const continentInfo = getContinentInfo(continent)
            const popularCountries = popularCountriesByContinent[continent] || []
            const totalCountries = getCountriesByContinent(continent).length

            return (
              <Card
                key={continent}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${getColorClasses(continentInfo.color, "card")}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">
                    <span className="text-4xl">{continentInfo.icon}</span>
                  </div>
                  <CardTitle className="text-xl">{continent}</CardTitle>
                  <p className="text-sm text-gray-600">{totalCountries} countries</p>
                </CardHeader>
                <CardContent>
                  {/* Popular Countries Preview */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-medium text-sm text-gray-700">Popular Countries:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {popularCountries.map((country) => (
                        <Link key={country} href={handleCountryClick(country)}>
                          <Badge
                            variant="outline"
                            className={`w-full justify-start py-2 cursor-pointer transition-colors ${getColorClasses(continentInfo.color, "badge")}`}
                          >
                            <MapPin className="h-3 w-3 mr-2" />
                            {country}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* View All Countries Button */}
                  <Dialog open={isDialogOpen && selectedContinent === continent} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className={`w-full ${getColorClasses(continentInfo.color, "button")}`}
                        onClick={() => handleContinentClick(continent)}
                      >
                        View All {continent} Countries
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <span className="text-2xl">{continentInfo.icon}</span>
                          {continent} Countries
                        </DialogTitle>
                        <DialogDescription>
                          Click on any country to find conferences and events in that location
                        </DialogDescription>
                      </DialogHeader>

                      {/* Search Bar */}
                      <div className="mb-4">
                        <div className="relative">
                          <Input
                            placeholder={`Search countries in ${continent}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Countries List */}
                      <ScrollArea className="h-96">
                        {filteredCountries.length === 0 ? (
                          <div className="text-center py-8">
                            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No countries found</h4>
                            <p className="text-gray-600">Try adjusting your search term</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredCountries.map((country) => (
                              <Link
                                key={country}
                                href={handleCountryClick(country)}
                                onClick={() => setIsDialogOpen(false)}
                              >
                                <div className="group p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                                      <span className="font-medium text-sm group-hover:text-blue-700 transition-colors">
                                        {country}
                                      </span>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </ScrollArea>

                      {/* Stats */}
                      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                          {filteredCountries.length} of {totalCountries} countries
                          {searchTerm && ` matching "${searchTerm}"`}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Access Section */}
        {/* <div className="bg-white rounded-lg p-8 shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Quick Access to Popular Countries</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { country: "United States", flag: "🇺🇸" },
              { country: "United Kingdom", flag: "🇬🇧" },
              { country: "Germany", flag: "🇩🇪" },
              { country: "Australia", flag: "🇦🇺" },
              { country: "Canada", flag: "🇨🇦" },
              { country: "Japan", flag: "🇯🇵" },
              { country: "France", flag: "🇫🇷" },
              { country: "Singapore", flag: "🇸🇬" },
              { country: "India", flag: "🇮🇳" },
              { country: "China", flag: "🇨🇳" },
              { country: "Brazil", flag: "🇧🇷" },
              { country: "South Africa", flag: "🇿🇦" },
            ].map(({ country, flag }) => (
              <Link key={country} href={handleCountryClick(country)}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{flag}</div>
                    <h5 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{country}</h5>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div> */}

        {/* Global Stats */}
        {/* <div className="mt-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {continents.map((continent) => {
              const continentInfo = getContinentInfo(continent)
              const countryCount = getCountriesByContinent(continent).length

              return (
                <div key={continent} className="text-center">
                  <div className={`text-2xl font-bold ${getColorClasses(continentInfo.color, "icon")}`}>
                    {countryCount}
                  </div>
                  <div className="text-sm text-gray-600">{continent}</div>
                </div>
              )
            })}
          </div>
        </div> */}
      </div>
    </section>
  )
}
