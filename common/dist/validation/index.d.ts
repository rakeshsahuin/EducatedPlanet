import { z } from 'zod';
export declare const phoneSchema: z.ZodString;
export declare const emailSchema: z.ZodOptional<z.ZodString>;
export declare const nameSchema: z.ZodString;
export declare const passwordSchema: z.ZodOptional<z.ZodString>;
export declare const subjectSchema: z.ZodString;
export declare const areaSchema: z.ZodString;
export declare const descriptionSchema: z.ZodString;
export declare const ratingSchema: z.ZodNumber;
export declare const loginSchema: z.ZodObject<{
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    email?: string | undefined;
}, {
    phone: string;
    email?: string | undefined;
}>;
export declare const tutorBasicInfoSchema: z.ZodObject<{
    name: z.ZodString;
    title: z.ZodString;
    shortDescription: z.ZodString;
    longDescription: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    title: string;
    shortDescription: string;
    longDescription: string;
}, {
    name: string;
    title: string;
    shortDescription: string;
    longDescription: string;
}>;
export declare const tutorTeachingSchema: z.ZodObject<{
    subjects: z.ZodArray<z.ZodString, "many">;
    classes: z.ZodArray<z.ZodString, "many">;
    teachingModes: z.ZodArray<z.ZodEnum<["online", "offline", "both"]>, "many">;
    availability: z.ZodObject<{
        weekdays: z.ZodBoolean;
        weekends: z.ZodBoolean;
        timings: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        weekdays: boolean;
        weekends: boolean;
        timings?: string | undefined;
    }, {
        weekdays: boolean;
        weekends: boolean;
        timings?: string | undefined;
    }>;
    academicType: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    subjects: string[];
    classes: string[];
    teachingModes: ("online" | "offline" | "both")[];
    availability: {
        weekdays: boolean;
        weekends: boolean;
        timings?: string | undefined;
    };
    academicType: boolean;
}, {
    subjects: string[];
    classes: string[];
    teachingModes: ("online" | "offline" | "both")[];
    availability: {
        weekdays: boolean;
        weekends: boolean;
        timings?: string | undefined;
    };
    academicType: boolean;
}>;
export declare const tutorLocationSchema: z.ZodObject<{
    areas: z.ZodArray<z.ZodString, "many">;
    city: z.ZodString;
    state: z.ZodString;
}, "strip", z.ZodTypeAny, {
    areas: string[];
    city: string;
    state: string;
}, {
    areas: string[];
    city: string;
    state: string;
}>;
export declare const reviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rating: number;
    comment: string;
}, {
    rating: number;
    comment: string;
}>;
export declare const classCodeSchema: z.ZodString;
export declare const classNameSchema: z.ZodString;
export declare const classCategorySchema: z.ZodEnum<["school", "college", "professional", "competitive", "skill_development", "sports", "entertainment", "art", "health"]>;
export declare const classMetadataSchema: z.ZodEffects<z.ZodObject<{
    minAge: z.ZodOptional<z.ZodNumber>;
    maxAge: z.ZodOptional<z.ZodNumber>;
    duration: z.ZodOptional<z.ZodString>;
    subjects: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prerequisites: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    subjects?: string[] | undefined;
    minAge?: number | undefined;
    maxAge?: number | undefined;
    duration?: string | undefined;
    prerequisites?: string[] | undefined;
}, {
    subjects?: string[] | undefined;
    minAge?: number | undefined;
    maxAge?: number | undefined;
    duration?: string | undefined;
    prerequisites?: string[] | undefined;
}>, {
    subjects?: string[] | undefined;
    minAge?: number | undefined;
    maxAge?: number | undefined;
    duration?: string | undefined;
    prerequisites?: string[] | undefined;
}, {
    subjects?: string[] | undefined;
    minAge?: number | undefined;
    maxAge?: number | undefined;
    duration?: string | undefined;
    prerequisites?: string[] | undefined;
}>;
export declare const createClassSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    category: z.ZodEnum<["school", "college", "professional", "competitive", "skill_development", "sports", "entertainment", "art", "health"]>;
    subClasses: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    description: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        minAge: z.ZodOptional<z.ZodNumber>;
        maxAge: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodString>;
        subjects: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prerequisites: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    }, {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    }>, {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    }, {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    category: "school" | "college" | "professional" | "competitive" | "skill_development" | "sports" | "entertainment" | "art" | "health";
    subClasses?: string[] | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
    metadata?: {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    } | undefined;
}, {
    code: string;
    name: string;
    category: "school" | "college" | "professional" | "competitive" | "skill_development" | "sports" | "entertainment" | "art" | "health";
    subClasses?: string[] | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
    metadata?: {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    } | undefined;
}>;
export declare const updateClassSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["school", "college", "professional", "competitive", "skill_development", "sports", "entertainment", "art", "health"]>>;
    subClasses: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    description: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        minAge: z.ZodOptional<z.ZodNumber>;
        maxAge: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodString>;
        subjects: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prerequisites: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    }, {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    }>, {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    }, {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    category?: "school" | "college" | "professional" | "competitive" | "skill_development" | "sports" | "entertainment" | "art" | "health" | undefined;
    subClasses?: string[] | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
    metadata?: {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    } | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    category?: "school" | "college" | "professional" | "competitive" | "skill_development" | "sports" | "entertainment" | "art" | "health" | undefined;
    subClasses?: string[] | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
    metadata?: {
        subjects?: string[] | undefined;
        minAge?: number | undefined;
        maxAge?: number | undefined;
        duration?: string | undefined;
        prerequisites?: string[] | undefined;
    } | undefined;
}>;
export declare const classSearchParamsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["school", "college", "professional", "competitive", "skill_development", "sports", "entertainment", "art", "health"]>>;
    hasSubClasses: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    subClass: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodEnum<["name", "sortOrder", "createdAt"]>>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    category?: "school" | "college" | "professional" | "competitive" | "skill_development" | "sports" | "entertainment" | "art" | "health" | undefined;
    isActive?: boolean | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    query?: string | undefined;
    hasSubClasses?: boolean | undefined;
    subClass?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: "name" | "sortOrder" | "createdAt" | undefined;
}, {
    category?: "school" | "college" | "professional" | "competitive" | "skill_development" | "sports" | "entertainment" | "art" | "health" | undefined;
    isActive?: boolean | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    query?: string | undefined;
    hasSubClasses?: boolean | undefined;
    subClass?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: "name" | "sortOrder" | "createdAt" | undefined;
}>;
export declare const addSubClassSchema: z.ZodObject<{
    subClassCode: z.ZodString;
    subClassName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    subClassCode: string;
    subClassName: string;
}, {
    subClassCode: string;
    subClassName: string;
}>;
export declare const removeSubClassSchema: z.ZodObject<{
    subClassCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    subClassCode: string;
}, {
    subClassCode: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TutorBasicInfoInput = z.infer<typeof tutorBasicInfoSchema>;
export type TutorTeachingInput = z.infer<typeof tutorTeachingSchema>;
export type TutorLocationInput = z.infer<typeof tutorLocationSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type ClassSearchParamsInput = z.infer<typeof classSearchParamsSchema>;
export type AddSubClassInput = z.infer<typeof addSubClassSchema>;
export type RemoveSubClassInput = z.infer<typeof removeSubClassSchema>;
//# sourceMappingURL=index.d.ts.map