import z from "zod";

// Define ClassCategory enum locally to avoid import issues
export enum ClassCategory {
  SCHOOL = 'school',
  COLLEGE = 'college',
  PROFESSIONAL = 'professional',
  COMPETITIVE = 'competitive',
  SKILL_DEVELOPMENT = 'skill_development',
  SPORTS = 'sports',
  ENTERTAINMENT = 'entertainment',
  ART = 'art',
  HEALTH = 'health'
}

// Schema for class table data
export const classTableSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  category: z.nativeEnum(ClassCategory),
  subClasses: z.array(z.string()),
  description: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  metadata: z.object({
    minAge: z.number().optional(),
    maxAge: z.number().optional(),
    duration: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    prerequisites: z.array(z.string()).optional(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ClassTable = z.infer<typeof classTableSchema>;

// Schema for creating/editing class
export const classFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(20, "Code must be less than 20 characters")
    .regex(/^[A-Z0-9-_]+$/, "Code can only contain uppercase letters, numbers, hyphens, and underscores")
    .transform(val => val.toUpperCase()),
  category: z.nativeEnum(ClassCategory, {
    errorMap: () => ({ message: "Please select a valid category" })
  }),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0, "Sort order must be non-negative").default(0),
  metadata: z.object({
    minAge: z.number().int().min(1).max(100).optional(),
    maxAge: z.number().int().min(1).max(100).optional(),
    duration: z.string().max(50, "Duration must be less than 50 characters").optional(),
    subjects: z.array(z.string().max(50, "Subject must be less than 50 characters")).optional(),
    prerequisites: z.array(z.string().max(50, "Prerequisite must be less than 50 characters")).optional(),
  }).optional(),
  subClasses: z.array(z.string()).optional(),
}).refine(
  (data) => {
    if (data.metadata?.minAge && data.metadata?.maxAge && data.metadata.minAge > data.metadata.maxAge) {
      return false;
    }
    return true;
  },
  {
    message: "Minimum age cannot be greater than maximum age",
    path: ["metadata", "minAge"]
  }
);

export type ClassForm = z.infer<typeof classFormSchema>;

// Schema for search filters
export const classSearchSchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(ClassCategory).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  hasSubClasses: z.enum(["true", "false"]).optional(),
  subClass: z.string().optional(),
  sortBy: z.enum(["name", "sortOrder", "createdAt"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type ClassSearch = z.infer<typeof classSearchSchema>;

// Schema for sub-class operations
export const subClassSchema = z.object({
  subClassCode: z.string().min(2, "Code must be at least 2 characters")
    .regex(/^[A-Z0-9-_]+$/, "Code can only contain uppercase letters, numbers, hyphens, and underscores")
    .transform(val => val.toUpperCase()),
  subClassName: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
});

export type SubClassForm = z.infer<typeof subClassSchema>;