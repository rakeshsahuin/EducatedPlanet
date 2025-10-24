import { useState, useMemo } from "react";
import { Grid3x3, List, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TutorSearchHeader from "@/components/TutorSearchHeader";
import TutorFilters, { FilterState } from "@/components/TutorFilters";
import TutorCard from "@/components/TutorCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allTutors } from "@/data/tutors";

const Tutors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    teachingMode: [],
    location: "",
    minRating: 0,
    experience: "",
  });

  // Filter and sort tutors
  const filteredTutors = useMemo(() => {
    let result = [...allTutors];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tutor) =>
          tutor.name.toLowerCase().includes(query) ||
          tutor.subjects.some((s) => s.toLowerCase().includes(query)) ||
          tutor.location.toLowerCase().includes(query)
      );
    }

    // Subject filter
    if (filters.subjects.length > 0) {
      result = result.filter((tutor) =>
        tutor.subjects.some((s) => filters.subjects.includes(s))
      );
    }

    // Teaching mode filter
    if (filters.teachingMode.length > 0) {
      result = result.filter((tutor) =>
        filters.teachingMode.includes(tutor.teachingMode)
      );
    }

    // Location filter
    if (filters.location) {
      result = result.filter((tutor) => tutor.location === filters.location);
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((tutor) => tutor.rating >= filters.minRating);
    }

    // Experience filter
    if (filters.experience) {
      const [min, max] = filters.experience.split("-").map(Number);
      if (max) {
        result = result.filter(
          (tutor) => tutor.experience >= min && tutor.experience <= max
        );
      } else {
        result = result.filter((tutor) => tutor.experience >= min);
      }
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        result.sort((a, b) => b.experience - a.experience);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <TutorSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultsCount={filteredTutors.length}
      />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-80 flex-shrink-0 hidden lg:block">
              <TutorFilters filters={filters} onFilterChange={setFilters} />
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:flex"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide" : "Show"} Filters
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden md:flex items-center gap-1 border rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tutors Grid/List */}
            {filteredTutors.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredTutors.map((tutor) => (
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
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-2">
                  No tutors found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Load More */}
            {filteredTutors.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  Load More Tutors
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tutors;
