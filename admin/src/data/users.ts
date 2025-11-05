import { UserRole } from '@educatedplanet/models';

export const users = [
  {
    id: "1",
    name: "Arham Khan",
    email: "hello@arhamkhnz.com",
    phone: "+91-9876543210",
    role: "admin" as UserRole,
    avatar: "/avatars/arhamkhnz.png",
    isVerified: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z")
  },
  {
    id: "2",
    name: "Ammar Khan",
    email: "hello@ammarkhnz.com",
    phone: "+91-9876543211",
    role: "admin" as UserRole,
    avatar: "",
    isVerified: true,
    createdAt: new Date("2024-01-02T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z")
  },
];

export const rootUser = users[0];
