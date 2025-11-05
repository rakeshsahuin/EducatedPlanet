import z from "zod";
export const userTableSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  role: z.enum(["user", "tutor", "admin"]),
  avatar: z.string().optional(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserTable = z.infer<typeof userTableSchema>;