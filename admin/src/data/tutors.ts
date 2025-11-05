import { TeachingMode } from '@educatedplanet/models';

export const tutors = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    title: "Mathematics Expert",
    photo: "/placeholder-tutor-1.jpg",
    subjects: ["Mathematics", "Physics"],
    teachingModes: ["offline", "online"] as TeachingMode[],
    location: {
      areas: ["Patia", "Old Town"],
      city: "Bhubaneswar"
    },
    experience: "10 years",
    price: {
      min: 500,
      max: 800,
      currency: "INR"
    },
    rating: {
      average: 4.8,
      count: 45
    },
    isVerified: true,
    status: "approved" as const,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z")
  },
  {
    id: "2",
    name: "Priya Sharma",
    title: "Science Tutor",
    photo: "/placeholder-tutor-2.jpg",
    subjects: ["Chemistry", "Biology"],
    teachingModes: ["offline"] as TeachingMode[],
    location: {
      areas: ["Saheed Nagar", "Master Canteen"],
      city: "Bhubaneswar"
    },
    experience: "5 years",
    price: {
      min: 400,
      max: 600,
      currency: "INR"
    },
    rating: {
      average: 4.6,
      count: 32
    },
    isVerified: true,
    status: "approved" as const,
    createdAt: new Date("2024-01-02T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z")
  },
  {
    id: "3",
    name: "Amit Patel",
    title: "Programming Expert",
    photo: "/placeholder-tutor-3.jpg",
    subjects: ["Computer Science", "Mathematics"],
    teachingModes: ["online"] as TeachingMode[],
    location: {
      areas: ["Patia", "Nayapalli"],
      city: "Bhubaneswar"
    },
    experience: "7 years",
    price: {
      min: 600,
      max: 1000,
      currency: "INR"
    },
    rating: {
      average: 4.9,
      count: 28
    },
    isVerified: true,
    status: "pending" as const,
    createdAt: new Date("2024-01-03T00:00:00Z"),
    updatedAt: new Date("2024-01-03T00:00:00Z")
  }
];

export const reviews = [
  {
    id: "1",
    tutorId: "1",
    userId: "2",
    studentName: "Student One",
    rating: 5,
    comment: "Excellent teaching method! Very patient and clear explanations.",
    isApproved: true,
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z")
  },
  {
    id: "2",
    tutorId: "1",
    userId: "3",
    studentName: "Student Two",
    rating: 4,
    comment: "Good tutor, helped me improve my grades significantly.",
    isApproved: true,
    createdAt: new Date("2024-01-20T14:15:00Z"),
    updatedAt: new Date("2024-01-20T14:15:00Z")
  },
  {
    id: "3",
    tutorId: "2",
    userId: "1",
    studentName: "Student Three",
    rating: 5,
    comment: "Very knowledgeable and friendly. Highly recommended!",
    isApproved: true,
    createdAt: new Date("2024-02-01T09:45:00Z"),
    updatedAt: new Date("2024-02-01T09:45:00Z")
  }
];