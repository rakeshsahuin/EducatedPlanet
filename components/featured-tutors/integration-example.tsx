// Integration Example: How to use Featured Tutors components on the main landing page

import { FeaturedTutorsSection } from '@/components/featured-tutors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Sparkles } from 'lucide-react'

export function LandingPageWithFeaturedTutors() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Find the Perfect
              <span className="text-green-600 dark:text-green-400"> Tutor </span>
              for Your Learning Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect with experienced tutors in Bhubaneswar. Learn from verified experts in Mathematics, Science, English, and more.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Mathematics, Physics, English..."
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Patia, Old Town, Saheed Nagar..."
                    className="pl-12 h-12 text-lg"
                  />
                </div>
              </div>
              <Button
                size="lg"
                className="w-full md:w-auto px-8 py-3 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                Search Tutors
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <FeaturedTutorsSection
        maxTutors={8}
        title="Meet Our Top-Rated Tutors"
        subtitle="Learn from the best educators in Bhubaneswar with proven track records"
      />

      {/* Additional Sections */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose EducatedPlanet?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make learning personalized, accessible, and effective
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Tutors</h3>
              <p className="text-muted-foreground">All tutors are background-checked and verified for your safety</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-muted-foreground">Find tutors by subject, location, and availability in seconds</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Focus</h3>
              <p className="text-muted-foreground">Connect with tutors in your neighborhood for convenient learning</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}