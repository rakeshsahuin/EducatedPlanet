// Validation schemas using Zod
import { z } from 'zod';
export const phoneSchema = z.string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
    .length(10, 'Phone number must be exactly 10 digits');
export const emailSchema = z.string()
    .email('Invalid email address')
    .optional();
export const nameSchema = z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');
export const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .optional();
export const subjectSchema = z.string()
    .min(2, 'Subject must be at least 2 characters')
    .max(50, 'Subject must be less than 50 characters');
export const areaSchema = z.string()
    .min(2, 'Area must be at least 2 characters')
    .max(50, 'Area must be less than 50 characters');
export const descriptionSchema = z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters');
export const ratingSchema = z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5');
// Combined schemas
export const loginSchema = z.object({
    phone: phoneSchema,
    email: emailSchema
});
export const tutorBasicInfoSchema = z.object({
    name: nameSchema,
    title: z.string().min(5, 'Title must be at least 5 characters').max(100),
    shortDescription: z.string().min(10, 'Short description required').max(200),
    longDescription: descriptionSchema
});
export const tutorTeachingSchema = z.object({
    subjects: z.array(subjectSchema).min(1, 'At least one subject required'),
    classes: z.array(z.string()).min(1, 'At least one class level required'),
    teachingModes: z.array(z.enum(['online', 'offline', 'both'])).min(1, 'At least one teaching mode required'),
    availability: z.object({
        weekdays: z.boolean(),
        weekends: z.boolean(),
        timings: z.string().optional()
    }),
    academicType: z.boolean()
});
export const tutorLocationSchema = z.object({
    areas: z.array(areaSchema).min(1, 'At least one area required'),
    city: z.string().min(2, 'City required'),
    state: z.string().min(2, 'State required')
});
export const reviewSchema = z.object({
    rating: ratingSchema,
    comment: z.string().min(5, 'Comment must be at least 5 characters').max(500)
});
// Class validation schemas
export const classCodeSchema = z.string()
    .min(2, 'Class code must be at least 2 characters')
    .max(20, 'Class code must be less than 20 characters')
    .regex(/^[A-Z0-9-_]+$/, 'Class code can only contain uppercase letters, numbers, hyphens, and underscores');
export const classNameSchema = z.string()
    .min(2, 'Class name must be at least 2 characters')
    .max(100, 'Class name must be less than 100 characters');
export const classCategorySchema = z.enum([
    'school',
    'college',
    'professional',
    'competitive',
    'skill_development',
    'sports',
    'entertainment',
    'art',
    'health'
], {
    errorMap: () => ({ message: 'Please select a valid category' })
});
export const classMetadataSchema = z.object({
    minAge: z.number().int().positive().min(1).max(100).optional(),
    maxAge: z.number().int().positive().min(1).max(100).optional(),
    duration: z.string().min(1).max(50).optional(),
    subjects: z.array(z.string().min(1).max(50)).optional(),
    prerequisites: z.array(z.string().min(1).max(50)).optional()
}).refine((data) => {
    if (data.minAge && data.maxAge && data.minAge > data.maxAge) {
        return false;
    }
    return true;
}, {
    message: 'Minimum age cannot be greater than maximum age',
    path: ['minAge']
});
export const createClassSchema = z.object({
    name: classNameSchema,
    code: classCodeSchema,
    category: classCategorySchema,
    subClasses: z.array(classCodeSchema).optional(),
    description: z.string().min(10).max(500).optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    metadata: classMetadataSchema.optional()
});
export const updateClassSchema = z.object({
    name: classNameSchema.optional(),
    code: classCodeSchema.optional(),
    category: classCategorySchema.optional(),
    subClasses: z.array(classCodeSchema).optional(),
    description: z.string().min(10).max(500).optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    metadata: classMetadataSchema.optional()
});
export const classSearchParamsSchema = z.object({
    query: z.string().optional(),
    category: classCategorySchema.optional(),
    hasSubClasses: z.boolean().optional(),
    isActive: z.boolean().optional(),
    subClass: z.string().optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(100).optional(),
    sortBy: z.enum(['name', 'sortOrder', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
});
export const addSubClassSchema = z.object({
    subClassCode: classCodeSchema,
    subClassName: classNameSchema
});
export const removeSubClassSchema = z.object({
    subClassCode: classCodeSchema
});
//# sourceMappingURL=index.js.map