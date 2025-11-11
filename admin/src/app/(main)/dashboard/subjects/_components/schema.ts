import z from "zod";
import { SubjectMetadata } from "@educatedplanet/models";

// Schema for subject table data
export const subjectTableSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  classIds: z.array(z.string()),
  description: z.string(),
  keywords: z.array(z.string()),
  isActive: z.boolean(),
  isAcademic: z.boolean(),
  sortOrder: z.number(),
  metadata: z.object({
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    duration: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
    topics: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    careerPaths: z.array(z.string()).optional(),
    examPreparation: z.array(z.string()).optional(),
    minAge: z.number().optional(),
    maxAge: z.number().optional(),
    popular: z.boolean().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SubjectTable = z.infer<typeof subjectTableSchema>;

// Schema for creating/editing subject
export const subjectFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(20, "Code must be less than 20 characters")
    .regex(/^[A-Z0-9-_]+$/, "Code can only contain uppercase letters, numbers, hyphens, and underscores")
    .transform(val => val.toUpperCase())
    .optional(),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  keywords: z.array(z.string().max(50, "Keyword must be less than 50 characters")).optional(),
  isActive: z.boolean().default(true),
  isAcademic: z.boolean().default(true),
  sortOrder: z.number().min(0, "Sort order must be non-negative").default(0),
  classIds: z.array(z.string()).optional(),
  metadata: z.object({
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    duration: z.string().max(50, "Duration must be less than 50 characters").optional(),
    prerequisites: z.array(z.string().max(50, "Prerequisite must be less than 50 characters")).optional(),
    topics: z.array(z.string().max(50, "Topic must be less than 50 characters")).optional(),
    skills: z.array(z.string().max(50, "Skill must be less than 50 characters")).optional(),
    careerPaths: z.array(z.string().max(50, "Career path must be less than 50 characters")).optional(),
    examPreparation: z.array(z.string().max(50, "Exam must be less than 50 characters")).optional(),
    minAge: z.number().int().min(1).max(100).optional(),
    maxAge: z.number().int().min(1).max(100).optional(),
    popular: z.boolean().optional(),
    icon: z.string().max(10, "Icon must be less than 10 characters").optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color").optional(),
  }).optional(),
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

export type SubjectForm = z.infer<typeof subjectFormSchema>;

// Schema for search filters
export const subjectSearchSchema = z.object({
  search: z.string().optional(),
  isAcademic: z.boolean().optional(),
  isActive: z.boolean().optional(),
  classId: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  popular: z.boolean().optional(),
  sortBy: z.enum(["name", "sortOrder", "createdAt", "popular"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type SubjectSearch = z.infer<typeof subjectSearchSchema>;

// Schema for keyword operations
export const keywordSchema = z.object({
  keyword: z.string().min(1, "Keyword is required").max(50, "Keyword must be less than 50 characters"),
});

export type KeywordForm = z.infer<typeof keywordSchema>;