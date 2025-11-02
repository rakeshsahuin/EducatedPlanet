import { FeaturedTutorsSection } from '@/components/featured-tutors'

export default function FeaturedTutorsDemoPage() {
  return (
    <div className="min-h-screen">
      {/* Simple Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            EducatedPlanet - Featured Tutors Demo
          </h1>
        </div>
      </header>

      {/* Featured Tutors Section */}
      <main>
        <FeaturedTutorsSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">
            © 2024 EducatedPlanet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}