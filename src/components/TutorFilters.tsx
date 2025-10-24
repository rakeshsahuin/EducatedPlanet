import { useState } from "react";
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { subjects, locations } from "@/data/tutors";

export interface FilterState {
  subjects: string[];
  teachingMode: string[];
  location: string;
  minRating: number;
  experience: string;
}

interface TutorFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const TutorFilters = ({ filters, onFilterChange }: TutorFiltersProps) => {
  const handleSubjectToggle = (subject: string) => {
    const newSubjects = filters.subjects.includes(subject)
      ? filters.subjects.filter((s) => s !== subject)
      : [...filters.subjects, subject];
    onFilterChange({ ...filters, subjects: newSubjects });
  };

  const handleTeachingModeToggle = (mode: string) => {
    const newModes = filters.teachingMode.includes(mode)
      ? filters.teachingMode.filter((m) => m !== mode)
      : [...filters.teachingMode, mode];
    onFilterChange({ ...filters, teachingMode: newModes });
  };

  const handleClearAll = () => {
    onFilterChange({
      subjects: [],
      teachingMode: [],
      location: "",
      minRating: 0,
      experience: "",
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["subjects", "mode", "location", "rating"]} className="w-full">
        {/* Subjects */}
        <AccordionItem value="subjects">
          <AccordionTrigger>Subjects</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={filters.subjects.includes(subject)}
                    onCheckedChange={() => handleSubjectToggle(subject)}
                  />
                  <Label
                    htmlFor={subject}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Teaching Mode */}
        <AccordionItem value="mode">
          <AccordionTrigger>Teaching Mode</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {["Online", "Offline", "Both"].map((mode) => (
                <div key={mode} className="flex items-center space-x-2">
                  <Checkbox
                    id={mode}
                    checked={filters.teachingMode.includes(mode)}
                    onCheckedChange={() => handleTeachingModeToggle(mode)}
                  />
                  <Label
                    htmlFor={mode}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {mode}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location */}
        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.location}
              onValueChange={(value) =>
                onFilterChange({ ...filters, location: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Minimum Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                <div
                  key={rating}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() =>
                    onFilterChange({ ...filters, minRating: rating })
                  }
                >
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.minRating === rating}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-normal cursor-pointer flex items-center gap-1"
                  >
                    {rating}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    & above
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Experience */}
        <AccordionItem value="experience">
          <AccordionTrigger>Experience</AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.experience}
              onValueChange={(value) =>
                onFilterChange({ ...filters, experience: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-3">0-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TutorFilters;
