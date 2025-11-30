import z from "zod";
import { TutorStatus, TeachingMode, TutorSubject, PhotoData } from "@educatedplanet/models";

// Table display schema
export const tutorTableSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string(),
  status: z.enum(["pending", "approved", "rejected", "suspended"]),
  subjects: z.array(z.string()),
  averageRating: z.number(),
  totalReviews: z.number(),
  isVerified: z.boolean(),
  isFeatured: z.boolean(),
  location: z.object({
    city: z.string(),
    areas: z.array(z.string()),
  }),
  pricing: z.object({
    oneToOne: z.object({
      hourlyRate: z.number(),
    }),
    group: z.object({
      hourlyRate: z.number().optional(),
      maxStudents: z.number().optional(),
    }),
  }),
  profileViews: z.number(),
  connects: z.number(),
  createdAt: z.date(),
  submittedAt: z.date().optional(),
  reviewedAt: z.date().optional(),
});

export type TutorTable = z.infer<typeof tutorTableSchema>;

// Dynamic subject schema
const subjectSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  subjectName: z.string().min(1, "Subject name is required"),
  isAcademic: z.boolean(),
  classIds: z.array(z.string()).optional(),
  classNames: z.array(z.string()).optional(),
  ageFrom: z.number().min(1, "Age from must be at least 1").max(100, "Age from cannot exceed 100").optional(),
  ageTo: z.number().min(1, "Age to must be at least 1").max(100, "Age to cannot exceed 100").optional(),
}).refine(
  (data) => {
    if (data.isAcademic) {
      return data.ageFrom !== undefined && data.ageTo !== undefined && data.ageFrom <= data.ageTo;
    } else {
      return data.classIds && data.classIds.length > 0;
    }
  },
  {
    message: "Academic subjects require valid age range, non-academic require at least one class",
    path: ["validation"],
  }
);

// Form schema for creating/editing tutors
export const tutorFormSchema = z.object({
  userId: z.string().min(1, "User selection is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  gender: z.enum(["male", "female", "other"]).optional(),
  genderCustom: z.string().optional(),
  title: z.string().min(1, "Professional title is required"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  longDescription: z.string().min(50, "Long description must be at least 50 characters"),
  subjects: z.array(subjectSchema).min(1, "At least one subject is required"),
  teachingModes: z.array(z.enum(["online", "offline", "both"])).min(1, "Select at least one teaching mode"),
  location: z.object({
    // New structured address
    address: z.object({
      maplink: z.string().optional(),
      address1: z.string().optional(),
      locality: z.string().min(1, "Locality/Area is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      country: z.string().optional(),
      zip: z.string().optional(),
      digipin: z.string().optional(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    // Availability range
    availabilityRange: z.object({
      value: z.number().min(0.1, "Range must be greater than 0").max(100, "Range cannot exceed 100"),
      unit: z.enum(['km', 'miles']),
    }),
    // Optional legacy fields for backward compatibility
    city: z.string().optional(),
    areas: z.array(z.string()).optional(),
    // Coordinates for geospatial queries
    coordinates: z.object({
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()]),
    }).optional(),
  }),
  pricing: z.object({
    oneToOne: z.object({
      hourlyRate: z.number().min(1, "Hourly rate is required"),
    }),
    group: z.object({
      hourlyRate: z.number().optional(),
      maxStudents: z.number().positive().optional(),
    }),
    online: z.object({
      hourlyRate: z.number().optional(),
    }),
  }),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.number(),
  })).optional(),
  experience: z.array(z.object({
    title: z.string().min(1, "Job title is required").max(150, "Job title cannot exceed 150 characters"),
    institution: z.string().min(1, "Institution is required").max(150, "Institution name cannot exceed 150 characters"),
    yearFrom: z.date({
      required_error: "Start date is required",
    }),
    yearTo: z.date().optional(),
    isPresent: z.boolean(),
    description: z.string().max(5000, "Description cannot exceed 5000 characters").optional(),
  })).refine(
    (experiences) => {
      // Validate each experience entry
      for (const exp of experiences) {
        // If not present, yearTo must be after yearFrom
        if (!exp.isPresent && exp.yearTo && exp.yearFrom) {
          if (exp.yearTo <= exp.yearFrom) {
            return false;
          }
        }
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["experience"],
    }
  ).refine(
    (experiences) => {
      // Check for overlapping dates
      for (let i = 0; i < experiences.length; i++) {
        for (let j = i + 1; j < experiences.length; j++) {
          const exp1 = experiences[i];
          const exp2 = experiences[j];

          const exp1End = exp1.isPresent ? new Date() : exp1.yearTo;
          const exp2End = exp2.isPresent ? new Date() : exp2.yearTo;

          if (exp1End && exp2End) {
            // Check if date ranges overlap
            if (
              (exp1.yearFrom <= exp2End && exp1End >= exp2.yearFrom) ||
              (exp2.yearFrom <= exp1End && exp2End >= exp1.yearFrom)
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    {
      message: "Experience periods cannot overlap",
      path: ["experience"],
    }
  ).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  availability: z.object({
    weekdays: z.boolean(),
    weekends: z.boolean(),
    preferredTimes: z.array(z.string()),
  }),
  gallery: z.array(z.object({
    id: z.string(),
    filename: z.string(),
    url: z.string().url(),
    uploaded: z.string(),
    variants: z.array(z.string()),
    metadata: z.record(z.any()).optional()
  })).max(20, "Maximum 20 images allowed").optional(),
    resumeLink: z.string().url().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    youtube: z.string().url().optional(),
    website: z.string().url().optional(),
    onlineCourses: z.string().url().optional(),
    twitter: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    github: z.string().url().optional(),
  }).optional(),
  bankDetails: z.object({
    accountNumber: z.string().optional(),
    ifsc: z.string().optional(),
    accountName: z.string().optional(),
  }).optional(),
  photo: z.object({
    id: z.string(),
    filename: z.string(),
    url: z.string().url(),
    uploaded: z.string(),
    variants: z.array(z.string()),
    metadata: z.record(z.any()).optional()
  }).optional(),
});

export type TutorForm = z.infer<typeof tutorFormSchema>;

// Search parameters schema
export const tutorSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),
  city: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxPrice: z.number().positive().optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type TutorSearchParams = z.infer<typeof tutorSearchSchema>;