// Extended tutor data for tutors 7-22
import tutorPriya from "@/assets/tutor-priya.jpg";
import tutorRajesh from "@/assets/tutor-rajesh.jpg";
import tutorAnjali from "@/assets/tutor-anjali.jpg";
import tutorVikram from "@/assets/tutor-vikram.jpg";
import tutorMeera from "@/assets/tutor-meera.jpg";
import tutorArjun from "@/assets/tutor-arjun.jpg";
import type { Tutor } from "./tutors";

export const extendedTutors: Partial<Tutor>[] = [
  // Tutor 7
  {
    detailedDescription: "Award-winning musician with 11 years of teaching experience in both classical and contemporary music. I have trained over 100 students who have won competitions at state and national levels. My teaching includes vocal techniques, keyboard skills, and music theory.",
    qualifications: ["MA in Music", "Sangeet Prabhakar", "Trinity College London Grade 8"],
    subjectsWithLevels: [
      { subject: "Music", levels: ["Beginner", "Intermediate", "Advanced"] },
      { subject: "Vocal", levels: ["Classical", "Western", "Light Music"] },
      { subject: "Keyboard", levels: ["Grade 1-8", "Performance"] }
    ],
    category: "Non-Academic" as const,
    availability: "Mon-Sat: 4 PM - 9 PM",
    phone: "9876541230",
    email: "kavya.nair@email.com",
    preferredContact: "Phone" as const,
    gallery: [tutorPriya, tutorPriya],
    reviews: [
      { id: "r14", reviewerName: "Shruti V.", rating: 5, date: "2024-01-01", text: "My daughter loves her music classes! Very talented teacher." },
      { id: "r15", reviewerName: "Amit B.", rating: 5, date: "2023-12-25", text: "Learned keyboard from scratch. Highly recommended!" }
    ]
  },
  // Tutor 8
  {
    detailedDescription: "Mathematics educator passionate about simplifying complex concepts. My 5 years of teaching focus on building strong fundamentals and problem-solving skills. Students appreciate my patient approach and clear explanations.",
    qualifications: ["M.Sc. Mathematics", "B.Ed.", "Olympiad Trainer Certification"],
    subjectsWithLevels: [
      { subject: "Math", levels: ["Class 8-12", "Board Exams"] },
      { subject: "Calculus", levels: ["Class 11-12", "Engineering"] },
      { subject: "Trigonometry", levels: ["Class 10-12"] }
    ],
    category: "Academic" as const,
    availability: "Mon-Fri: 5 PM - 9 PM",
    phone: "9845123678",
    email: "sanjay.gupta@email.com",
    preferredContact: "Email" as const,
    gallery: [tutorRajesh],
    reviews: [
      { id: "r16", reviewerName: "Priya M.", rating: 5, date: "2023-12-20", text: "Excellent teacher with great teaching methodology." },
      { id: "r17", reviewerName: "Rakesh K.", rating: 4, date: "2023-12-10", text: "Helped me improve my calculus skills significantly." }
    ]
  },
  // Tutor 9
  {
    detailedDescription: "Professional artist and art educator with 8 years of experience nurturing young talents. I specialize in various art forms including drawing, painting, and sketching. My classes focus on building creativity and technical skills.",
    qualifications: ["BFA from College of Art", "Diploma in Fine Arts", "Multiple Exhibition Awards"],
    subjectsWithLevels: [
      { subject: "Art", levels: ["Beginner", "Intermediate", "Advanced"] },
      { subject: "Drawing", levels: ["Sketching", "Portrait", "Still Life"] },
      { subject: "Painting", levels: ["Watercolor", "Acrylic", "Oil Painting"] }
    ],
    category: "Non-Academic" as const,
    availability: "Tue-Sun: 10 AM - 6 PM",
    phone: "9812367890",
    email: "deepika.das@email.com",
    preferredContact: "Both" as const,
    gallery: [tutorAnjali, tutorAnjali, tutorAnjali],
    reviews: [
      { id: "r18", reviewerName: "Meera S.", rating: 5, date: "2023-12-15", text: "Amazing art teacher! My son's creativity has flourished." },
      { id: "r19", reviewerName: "Vikram P.", rating: 5, date: "2023-12-05", text: "Very patient and encouraging. Great for beginners." }
    ]
  },
  // Tutor 10
  {
    detailedDescription: "Chemistry expert with 7 years of teaching experience. I make chemistry fun and easy through practical examples and demonstrations. My students consistently score above 90% in board exams and competitive tests.",
    qualifications: ["M.Sc. Organic Chemistry", "B.Ed.", "CSIR NET Qualified"],
    subjectsWithLevels: [
      { subject: "Chemistry", levels: ["Class 9-12", "IIT-JEE", "NEET"] },
      { subject: "Organic Chemistry", levels: ["Class 11-12", "Competitive Exams"] }
    ],
    category: "Academic" as const,
    availability: "Mon-Sat: 4 PM - 8 PM",
    phone: "9823456712",
    email: "rahul.verma@email.com",
    preferredContact: "Phone" as const,
    gallery: [tutorVikram, tutorVikram],
    reviews: [
      { id: "r20", reviewerName: "Anjali R.", rating: 5, date: "2023-12-12", text: "Best chemistry teacher! Cleared all my concepts." },
      { id: "r21", reviewerName: "Karthik M.", rating: 4, date: "2023-11-28", text: "Great teaching methods and study materials." }
    ]
  },
  // Tutor 11
  {
    detailedDescription: "Professional dancer and choreographer with 10 years of teaching experience. I specialize in classical and contemporary dance forms. My students have won numerous competitions and many have pursued dance professionally.",
    qualifications: ["Diploma in Dance", "Bharatanatyam Arangetram", "International Dance Certification"],
    subjectsWithLevels: [
      { subject: "Dance", levels: ["Beginner", "Intermediate", "Advanced"] },
      { subject: "Classical Dance", levels: ["Bharatanatyam", "Odissi"] },
      { subject: "Contemporary", levels: ["Modern", "Jazz", "Freestyle"] }
    ],
    category: "Non-Academic" as const,
    availability: "Mon-Sat: 5 PM - 9 PM, Sun: 9 AM - 1 PM",
    phone: "9867823451",
    email: "sneha.rao@email.com",
    preferredContact: "Phone" as const,
    gallery: [tutorMeera, tutorMeera, tutorMeera],
    reviews: [
      { id: "r22", reviewerName: "Divya K.", rating: 5, date: "2023-12-08", text: "Wonderful dance teacher! My daughter loves her classes." },
      { id: "r23", reviewerName: "Ravi S.", rating: 5, date: "2023-11-22", text: "Very professional and skilled choreographer." }
    ]
  },
  // Tutor 12
  {
    detailedDescription: "Physics educator with 9 years of experience making physics concepts simple and interesting. I use real-world examples and interactive learning methods. My students excel in both board exams and competitive tests.",
    qualifications: ["M.Sc. Physics", "B.Ed.", "IIT-JEE Coaching Certification"],
    subjectsWithLevels: [
      { subject: "Physics", levels: ["Class 9-12", "IIT-JEE", "NEET"] },
      { subject: "Mechanics", levels: ["Class 11-12", "Engineering Entrance"] },
      { subject: "Optics", levels: ["Class 12", "Competitive Exams"] }
    ],
    category: "Academic" as const,
    availability: "Mon-Sun: 6 PM - 10 PM",
    phone: "9834512789",
    email: "aditya.joshi@email.com",
    preferredContact: "Email" as const,
    gallery: [tutorArjun, tutorArjun],
    reviews: [
      { id: "r24", reviewerName: "Priya D.", rating: 5, date: "2023-12-03", text: "Excellent physics teacher! Makes difficult topics easy." },
      { id: "r25", reviewerName: "Arjun K.", rating: 5, date: "2023-11-18", text: "Very helpful and patient. Highly recommended!" }
    ]
  },
  // Tutor 13
  {
    detailedDescription: "English language specialist with 6 years of experience in developing communication skills. I focus on grammar, creative writing, and spoken English. My interactive teaching methods make learning enjoyable and effective.",
    qualifications: ["MA English", "B.Ed.", "Cambridge CELTA"],
    subjectsWithLevels: [
      { subject: "English", levels: ["Class 6-12", "Spoken English"] },
      { subject: "Creative Writing", levels: ["All Levels", "Competitive Exams"] },
      { subject: "Grammar", levels: ["Basic", "Advanced"] }
    ],
    category: "Academic" as const,
    availability: "Tue-Sat: 3 PM - 8 PM",
    phone: "9812378945",
    email: "pooja.iyer@email.com",
    preferredContact: "Both" as const,
    gallery: [tutorPriya, tutorPriya],
    reviews: [
      { id: "r26", reviewerName: "Deepak M.", rating: 5, date: "2023-11-30", text: "Great English teacher! Improved my writing skills." },
      { id: "r27", reviewerName: "Sneha R.", rating: 4, date: "2023-11-15", text: "Very knowledgeable and friendly teacher." }
    ]
  },
  // Tutor 14
  {
    detailedDescription: "Software engineer turned coding instructor with 8 years of teaching experience. I specialize in Java, C++, and data structures. My practical approach helps students become confident programmers ready for placements and competitive coding.",
    qualifications: ["B.Tech CSE", "Oracle Java Certification", "Competitive Programming Expert"],
    subjectsWithLevels: [
      { subject: "Coding", levels: ["Beginner", "Advanced", "Competitive Programming"] },
      { subject: "Java", levels: ["Core Java", "Advanced Java", "Spring Boot"] },
      { subject: "C++", levels: ["Basic", "STL", "Advanced"] }
    ],
    category: "Non-Academic" as const,
    availability: "Mon-Fri: 7 PM - 10 PM, Weekends: Flexible",
    phone: "9845671234",
    email: "karthik.menon@email.com",
    preferredContact: "Email" as const,
    gallery: [tutorRajesh, tutorRajesh],
    reviews: [
      { id: "r28", reviewerName: "Aditya S.", rating: 5, date: "2023-11-25", text: "Best coding mentor! Helped me crack my placement tests." },
      { id: "r29", reviewerName: "Neha K.", rating: 5, date: "2023-11-10", text: "Excellent teacher with deep knowledge of programming." }
    ]
  },
  // Tutor 15
  {
    detailedDescription: "Biology expert with 11 years of NEET coaching experience. I have helped over 250 students secure admissions in top medical colleges. My teaching methodology combines conceptual clarity with extensive practice and regular assessments.",
    qualifications: ["M.Sc. Genetics", "Ph.D. in Ecology", "NEET Top Ranker"],
    subjectsWithLevels: [
      { subject: "Biology", levels: ["Class 9-12", "NEET", "AIIMS"] },
      { subject: "Genetics", levels: ["Class 12", "Medical Entrance"] },
      { subject: "Ecology", levels: ["Class 12", "Competitive Exams"] }
    ],
    category: "Academic" as const,
    availability: "Mon-Sat: 6 AM - 12 PM, 5 PM - 8 PM",
    phone: "9823451678",
    email: "divya.kapoor@email.com",
    preferredContact: "Phone" as const,
    gallery: [tutorAnjali, tutorAnjali, tutorAnjali],
    reviews: [
      { id: "r30", reviewerName: "Rohit M.", rating: 5, date: "2023-11-20", text: "Got selected in AIIMS! Thank you ma'am!" },
      { id: "r31", reviewerName: "Priya K.", rating: 5, date: "2023-11-05", text: "Best biology teacher for NEET preparation." }
    ]
  },
  // Tutor 16
  {
    detailedDescription: "Patient and student-friendly tutor with 5 years of experience teaching math and science. I believe in personalized attention and adapting my teaching style to each student's learning pace. My goal is to build confidence along with knowledge.",
    qualifications: ["B.Sc. Physics and Mathematics", "B.Ed.", "Child Psychology Certificate"],
    subjectsWithLevels: [
      { subject: "Math", levels: ["Class 6-10", "Board Exams"] },
      { subject: "Science", levels: ["Class 6-10"] },
      { subject: "Physics", levels: ["Class 11-12"] }
    ],
    category: "Academic" as const,
    availability: "Mon-Sat: 4 PM - 8 PM",
    phone: "9867452389",
    email: "nikhil.pandey@email.com",
    preferredContact: "Both" as const,
    gallery: [tutorVikram],
    reviews: [
      { id: "r32", reviewerName: "Anita M.", rating: 5, date: "2023-11-15", text: "Very patient teacher. My son improved a lot." },
      { id: "r33", reviewerName: "Rajesh K.", rating: 4, date: "2023-10-28", text: "Good teaching methods and friendly approach." }
    ]
  },
  // Tutor 17
  {
    detailedDescription: "Traditional Indian music expert with 13 years of teaching experience. I specialize in flute and tabla, with deep knowledge of classical ragas and talas. My students have performed at various prestigious platforms and competitions.",
    qualifications: ["Sangeet Visharad", "All India Radio Graded Artist", "National Award Winner"],
    subjectsWithLevels: [
      { subject: "Music", levels: ["Classical", "Light Classical", "Film Music"] },
      { subject: "Flute", levels: ["Beginner to Advanced"] },
      { subject: "Tabla", levels: ["Basic Talas to Advanced Compositions"] }
    ],
    category: "Non-Academic" as const,
    availability: "Mon-Sun: 5 PM - 9 PM",
    phone: "9812456783",
    email: "lakshmi.pillai@email.com",
    preferredContact: "Phone" as const,
    gallery: [tutorMeera, tutorMeera],
    reviews: [
      { id: "r34", reviewerName: "Vikram R.", rating: 5, date: "2023-11-12", text: "Outstanding music teacher! True master of her craft." },
      { id: "r35", reviewerName: "Divya S.", rating: 5, date: "2023-10-25", text: "Learning flute from her is a wonderful experience." }
    ]
  },
  // Tutor 18
  {
    detailedDescription: "Social studies expert with 7 years of experience making subjects like history and economics interesting through real-world examples. I use interactive teaching methods including case studies, debates, and current affairs discussions.",
    qualifications: ["MA Political Science", "MA Economics", "B.Ed."],
    subjectsWithLevels: [
      { subject: "History", levels: ["Class 6-12", "Competitive Exams"] },
      { subject: "Political Science", levels: ["Class 11-12", "BA Level"] },
      { subject: "Economics", levels: ["Class 11-12", "Competitive Exams"] }
    ],
    category: "Academic" as const,
    availability: "Mon-Sat: 2 PM - 7 PM",
    phone: "9834567812",
    email: "rohit.saxena@email.com",
    preferredContact: "Email" as const,
    gallery: [tutorArjun],
    reviews: [
      { id: "r36", reviewerName: "Meera D.", rating: 5, date: "2023-11-08", text: "Makes social studies so interesting! Great teacher." },
      { id: "r37", reviewerName: "Arun K.", rating: 4, date: "2023-10-20", text: "Very knowledgeable and uses good examples." }
    ]
  },
  // Tutor 19
  {
    detailedDescription: "Professional art and craft instructor nurturing artistic talents since 2015. With 9 years of experience, I have helped students develop their creativity through various mediums including painting, sketching, and craft work. Many of my students have won art competitions.",
    qualifications: ["BFA", "Diploma in Art Education", "Multiple National Level Awards"],
    subjectsWithLevels: [
      { subject: "Art", levels: ["Beginner", "Intermediate", "Advanced"] },
      { subject: "Craft", levels: ["Paper Craft", "Clay Modeling", "DIY Projects"] },
      { subject: "Sketching", levels: ["Basic", "Portrait", "Landscape"] }
    ],
    category: "Non-Academic" as const,
    availability: "Tue-Sun: 10 AM - 1 PM, 3 PM - 6 PM",
    phone: "9823467851",
    email: "ananya.dutta@email.com",
    preferredContact: "Phone" as const,
    gallery: [tutorPriya, tutorPriya, tutorPriya],
    reviews: [
      { id: "r38", reviewerName: "Shruti M.", rating: 5, date: "2023-11-01", text: "Wonderful art teacher! My daughter loves her classes." },
      { id: "r39", reviewerName: "Kiran P.", rating: 5, date: "2023-10-15", text: "Very creative and encourages students beautifully." }
    ]
  },
  // Tutor 20
  {
    detailedDescription: "Dual subject expert specializing in chemistry and mathematics for JEE and board exam preparation. With 8 years of teaching experience, I have helped numerous students achieve their engineering dreams through conceptual understanding and rigorous practice.",
    qualifications: ["B.Tech Chemical Engineering from IIT Delhi", "M.Sc. Mathematics", "AIR 126 in JEE Advanced"],
    subjectsWithLevels: [
      { subject: "Chemistry", levels: ["Class 11-12", "IIT-JEE", "Board Exams"] },
      { subject: "Math", levels: ["Class 11-12", "IIT-JEE"] },
      { subject: "Algebra", levels: ["Advanced Level", "Competitive Exams"] }
    ],
    category: "Academic" as const,
    availability: "Mon-Sat: 5 PM - 10 PM",
    phone: "9845673421",
    email: "vivek.choudhary@email.com",
    preferredContact: "Both" as const,
    gallery: [tutorRajesh, tutorRajesh],
    reviews: [
      { id: "r40", reviewerName: "Rahul S.", rating: 5, date: "2023-10-28", text: "Cracked JEE Mains with his guidance! Excellent mentor." },
      { id: "r41", reviewerName: "Pooja K.", rating: 5, date: "2023-10-12", text: "Best teacher for JEE preparation. Highly recommended!" }
    ]
  },
  // Tutor 21
  {
    detailedDescription: "Full-stack web developer and instructor building future web developers for 6 years. I teach practical, industry-relevant skills in modern web technologies. My students have successfully launched careers in top tech companies and startups.",
    qualifications: ["B.Tech CSE", "Full Stack Developer Certification", "AWS Solutions Architect"],
    subjectsWithLevels: [
      { subject: "Coding", levels: ["Web Development Fundamentals", "Advanced Programming"] },
      { subject: "Web Development", levels: ["Frontend", "Backend", "Full Stack"] },
      { subject: "JavaScript", levels: ["Basics", "ES6+", "React", "Node.js"] }
    ],
    category: "Non-Academic" as const,
    availability: "Mon-Fri: 7 PM - 10 PM, Weekends: 10 AM - 1 PM",
    phone: "9812345896",
    email: "swati.bose@email.com",
    preferredContact: "Email" as const,
    gallery: [tutorAnjali, tutorAnjali],
    reviews: [
      { id: "r42", reviewerName: "Aditya M.", rating: 5, date: "2023-10-22", text: "Learned MERN stack and got placed! Thank you ma'am!" },
      { id: "r43", reviewerName: "Neha R.", rating: 5, date: "2023-10-05", text: "Best web development course. Very practical approach." }
    ]
  },
  // Tutor 22
  {
    detailedDescription: "Engineering entrance exam specialist with 10 years of experience coaching students for IIT-JEE and other competitive exams. I teach physics and mathematics with a focus on problem-solving techniques and exam strategies. My students consistently rank in top percentiles.",
    qualifications: ["B.Tech from NIT Rourkela", "M.Tech from IIT Bombay", "Published Researcher"],
    subjectsWithLevels: [
      { subject: "Physics", levels: ["Class 11-12", "IIT-JEE", "Advanced"] },
      { subject: "Math", levels: ["Class 11-12", "IIT-JEE", "Olympiad"] },
      { subject: "Calculus", levels: ["Advanced Level", "Engineering Mathematics"] }
    ],
    category: "Academic" as const,
    availability: "Mon-Sat: 6 PM - 11 PM",
    phone: "9867834512",
    email: "manish.tiwari@email.com",
    preferredContact: "Phone" as const,
    gallery: [tutorVikram, tutorVikram],
    reviews: [
      { id: "r44", reviewerName: "Vikram D.", rating: 5, date: "2023-10-18", text: "Got AIR 245 in JEE Advanced! Best coaching ever." },
      { id: "r45", reviewerName: "Priya M.", rating: 5, date: "2023-09-30", text: "Excellent teacher for physics and math. Highly skilled!" }
    ]
  }
];
