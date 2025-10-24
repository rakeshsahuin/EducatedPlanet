import tutorPriya from "@/assets/tutor-priya.jpg";
import tutorRajesh from "@/assets/tutor-rajesh.jpg";
import tutorAnjali from "@/assets/tutor-anjali.jpg";
import tutorVikram from "@/assets/tutor-vikram.jpg";
import tutorMeera from "@/assets/tutor-meera.jpg";
import tutorArjun from "@/assets/tutor-arjun.jpg";
import { extendedTutors } from "./tutors-extended";

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  date: string;
  text: string;
}

export interface Tutor {
  id: string;
  name: string;
  title: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  teachingMode: "Online" | "Offline" | "Both";
  location: string;
  image: string;
  experience: number; // in years
  description: string;
  detailedDescription: string;
  qualifications: string[];
  subjectsWithLevels: { subject: string; levels: string[] }[];
  category: "Academic" | "Non-Academic";
  availability: string;
  phone: string;
  email: string;
  preferredContact: "Phone" | "Email" | "Both";
  gallery: string[];
  reviews: Review[];
}

export const allTutors: Tutor[] = [
  {
    id: "1",
    name: "Priya Sharma",
    title: "Mathematics Expert",
    subjects: ["Math", "Statistics", "Algebra"],
    rating: 4.9,
    reviewCount: 87,
    teachingMode: "Both",
    location: "Patia, Bhubaneswar",
    image: tutorPriya,
    experience: 8,
    description: "Specialized in competitive exam preparation",
    detailedDescription: "I am a passionate mathematics educator with 8 years of experience in teaching students from grades 6-12 and competitive exam aspirants. My teaching methodology focuses on building strong fundamentals and problem-solving skills. I have successfully mentored over 200 students for JEE, board exams, and olympiads.",
    qualifications: ["M.Sc. Mathematics from KIIT University", "B.Ed. from Utkal University", "Certified Math Olympiad Trainer"],
    subjectsWithLevels: [
      { subject: "Math", levels: ["Class 6-10", "Class 11-12", "IIT-JEE", "Board Exams"] },
      { subject: "Statistics", levels: ["Class 11-12", "Undergraduate"] },
      { subject: "Algebra", levels: ["Class 8-12", "Competitive Exams"] }
    ],
    category: "Academic",
    availability: "Mon-Sat: 4 PM - 9 PM",
    phone: "9876543210",
    email: "priya.sharma@email.com",
    preferredContact: "Both",
    gallery: [tutorPriya, tutorPriya, tutorPriya],
    reviews: [
      { id: "r1", reviewerName: "Amit K.", rating: 5, date: "2024-01-15", text: "Excellent teacher! My daughter improved her math scores significantly." },
      { id: "r2", reviewerName: "Sneha M.", rating: 5, date: "2024-01-10", text: "Very patient and explains concepts clearly. Highly recommended!" },
      { id: "r3", reviewerName: "Rahul P.", rating: 4, date: "2023-12-20", text: "Good teaching style, helped me crack JEE Advanced." }
    ]
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    title: "Science Teacher",
    subjects: ["Physics", "Chemistry"],
    rating: 4.8,
    reviewCount: 64,
    teachingMode: "Online",
    location: "Chandrasekharpur, Bhubaneswar",
    image: tutorRajesh,
    experience: 10,
    description: "IIT graduate with passion for teaching",
    detailedDescription: "An IIT Kharagpur alumnus with a decade of teaching experience. I specialize in making Physics and Chemistry concepts easy to understand through real-world examples and interactive sessions. My students have consistently scored above 90% in board exams.",
    qualifications: ["B.Tech from IIT Kharagpur", "M.Sc. Physics", "GATE AIR 45"],
    subjectsWithLevels: [
      { subject: "Physics", levels: ["Class 9-12", "IIT-JEE", "NEET"] },
      { subject: "Chemistry", levels: ["Class 9-12", "IIT-JEE", "NEET"] }
    ],
    category: "Academic",
    availability: "Mon-Sun: 5 PM - 10 PM",
    phone: "9845672310",
    email: "rajesh.kumar@email.com",
    preferredContact: "Phone",
    gallery: [tutorRajesh, tutorRajesh],
    reviews: [
      { id: "r4", reviewerName: "Priya D.", rating: 5, date: "2024-01-12", text: "Best physics teacher! Cleared all my doubts patiently." },
      { id: "r5", reviewerName: "Karthik S.", rating: 4, date: "2023-12-28", text: "Great explanations and study materials provided." }
    ]
  },
  {
    id: "3",
    name: "Anjali Patel",
    title: "English Language Specialist",
    subjects: ["English", "Grammar", "Literature"],
    rating: 4.9,
    reviewCount: 92,
    teachingMode: "Both",
    location: "Jaydev Vihar, Bhubaneswar",
    image: tutorAnjali,
    experience: 7,
    description: "IELTS and TOEFL expert",
    detailedDescription: "Certified IELTS and TOEFL instructor with 7 years of experience. I help students achieve their dream scores through personalized training and comprehensive study plans. Over 150 students have successfully cleared their exams with 7+ band scores.",
    qualifications: ["MA English Literature", "CELTA Certified", "IELTS Band 8.5"],
    subjectsWithLevels: [
      { subject: "English", levels: ["Class 6-12", "IELTS", "TOEFL", "Spoken English"] },
      { subject: "Grammar", levels: ["All Levels"] },
      { subject: "Literature", levels: ["Class 11-12", "Undergraduate"] }
    ],
    category: "Academic",
    availability: "Tue-Sun: 3 PM - 8 PM",
    phone: "9823456789",
    email: "anjali.patel@email.com",
    preferredContact: "Email",
    gallery: [tutorAnjali, tutorAnjali, tutorAnjali],
    reviews: [
      { id: "r6", reviewerName: "Deepak R.", rating: 5, date: "2024-01-08", text: "Helped me score 8 in IELTS! Excellent teaching methods." },
      { id: "r7", reviewerName: "Meera S.", rating: 5, date: "2023-12-15", text: "Very professional and punctual. Highly skilled teacher." }
    ]
  },
  {
    id: "4",
    name: "Vikram Singh",
    title: "Computer Science Tutor",
    subjects: ["Coding", "Python", "Web Development"],
    rating: 4.7,
    reviewCount: 58,
    teachingMode: "Online",
    location: "Saheed Nagar, Bhubaneswar",
    image: tutorVikram,
    experience: 6,
    description: "Full-stack developer and coding instructor",
    detailedDescription: "Working software engineer at a top tech company with passion for teaching programming. I make coding fun and accessible for beginners while also preparing students for competitive programming and placements. Hands-on project-based learning approach.",
    qualifications: ["B.Tech CSE from NIT Rourkela", "AWS Certified Developer", "Google Code Jam Finalist"],
    subjectsWithLevels: [
      { subject: "Python", levels: ["Beginner", "Intermediate", "Advanced"] },
      { subject: "Web Development", levels: ["HTML/CSS", "JavaScript", "React", "Node.js"] },
      { subject: "Coding", levels: ["Data Structures", "Algorithms", "Competitive Programming"] }
    ],
    category: "Non-Academic",
    availability: "Mon-Fri: 7 PM - 10 PM, Weekends: Flexible",
    phone: "9834567821",
    email: "vikram.singh@email.com",
    preferredContact: "Email",
    gallery: [tutorVikram, tutorVikram],
    reviews: [
      { id: "r8", reviewerName: "Aditya M.", rating: 5, date: "2024-01-05", text: "Learned Python and built my first web app! Great mentor." },
      { id: "r9", reviewerName: "Neha K.", rating: 4, date: "2023-12-22", text: "Very knowledgeable and explains complex topics simply." }
    ]
  },
  {
    id: "5",
    name: "Meera Reddy",
    title: "Biology Expert",
    subjects: ["Biology", "Zoology", "Botany"],
    rating: 4.8,
    reviewCount: 71,
    teachingMode: "Offline",
    location: "Khandagiri, Bhubaneswar",
    image: tutorMeera,
    experience: 12,
    description: "Medical entrance exam specialist",
    detailedDescription: "With 12 years of experience in coaching NEET aspirants, I have helped over 300 students secure seats in top medical colleges. My teaching focuses on conceptual clarity, extensive practice, and exam strategies. I provide regular tests and personalized feedback.",
    qualifications: ["M.Sc. Zoology", "Ph.D. in Botany", "NEET Coaching Certification"],
    subjectsWithLevels: [
      { subject: "Biology", levels: ["Class 9-12", "NEET", "AIIMS"] },
      { subject: "Zoology", levels: ["Class 11-12", "Competitive Exams"] },
      { subject: "Botany", levels: ["Class 11-12", "Competitive Exams"] }
    ],
    category: "Academic",
    availability: "Mon-Sat: 6 AM - 12 PM, 4 PM - 7 PM",
    phone: "9812345678",
    email: "meera.reddy@email.com",
    preferredContact: "Phone",
    gallery: [tutorMeera, tutorMeera, tutorMeera],
    reviews: [
      { id: "r10", reviewerName: "Ravi K.", rating: 5, date: "2024-01-03", text: "Got into AIIMS thanks to Meera ma'am! Best biology teacher." },
      { id: "r11", reviewerName: "Divya P.", rating: 5, date: "2023-12-18", text: "Clear concepts and excellent study materials provided." }
    ]
  },
  {
    id: "6",
    name: "Arjun Mishra",
    title: "Social Studies Teacher",
    subjects: ["History", "Geography", "Civics"],
    rating: 4.9,
    reviewCount: 79,
    teachingMode: "Both",
    location: "Nayapalli, Bhubaneswar",
    image: tutorArjun,
    experience: 9,
    description: "Making social studies interesting and fun",
    detailedDescription: "I bring history and geography alive through storytelling and interactive learning. With 9 years of teaching experience, I help students develop critical thinking and analytical skills. My students consistently score 95+ in board exams.",
    qualifications: ["MA History", "B.Ed.", "UGC NET Qualified"],
    subjectsWithLevels: [
      { subject: "History", levels: ["Class 6-12", "Competitive Exams"] },
      { subject: "Geography", levels: ["Class 6-12"] },
      { subject: "Civics", levels: ["Class 6-10"] }
    ],
    category: "Academic",
    availability: "Mon-Sat: 3 PM - 8 PM",
    phone: "9867894523",
    email: "arjun.mishra@email.com",
    preferredContact: "Both",
    gallery: [tutorArjun, tutorArjun],
    reviews: [
      { id: "r12", reviewerName: "Sanjay T.", rating: 5, date: "2023-12-30", text: "Made history so interesting! Never thought I'd love the subject." },
      { id: "r13", reviewerName: "Anita R.", rating: 5, date: "2023-12-12", text: "Excellent teacher with great teaching methodology." }
    ]
  },
  {
    id: "7",
    name: "Kavya Nair",
    title: "Music Instructor",
    subjects: ["Music", "Vocal", "Keyboard"],
    rating: 4.9,
    reviewCount: 103,
    teachingMode: "Both",
    location: "Patia, Bhubaneswar",
    image: tutorPriya,
    experience: 11,
    description: "Classical and contemporary music teacher",
    ...extendedTutors[0]
  },
  {
    id: "8",
    name: "Sanjay Gupta",
    title: "Mathematics Tutor",
    subjects: ["Math", "Calculus", "Trigonometry"],
    rating: 4.6,
    reviewCount: 45,
    teachingMode: "Online",
    location: "Bapuji Nagar, Bhubaneswar",
    image: tutorRajesh,
    experience: 5,
    description: "Simplified approach to complex problems",
    ...extendedTutors[1]
  },
  {
    id: "9",
    name: "Deepika Das",
    title: "Art Teacher",
    subjects: ["Art", "Drawing", "Painting"],
    rating: 4.8,
    reviewCount: 67,
    teachingMode: "Offline",
    location: "Chandrasekharpur, Bhubaneswar",
    image: tutorAnjali,
    experience: 8,
    description: "Encouraging creativity in young minds",
    ...extendedTutors[2]
  },
  {
    id: "10",
    name: "Rahul Verma",
    title: "Chemistry Expert",
    subjects: ["Chemistry", "Organic Chemistry"],
    rating: 4.7,
    reviewCount: 54,
    teachingMode: "Both",
    location: "Jaydev Vihar, Bhubaneswar",
    image: tutorVikram,
    experience: 7,
    description: "Making chemistry easy and fun",
    ...extendedTutors[3]
  },
  {
    id: "11",
    name: "Sneha Rao",
    title: "Dance Instructor",
    subjects: ["Dance", "Classical Dance", "Contemporary"],
    rating: 4.9,
    reviewCount: 88,
    teachingMode: "Offline",
    location: "Saheed Nagar, Bhubaneswar",
    image: tutorMeera,
    experience: 10,
    description: "Award-winning dancer and choreographer",
    ...extendedTutors[4]
  },
  {
    id: "12",
    name: "Aditya Joshi",
    title: "Physics Teacher",
    subjects: ["Physics", "Mechanics", "Optics"],
    rating: 4.8,
    reviewCount: 76,
    teachingMode: "Online",
    location: "Khandagiri, Bhubaneswar",
    image: tutorArjun,
    experience: 9,
    description: "Conceptual physics made simple",
    ...extendedTutors[5]
  },
  {
    id: "13",
    name: "Pooja Iyer",
    title: "English Tutor",
    subjects: ["English", "Creative Writing", "Grammar"],
    rating: 4.7,
    reviewCount: 61,
    teachingMode: "Both",
    location: "Nayapalli, Bhubaneswar",
    image: tutorPriya,
    experience: 6,
    description: "Developing strong communication skills",
    ...extendedTutors[6]
  },
  {
    id: "14",
    name: "Karthik Menon",
    title: "Coding Instructor",
    subjects: ["Coding", "Java", "C++"],
    rating: 4.8,
    reviewCount: 82,
    teachingMode: "Online",
    location: "Patia, Bhubaneswar",
    image: tutorRajesh,
    experience: 8,
    description: "Programming fundamentals to advanced concepts",
    ...extendedTutors[7]
  },
  {
    id: "15",
    name: "Divya Kapoor",
    title: "Biology Teacher",
    subjects: ["Biology", "Genetics", "Ecology"],
    rating: 4.9,
    reviewCount: 95,
    teachingMode: "Both",
    location: "Chandrasekharpur, Bhubaneswar",
    image: tutorAnjali,
    experience: 11,
    description: "NEET preparation specialist",
    ...extendedTutors[8]
  },
  {
    id: "16",
    name: "Nikhil Pandey",
    title: "Math & Science Tutor",
    subjects: ["Math", "Science", "Physics"],
    rating: 4.6,
    reviewCount: 48,
    teachingMode: "Offline",
    location: "Jaydev Vihar, Bhubaneswar",
    image: tutorVikram,
    experience: 5,
    description: "Patient and student-friendly approach",
    ...extendedTutors[9]
  },
  {
    id: "17",
    name: "Lakshmi Pillai",
    title: "Music Teacher",
    subjects: ["Music", "Flute", "Tabla"],
    rating: 4.8,
    reviewCount: 73,
    teachingMode: "Both",
    location: "Saheed Nagar, Bhubaneswar",
    image: tutorMeera,
    experience: 13,
    description: "Traditional Indian music expert",
    ...extendedTutors[10]
  },
  {
    id: "18",
    name: "Rohit Saxena",
    title: "Social Studies Expert",
    subjects: ["History", "Political Science", "Economics"],
    rating: 4.7,
    reviewCount: 59,
    teachingMode: "Online",
    location: "Khandagiri, Bhubaneswar",
    image: tutorArjun,
    experience: 7,
    description: "Interactive teaching with real-world examples",
    ...extendedTutors[11]
  },
  {
    id: "19",
    name: "Ananya Dutta",
    title: "Art & Craft Instructor",
    subjects: ["Art", "Craft", "Sketching"],
    rating: 4.9,
    reviewCount: 101,
    teachingMode: "Offline",
    location: "Nayapalli, Bhubaneswar",
    image: tutorPriya,
    experience: 9,
    description: "Nurturing artistic talents since 2015",
    ...extendedTutors[12]
  },
  {
    id: "20",
    name: "Vivek Choudhary",
    title: "Chemistry & Math Tutor",
    subjects: ["Chemistry", "Math", "Algebra"],
    rating: 4.8,
    reviewCount: 68,
    teachingMode: "Both",
    location: "Patia, Bhubaneswar",
    image: tutorRajesh,
    experience: 8,
    description: "JEE and board exam preparation",
    ...extendedTutors[13]
  },
  {
    id: "21",
    name: "Swati Bose",
    title: "Web Development Instructor",
    subjects: ["Coding", "Web Development", "JavaScript"],
    rating: 4.9,
    reviewCount: 91,
    teachingMode: "Online",
    location: "Chandrasekharpur, Bhubaneswar",
    image: tutorAnjali,
    experience: 6,
    description: "Building future web developers",
    ...extendedTutors[14]
  },
  {
    id: "22",
    name: "Manish Tiwari",
    title: "Physics & Mathematics Expert",
    subjects: ["Physics", "Math", "Calculus"],
    rating: 4.7,
    reviewCount: 56,
    teachingMode: "Both",
    location: "Jaydev Vihar, Bhubaneswar",
    image: tutorVikram,
    experience: 10,
    description: "Engineering entrance exam specialist",
    ...extendedTutors[15]
  }
] as Tutor[];

export const subjects = [
  "Math",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Coding",
  "Music",
  "Dance",
  "Art"
];

export const locations = [
  "Patia, Bhubaneswar",
  "Chandrasekharpur, Bhubaneswar",
  "Jaydev Vihar, Bhubaneswar",
  "Saheed Nagar, Bhubaneswar",
  "Khandagiri, Bhubaneswar",
  "Nayapalli, Bhubaneswar",
  "Bapuji Nagar, Bhubaneswar"
];
