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
//# sourceMappingURL=index.js.map