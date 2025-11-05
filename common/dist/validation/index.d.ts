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
export type LoginInput = z.infer<typeof loginSchema>;
export type TutorBasicInfoInput = z.infer<typeof tutorBasicInfoSchema>;
export type TutorTeachingInput = z.infer<typeof tutorTeachingSchema>;
export type TutorLocationInput = z.infer<typeof tutorLocationSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
//# sourceMappingURL=index.d.ts.map