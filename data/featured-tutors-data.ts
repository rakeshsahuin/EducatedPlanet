export interface Tutor {
  id: string;
  name: string;
  title: string;
  photo: string;
  subjects: string[];
  rating: {
    average: number;
    count: number;
  };
  teachingModes: ("online" | "offline" | "both")[];
  location: {
    areas: string[];
    city: string;
  };
  experience: string;
  isVerified: boolean;
  price: {
    min: number;
    max: number;
    currency: string;
  };
}

export const featuredTutors: Tutor[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    title: "PhD in Mathematics",
    photo: "/placeholder-tutor-1.jpg",
    subjects: ["Mathematics", "Statistics", "Quantitative Aptitude"],
    rating: {
      average: 4.9,
      count: 234
    },
    teachingModes: ["online", "offline"],
    location: {
      areas: ["Patia", "Saheed Nagar"],
      city: "Bhubaneswar"
    },
    experience: "10+ years",
    isVerified: true,
    price: {
      min: 800,
      max: 1200,
      currency: "₹"
    }
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    title: "M.Sc. Physics",
    photo: "/placeholder-tutor-2.jpg",
    subjects: ["Physics", "Chemistry", "Science"],
    rating: {
      average: 4.8,
      count: 189
    },
    teachingModes: ["both"],
    location: {
      areas: ["Old Town", "Master Canteen"],
      city: "Bhubaneswar"
    },
    experience: "8+ years",
    isVerified: true,
    price: {
      min: 600,
      max: 900,
      currency: "₹"
    }
  },
  {
    id: "3",
    name: "Anjali Verma",
    title: "M.A. English Literature",
    photo: "/placeholder-tutor-3.jpg",
    subjects: ["English", "Communication Skills", "Creative Writing"],
    rating: {
      average: 4.7,
      count: 156
    },
    teachingModes: ["online"],
    location: {
      areas: ["Nayapalli", "Patia"],
      city: "Bhubaneswar"
    },
    experience: "6+ years",
    isVerified: true,
    price: {
      min: 500,
      max: 800,
      currency: "₹"
    }
  },
  {
    id: "4",
    name: "Dr. Vikram Singh",
    title: "PhD in Computer Science",
    photo: "/placeholder-tutor-4.jpg",
    subjects: ["Computer Science", "Programming", "Data Structures"],
    rating: {
      average: 4.9,
      count: 278
    },
    teachingModes: ["both"],
    location: {
      areas: ["VSS Nagar", "Saheed Nagar"],
      city: "Bhubaneswar"
    },
    experience: "12+ years",
    isVerified: true,
    price: {
      min: 1000,
      max: 1500,
      currency: "₹"
    }
  },
  {
    id: "5",
    name: "Meera Iyer",
    title: "M.Com, CA Inter",
    photo: "/placeholder-tutor-5.jpg",
    subjects: ["Accountancy", "Business Studies", "Economics"],
    rating: {
      average: 4.6,
      count: 145
    },
    teachingModes: ["offline", "online"],
    location: {
      areas: ["Old Town", "Nayapalli"],
      city: "Bhubaneswar"
    },
    experience: "7+ years",
    isVerified: true,
    price: {
      min: 700,
      max: 1000,
      currency: "₹"
    }
  },
  {
    id: "6",
    name: "Arjun Patnaik",
    title: "B.Tech, IIT Kharagpur",
    photo: "/placeholder-tutor-6.jpg",
    subjects: ["Mathematics", "Physics", "JEE Preparation"],
    rating: {
      average: 4.8,
      count: 203
    },
    teachingModes: ["both"],
    location: {
      areas: ["Patia", "Master Canteen"],
      city: "Bhubaneswar"
    },
    experience: "5+ years",
    isVerified: true,
    price: {
      min: 1200,
      max: 1800,
      currency: "₹"
    }
  },
  {
    id: "7",
    name: "Sunita Reddy",
    title: "M.Sc. Biotechnology",
    photo: "/placeholder-tutor-7.jpg",
    subjects: ["Biology", "Biotechnology", "NEET Preparation"],
    rating: {
      average: 4.7,
      count: 167
    },
    teachingModes: ["offline"],
    location: {
      areas: ["Saheed Nagar", "VSS Nagar"],
      city: "Bhubaneswar"
    },
    experience: "9+ years",
    isVerified: true,
    price: {
      min: 800,
      max: 1100,
      currency: "₹"
    }
  },
  {
    id: "8",
    name: "Prof. Ramesh Mishra",
    title: "M.Tech, Former HOD",
    photo: "/placeholder-tutor-8.jpg",
    subjects: ["Chemistry", "Organic Chemistry", "JEE/NEET"],
    rating: {
      average: 4.9,
      count: 298
    },
    teachingModes: ["both"],
    location: {
      areas: ["Nayapalli", "Old Town"],
      city: "Bhubaneswar"
    },
    experience: "15+ years",
    isVerified: true,
    price: {
      min: 1000,
      max: 1400,
      currency: "₹"
    }
  }
]