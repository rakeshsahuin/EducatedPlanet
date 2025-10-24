import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Monitor } from "lucide-react";

interface TutorCardProps {
  id: string;
  name: string;
  title: string;
  subjects: string[];
  rating: number;
  teachingMode: "Online" | "Offline" | "Both";
  location: string;
  image: string;
}

const TutorCard = ({
  id,
  name,
  title,
  subjects,
  rating,
  teachingMode,
  location,
  image,
}: TutorCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Link to={`/tutors/${id}`}>
    <Card 
      className="group hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 overflow-hidden cursor-pointer"
    >
      {/* Profile Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={`${name} - ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-4">
        {/* Name and Title */}
        <div className="mb-3">
          <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1 mb-3">
          {subjects.map((subject, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
              {subject}
            </Badge>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="ml-2 text-xs font-medium text-foreground">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Teaching Mode */}
        <div className="flex items-center gap-1 mb-2">
          <Monitor className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{teachingMode}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">{location}</span>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default TutorCard;
