import { useParams, useNavigate } from "react-router-dom";
import { Mail, MapPin, Phone, Star, Heart, MessageCircle, Calendar, Award, BookOpen, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { allTutors } from "@/data/tutors";
import { useState } from "react";

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const tutor = allTutors.find((t) => t.id === id);

  if (!tutor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Tutor Not Found</h2>
            <p className="text-muted-foreground mb-4">The tutor you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/tutors")}>Back to Tutors</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const ratingDistribution = [
    { stars: 5, count: Math.floor(tutor.reviewCount * 0.7) },
    { stars: 4, count: Math.floor(tutor.reviewCount * 0.2) },
    { stars: 3, count: Math.floor(tutor.reviewCount * 0.07) },
    { stars: 2, count: Math.floor(tutor.reviewCount * 0.02) },
    { stars: 1, count: Math.floor(tutor.reviewCount * 0.01) },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate("/")}>Home</span>
          {" > "}
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate("/tutors")}>Tutors</span>
          {" > "}
          <span className="text-foreground">{tutor.name}</span>
        </div>

        {/* Header Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{tutor.name}</h1>
                    <p className="text-xl text-muted-foreground mb-2">{tutor.title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">{renderStars(tutor.rating)}</div>
                  <span className="font-semibold">{tutor.rating}</span>
                  <span className="text-muted-foreground">({tutor.reviewCount} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{tutor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{tutor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{tutor.availability}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                  <Badge variant="outline">{tutor.teachingMode}</Badge>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Connect with Tutor
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground mb-4">{tutor.description}</p>
                <p className="leading-relaxed">{tutor.detailedDescription}</p>
              </CardContent>
            </Card>

            {/* Teaching Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Teaching Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Subjects & Levels
                    </h3>
                    <div className="space-y-3 ml-7">
                      {tutor.subjectsWithLevels.map((item) => (
                        <div key={item.subject}>
                          <p className="font-medium">{item.subject}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.levels.map((level) => (
                              <Badge key={level} variant="outline" className="text-xs">
                                {level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Category</h3>
                    <Badge>{tutor.category}</Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Teaching Mode</h3>
                    <Badge variant="secondary">{tutor.teachingMode}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Qualifications
                </h2>
                <ul className="space-y-2">
                  {tutor.qualifications.map((qual, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tutor.gallery.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Reviews</h2>
                  <Button variant="outline">Write Review</Button>
                </div>

                {/* Rating Distribution */}
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-bold">{tutor.rating}</div>
                    <div>
                      <div className="flex items-center mb-1">{renderStars(tutor.rating)}</div>
                      <p className="text-sm text-muted-foreground">{tutor.reviewCount} reviews</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-2">
                        <span className="text-sm w-12">{item.stars} star</span>
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${(item.count / tutor.reviewCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {tutor.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.reviewerName}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">98****{tutor.phone.slice(-4)}</p>
                      <p className="text-xs text-muted-foreground">Login to view full number</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-xs text-muted-foreground">Login to view email</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Contact</p>
                      <p className="font-medium">{tutor.preferredContact}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4">Login to View Contact</Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-semibold">{tutor.experience} years</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students Taught</span>
                    <span className="font-semibold">200+</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-semibold">Within 2 hours</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-semibold">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TutorProfile;
