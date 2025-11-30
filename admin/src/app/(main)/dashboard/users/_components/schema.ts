import z from "zod";
export const userTableSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  role: z.enum(["user", "tutor", "sub-admin", "admin"]),
  avatar: z.string().optional(),
  isEmailVerified: z.boolean(),
  isPhoneVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  profile: z.object({
    gender: z.enum(["male", "female", "other"]).optional(),
  }).optional(),
});

export type UserTable = z.infer<typeof userTableSchema>;

// Form schema for creating/editing users (without id, createdAt, updatedAt)
export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  role: z.enum(["user", "tutor", "sub-admin", "admin"]),
  avatar: z.string().optional(),
  isEmailVerified: z.boolean(),
  isPhoneVerified: z.boolean(),
  profile: z.object({
    gender: z.enum(["male", "female", "other"]).optional(),
  }).optional(),
});

export type UserForm = z.infer<typeof userFormSchema>;