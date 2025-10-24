import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TutorCard from "./TutorCard";
import { allTutors } from "@/data/tutors";

const FeaturedTutors = () => {
  // Show only first 8 tutors
  const featuredTutors = allTutors.slice(0, 8);
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top Rated Tutors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with highly qualified tutors in your area
          </p>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredTutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              id={tutor.id}
              name={tutor.name}
              title={tutor.title}
              subjects={tutor.subjects}
              rating={tutor.rating}
              teachingMode={tutor.teachingMode}
              location={tutor.location}
              image={tutor.image}
            />
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center">
          <Link to="/tutors">
            <Button size="lg" variant="outline" className="font-semibold">
              Show More Tutors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTutors;
