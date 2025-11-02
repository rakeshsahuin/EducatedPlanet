"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Video, Users, BookOpen, Award, Clock } from "lucide-react"

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "components">("overview")

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Verified Tutors",
      description: "All tutors are background-checked and verified"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Local Learning",
      description: "Find tutors in your neighborhood"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Online & Offline",
      description: "Choose learning mode that suits you"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Quality Assurance",
      description: "4.8★ average rating from students"
    }
  ]

  const components = [
    {
      name: "Header",
      description: "Sticky navigation with logo, menu, and login",
      file: "components/header/header.tsx"
    },
    {
      name: "Logo",
      description: "Clickable logo with tagline",
      file: "components/header/logo.tsx"
    },
    {
      name: "Navigation",
      description: "Responsive navigation with active states",
      file: "components/header/navigation.tsx"
    },
    {
      name: "Mobile Menu",
      description: "Slide-out drawer for mobile navigation",
      file: "components/header/mobile-menu.tsx"
    },
    {
      name: "Login Modal",
      description: "OTP-based authentication modal",
      file: "components/auth/login-modal.tsx"
    }
  ]

  const demoTutors = [
    {
      name: "Dr. Priya Sharma",
      subject: "Mathematics",
      rating: 4.9,
      reviews: 127,
      location: "Patia, Bhubaneswar",
      mode: "online" as const,
      price: "₹500/hr",
      experience: "8 years"
    },
    {
      name: "Prof. Rajesh Kumar",
      subject: "Physics",
      rating: 4.8,
      reviews: 89,
      location: "Old Town, Bhubaneswar",
      mode: "offline" as const,
      price: "₹600/hr",
      experience: "12 years"
    },
    {
      name: "Meera Patel",
      subject: "English",
      rating: 4.7,
      reviews: 203,
      location: "Saheed Nagar, Bhubaneswar",
      mode: "both" as const,
      price: "₹400/hr",
      experience: "6 years"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              EducatedPlanet Header
              <span className="text-primary block">Component Demo</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Beautiful, professional header with responsive design, OTP authentication, and Nature theme styling
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Next.js 14+
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                TypeScript
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Shadcn/UI
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Nature Theme
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 p-1 bg-muted rounded-lg">
              {["overview", "features", "components"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab as any)}
                  className="capitalize"
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Responsive Design</h4>
                        <p className="text-sm text-muted-foreground">Mobile-first approach with adaptive layouts</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">OTP Authentication</h4>
                        <p className="text-sm text-muted-foreground">Secure login with mobile verification</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Professional Design</h4>
                        <p className="text-sm text-muted-foreground">Nature theme with education-focused aesthetics</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Accessibility</h4>
                        <p className="text-sm text-muted-foreground">WCAG 2.1 AA compliant with keyboard navigation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Try the header features:
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Click Login button (top right)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Video className="h-4 w-4 mr-2" />
                        Resize browser to see responsive design
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MapPin className="h-4 w-4 mr-2" />
                        Try mobile menu (hamburger icon)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Test navigation active states
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "components" && (
            <div className="max-w-6xl mx-auto">
              <div className="space-y-6">
                {components.map((component, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{component.name}</span>
                        <Badge variant="outline">{component.file}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{component.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Demo Tutors Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Demo Tutor Cards
            </h2>
            <p className="text-muted-foreground">
              See how the header looks with content below
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {demoTutors.map((tutor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{tutor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{tutor.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{tutor.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tutor.reviews} reviews</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{tutor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Video className="h-4 w-4" />
                    <span>{tutor.mode === 'both' ? 'Online & Offline' : tutor.mode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{tutor.experience} experience</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{tutor.price}</span>
                    <Button size="sm">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">EducatedPlanet Header Demo</h3>
            <p className="text-muted-foreground mb-4">
              Professional header component for education platforms
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                View Documentation
              </Button>
              <Button variant="outline" size="sm">
                GitHub Repository
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}