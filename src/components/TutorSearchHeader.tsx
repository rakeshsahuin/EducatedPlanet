import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface TutorSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultsCount: number;
}

const TutorSearchHeader = ({
  searchQuery,
  onSearchChange,
  resultsCount,
}: TutorSearchHeaderProps) => {
  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Search Tutors</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search Bar */}
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by subject, name, or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>Search</Button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          {resultsCount} {resultsCount === 1 ? "tutor" : "tutors"} found
        </p>
      </div>
    </div>
  );
};

export default TutorSearchHeader;
