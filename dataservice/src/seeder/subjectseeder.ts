import { subjectService } from '../services/subject.service';
import { classService } from '../services/class.service';

export interface SubjectSeedData {
  name: string;
  code?: string;
  classCodes?: string[]; // Will be converted to classIds
  description: string;
  keywords?: string[];
  isActive?: boolean;
  isAcademic?: boolean;
  sortOrder?: number;
  metadata?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    duration?: string;
    prerequisites?: string[];
    topics?: string[];
    skills?: string[];
    careerPaths?: string[];
    examPreparation?: string[];
    minAge?: number;
    maxAge?: number;
    popular?: boolean;
    icon?: string;
    color?: string;
  };
}

// Predefined subject data for seeding
export const subjectSeeds: SubjectSeedData[] = [
  // Core Academic Subjects
  {
    name: "Mathematics",
    code: "MATH",
    classCodes: ["CLASS-1", "CLASS-2", "CLASS-3", "CLASS-4", "CLASS-5", "CLASS-6", "CLASS-7", "CLASS-8", "CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "JEE", "BSC", "BTECH", "DATA-SCIENCE"],
    description: "Mathematics deals with numbers, quantities, shapes, and patterns",
    keywords: ["math", "calculations", "algebra", "geometry", "trigonometry", "statistics"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Arithmetic", "Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics", "Probability"],
      skills: ["Problem-solving", "Logical thinking", "Analytical skills", "Numerical ability"],
      careerPaths: ["Engineer", "Data Scientist", "Financial Analyst", "Actuary", "Teacher", "Researcher"],
      examPreparation: ["JEE", "UPSC-CSE", "CAT", "NET"],
      popular: true,
      icon: "🔢",
      color: "#3B82F6"
    }
  },
  {
    name: "Physics",
    code: "PHYS",
    classCodes: ["CLASS-6", "CLASS-7", "CLASS-8", "CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "JEE", "BSC", "BTECH", "MTECH"],
    description: "Physics is the natural science that studies matter, energy, and their interactions",
    keywords: ["physics", "energy", "motion", "forces", "electricity", "magnetism", "optics"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics", "Quantum Physics"],
      skills: ["Analytical thinking", "Problem-solving", "Experimental skills", "Mathematical modeling"],
      careerPaths: ["Physicist", "Engineer", "Research Scientist", "Teacher", "Data Scientist"],
      examPreparation: ["JEE", "NEET", "UPSC-CSE", "NET"],
      icon: "⚡",
      color: "#10B981"
    }
  },
  {
    name: "Chemistry",
    code: "CHEM",
    classCodes: ["CLASS-6", "CLASS-7", "CLASS-8", "CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "JEE", "NEET", "BSC", "BTECH", "MSC"],
    description: "Chemistry is the scientific study of the properties and behavior of matter",
    keywords: ["chemistry", "elements", "compounds", "reactions", "organic", "inorganic", "physical"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Atomic Structure", "Periodic Table", "Chemical Bonding", "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
      skills: ["Laboratory skills", "Analytical thinking", "Problem-solving", "Memory"],
      careerPaths: ["Chemist", "Pharmacist", "Doctor", "Engineer", "Research Scientist", "Teacher"],
      examPreparation: ["JEE", "NEET", "UPSC-CSE", "NET"],
      icon: "🧪",
      color: "#8B5CF6"
    }
  },
  {
    name: "Biology",
    code: "BIO",
    classCodes: ["CLASS-6", "CLASS-7", "CLASS-8", "CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "NEET", "BSC", "MSC"],
    description: "Biology is the scientific study of life and living organisms",
    keywords: ["biology", "life", "organisms", "cells", "genetics", "evolution", "ecology"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Cell Biology", "Genetics", "Evolution", "Ecology", "Human Anatomy", "Physiology"],
      skills: ["Observation", "Analytical thinking", "Memory", "Research skills"],
      careerPaths: ["Doctor", "Biologist", "Research Scientist", "Teacher", "Environmental Scientist", "Pharmacist"],
      examPreparation: ["NEET", "UPSC-CSE", "NET"],
      icon: "🧬",
      color: "#22C55E"
    }
  },
  {
    name: "Computer Science",
    code: "CS",
    classCodes: ["CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "BTECH", "BSC", "MTECH", "MSC", "WEB-DEV", "DATA-SCIENCE"],
    description: "Computer Science is the study of computation, algorithms, and information processing",
    keywords: ["computer", "programming", "coding", "algorithms", "data structures", "software", "AI"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Programming", "Data Structures", "Algorithms", "Database Management", "Web Development", "Artificial Intelligence"],
      skills: ["Programming", "Problem-solving", "Logical thinking", "Creativity"],
      careerPaths: ["Software Engineer", "Data Scientist", "AI Engineer", "Web Developer", "Game Developer", "IT Manager"],
      examPreparation: ["JEE", "GATE", "CAT"],
      popular: true,
      icon: "💻",
      color: "#0EA5E9"
    }
  },
  {
    name: "English",
    code: "ENG",
    classCodes: ["CLASS-1", "CLASS-2", "CLASS-3", "CLASS-4", "CLASS-5", "CLASS-6", "CLASS-7", "CLASS-8", "CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "BA", "MA", "UPSC-CSE"],
    description: "English language and literature covering grammar, writing, and comprehension",
    keywords: ["english", "language", "literature", "grammar", "writing", "communication", "comprehension"],
    isAcademic: true,
    metadata: {
      difficulty: "beginner",
      duration: "Ongoing",
      topics: ["Grammar", "Writing Skills", "Reading Comprehension", "Literature", "Communication Skills"],
      skills: ["Communication", "Writing", "Critical thinking", "Creativity"],
      careerPaths: ["Writer", "Journalist", "Teacher", "Editor", "Content Creator", "Public Relations"],
      examPreparation: ["IELTS", "TOEFL", "UPSC-CSE", "CAT"],
      icon: "📖",
      color: "#EF4444"
    }
  },
  {
    name: "Hindi",
    code: "HIN",
    classCodes: ["CLASS-1", "CLASS-2", "CLASS-3", "CLASS-4", "CLASS-5", "CLASS-6", "CLASS-7", "CLASS-8", "CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "BA", "MA", "UPSC-CSE"],
    description: "Hindi language and literature covering grammar, writing, and comprehension",
    keywords: ["hindi", "language", "literature", "grammar", "writing", "communication"],
    isAcademic: true,
    metadata: {
      difficulty: "beginner",
      duration: "Ongoing",
      topics: ["Grammar", "Writing Skills", "Reading Comprehension", "Literature", "Poetry"],
      skills: ["Communication", "Writing", "Cultural understanding", "Creativity"],
      careerPaths: ["Writer", "Journalist", "Teacher", "Translator", "Content Creator", "Civil Servant"],
      examPreparation: ["UPSC-CSE", "State PCS"],
      icon: "📝",
      color: "#F97316"
    }
  },
  {
    name: "History",
    code: "HIST",
    classCodes: ["CLASS-6", "CLASS-7", "CLASS-8", "CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "BA", "MA", "UPSC-CSE"],
    description: "History is the study of past events, civilizations, and human societies",
    keywords: ["history", "past", "civilizations", "events", "culture", "heritage", "archaeology"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Ancient History", "Medieval History", "Modern History", "World History", "Indian History"],
      skills: ["Critical thinking", "Analysis", "Memory", "Research skills"],
      careerPaths: ["Historian", "Archaeologist", "Teacher", "Civil Servant", "Museum Curator", "Journalist"],
      examPreparation: ["UPSC-CSE", "NET"],
      icon: "🏛️",
      color: "#A855F7"
    }
  },
  {
    name: "Geography",
    code: "GEOG",
    classCodes: ["CLASS-6", "CLASS-7", "CLASS-8", "CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "BA", "MA", "UPSC-CSE"],
    description: "Geography is the study of Earth's physical features, atmosphere, and human activity",
    keywords: ["geography", "earth", "maps", "climate", "terrain", "population", "resources"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Physical Geography", "Human Geography", "Climatology", "Oceanography", "Economic Geography"],
      skills: ["Spatial thinking", "Analysis", "Observation", "Data interpretation"],
      careerPaths: ["Geographer", "Urban Planner", "Environmental Scientist", "Civil Servant", "Teacher", "Cartographer"],
      examPreparation: ["UPSC-CSE", "NET"],
      icon: "🌍",
      color: "#06B6D4"
    }
  },
  {
    name: "Economics",
    code: "ECON",
    classCodes: ["CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "BA", "BSC", "BCOM", "MA", "MSC", "MCOM", "UPSC-CSE", "CAT"],
    description: "Economics studies the production, distribution, and consumption of goods and services",
    keywords: ["economics", "money", "market", "trade", "finance", "business", "policy"],
    isAcademic: true,
    metadata: {
      difficulty: "advanced",
      duration: "Ongoing",
      topics: ["Microeconomics", "Macroeconomics", "International Economics", "Development Economics", "Financial Markets"],
      skills: ["Analytical thinking", "Quantitative skills", "Problem-solving", "Critical thinking"],
      careerPaths: ["Economist", "Financial Analyst", "Banker", "Civil Servant", "Teacher", "Policy Advisor"],
      examPreparation: ["UPSC-CSE", "CAT", "NET"],
      popular: true,
      icon: "💰",
      color: "#EAB308"
    }
  },

  // Science Specializations
  {
    name: "Organic Chemistry",
    code: "ORG-CHEM",
    classCodes: ["CLASS-11", "CLASS-12", "BSC", "MSC", "NEET"],
    description: "Study of carbon-containing compounds and their reactions",
    keywords: ["organic chemistry", "carbon", "compounds", "reactions", "synthesis"],
    isAcademic: true,
    metadata: {
      difficulty: "advanced",
      duration: "1-2 years",
      prerequisites: ["Chemistry"],
      topics: ["Hydrocarbons", "Functional Groups", "Reaction Mechanisms", "Biomolecules", "Polymers"],
      skills: ["Problem-solving", "Mechanism understanding", "Memory", "Laboratory skills"],
      careerPaths: ["Pharmacist", "Chemical Engineer", "Research Scientist", "Doctor"],
      examPreparation: ["JEE", "NEET", "NET"],
      icon: "⚗️",
      color: "#DC2626"
    }
  },
  {
    name: "Physical Chemistry",
    code: "PHY-CHEM",
    classCodes: ["CLASS-11", "CLASS-12", "BSC", "MSC", "JEE"],
    description: "Study of physical principles governing chemical phenomena",
    keywords: ["physical chemistry", "thermodynamics", "kinetics", "quantum", "electrochemistry"],
    isAcademic: true,
    metadata: {
      difficulty: "advanced",
      duration: "1-2 years",
      prerequisites: ["Chemistry", "Physics"],
      topics: ["Thermodynamics", "Chemical Kinetics", "Electrochemistry", "Quantum Chemistry", "Surface Chemistry"],
      skills: ["Mathematical skills", "Problem-solving", "Analytical thinking"],
      careerPaths: ["Chemist", "Research Scientist", "Engineer", "Teacher"],
      examPreparation: ["JEE", "NET"],
      icon: "🔬",
      color: "#059669"
    }
  },

  // Commerce Subjects
  {
    name: "Accountancy",
    code: "ACC",
    classCodes: ["CLASS-11", "CLASS-12", "BCOM", "MCOM", "CA", "CS", "CMA", "CAT"],
    description: "Accountancy is the practice of recording, analyzing, and reporting financial transactions",
    keywords: ["accountancy", "accounting", "finance", "bookkeeping", "transactions", "financial"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Financial Accounting", "Cost Accounting", "Management Accounting", "Auditing", "Taxation"],
      skills: ["Numerical ability", "Attention to detail", "Analytical skills", "Ethics"],
      careerPaths: ["Accountant", "CA", "CS", "Financial Analyst", "Auditor", "CFO"],
      examPreparation: ["CA", "CS", "CMA", "CAT"],
      popular: true,
      icon: "📊",
      color: "#0891B2"
    }
  },
  {
    name: "Business Studies",
    code: "BST",
    classCodes: ["CLASS-11", "CLASS-12", "BCOM", "BBA", "MBA", "CAT"],
    description: "Business Studies covers organization, management, and operations of businesses",
    keywords: ["business", "management", "marketing", "finance", "entrepreneurship", "organization"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Business Organization", "Management Functions", "Marketing", "Finance", "Human Resources"],
      skills: ["Leadership", "Communication", "Decision-making", "Strategic thinking"],
      careerPaths: ["Business Manager", "Entrepreneur", "Marketing Manager", "HR Manager", "Consultant"],
      examPreparation: ["CAT", "UPSC-CSE"],
      icon: "💼",
      color: "#7C3AED"
    }
  },

  // Non-Academic Subjects
  {
    name: "Music",
    code: "MUSIC",
    classCodes: ["CLASSICAL-MUSIC", "LKG", "UKG", "CLASS-1", "CLASS-2", "CLASS-3", "CLASS-4", "CLASS-5"],
    description: "Music education covering theory, practice, and performance",
    keywords: ["music", "singing", "instruments", "theory", "performance", "rhythm", "melody"],
    isAcademic: false,
    metadata: {
      difficulty: "beginner",
      duration: "Ongoing",
      topics: ["Music Theory", "Vocal Training", "Instrument Training", "Composition", "Performance"],
      skills: ["Creativity", "Discipline", "Coordination", "Expression"],
      careerPaths: ["Musician", "Singer", "Composer", "Music Teacher", "Producer"],
      icon: "🎵",
      color: "#EC4899"
    }
  },
  {
    name: "Art and Craft",
    code: "ART",
    classCodes: ["PAINTING", "GRAPHIC-DESIGN", "LKG", "UKG", "CLASS-1", "CLASS-2", "CLASS-3", "CLASS-4", "CLASS-5"],
    description: "Visual arts including drawing, painting, and craft work",
    keywords: ["art", "drawing", "painting", "craft", "sketching", "design", "creativity"],
    isAcademic: false,
    metadata: {
      difficulty: "beginner",
      duration: "Ongoing",
      topics: ["Drawing", "Painting", "Sculpture", "Craft", "Digital Art"],
      skills: ["Creativity", "Fine motor skills", "Visualization", "Patience"],
      careerPaths: ["Artist", "Designer", "Illustrator", "Art Teacher", "Animator"],
      icon: "🎨",
      color: "#F59E0B"
    }
  },
  {
    name: "Dance",
    code: "DANCE",
    classCodes: ["DANCE", "LKG", "UKG", "CLASS-1", "CLASS-2", "CLASS-3", "CLASS-4", "CLASS-5"],
    description: "Dance education covering various dance forms and techniques",
    keywords: ["dance", "movement", "rhythm", "classical", "contemporary", "performance"],
    isAcademic: false,
    metadata: {
      difficulty: "beginner",
      duration: "Ongoing",
      topics: ["Classical Dance", "Contemporary Dance", "Folk Dance", "Choreography", "Fitness"],
      skills: ["Coordination", "Rhythm", "Expression", "Physical fitness"],
      careerPaths: ["Dancer", "Choreographer", "Dance Teacher", "Performing Artist"],
      icon: "💃",
      color: "#F43F5E"
    }
  },
  {
    name: "Yoga and Meditation",
    code: "YOGA",
    classCodes: ["YOGA"],
    description: "Yoga and meditation for physical and mental well-being",
    keywords: ["yoga", "meditation", "wellness", "flexibility", "mindfulness", "breathing"],
    isAcademic: false,
    metadata: {
      difficulty: "beginner",
      duration: "3 months",
      topics: ["Asanas", "Pranayama", "Meditation", "Philosophy", "Relaxation Techniques"],
      skills: ["Flexibility", "Balance", "Mindfulness", "Stress Management"],
      careerPaths: ["Yoga Instructor", "Wellness Coach", "Therapist"],
      icon: "🧘",
      color: "#14B8A6"
    }
  },

  // Competitive Exam Preparation
  {
    name: "Logical Reasoning",
    code: "LOGIC",
    classCodes: ["UPSC-CSE", "CAT", "NET"],
    description: "Logical reasoning and analytical ability for competitive exams",
    keywords: ["logic", "reasoning", "analytical", "aptitude", "puzzles", "critical thinking"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "6 months",
      topics: ["Logical Deduction", "Analytical Reasoning", "Data Sufficiency", "Puzzles", "Critical Thinking"],
      skills: ["Problem-solving", "Analytical thinking", "Logical deduction", "Pattern recognition"],
      careerPaths: ["Civil Servant", "Manager", "Analyst", "Consultant"],
      examPreparation: ["UPSC-CSE", "CAT", "GMAT", "GRE"],
      popular: true,
      icon: "🧩",
      color: "#0F172A"
    }
  },
  {
    name: "Quantitative Aptitude",
    code: "QUANT",
    classCodes: ["UPSC-CSE", "CAT", "JEE"],
    description: "Mathematical aptitude and quantitative skills for competitive exams",
    keywords: ["quantitative", "aptitude", "mathematics", "calculations", "numbers", "percentages"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "6 months",
      topics: ["Arithmetic", "Algebra", "Geometry", "Statistics", "Data Interpretation"],
      skills: ["Problem-solving", "Speed and accuracy", "Mathematical skills", "Data analysis"],
      careerPaths: ["Civil Servant", "Manager", "Financial Analyst", "Data Scientist"],
      examPreparation: ["UPSC-CSE", "CAT", "GMAT", "GRE"],
      icon: "📐",
      color: "#1E40AF"
    }
  },

  // Professional Skills
  {
    name: "Public Speaking",
    code: "PUB-SPEAK",
    classCodes: ["BA", "BTECH", "BCOM", "MBA", "SKILL-DEVELOPMENT"],
    description: "Public speaking and communication skills development",
    keywords: ["public speaking", "communication", "presentation", "confidence", "elocution", "debate"],
    isAcademic: false,
    metadata: {
      difficulty: "intermediate",
      duration: "3 months",
      topics: ["Speech Writing", "Body Language", "Voice Modulation", "Audience Engagement", "Handling Questions"],
      skills: ["Communication", "Confidence", "Persuasion", "Leadership"],
      careerPaths: ["Motivational Speaker", "Corporate Trainer", "Sales Executive", "Leader", "Teacher"],
      icon: "🎤",
      color: "#DC2626"
    }
  },
  {
    name: "Digital Marketing",
    code: "DIG-MKT",
    classCodes: ["DIGITAL-MARKETING", "BBA", "MBA", "BCOM", "SKILL-DEVELOPMENT"],
    description: "Digital marketing strategies and online promotion techniques",
    keywords: ["digital marketing", "SEO", "social media", "content marketing", "advertising", "analytics"],
    isAcademic: false,
    metadata: {
      difficulty: "intermediate",
      duration: "3 months",
      topics: ["SEO", "SEM", "Social Media Marketing", "Content Marketing", "Email Marketing", "Analytics"],
      skills: ["Marketing knowledge", "Analytics", "Creativity", "Communication"],
      careerPaths: ["Digital Marketer", "SEO Specialist", "Social Media Manager", "Content Creator"],
      popular: true,
      icon: "📱",
      color: "#7C2D12"
    }
  },

  // Languages (Foreign)
  {
    name: "French",
    code: "FRENCH",
    classCodes: ["SKILL-DEVELOPMENT"],
    description: "French language learning for beginners and advanced learners",
    keywords: ["french", "language", "france", "foreign", "bilingual", "communication"],
    isAcademic: false,
    metadata: {
      difficulty: "intermediate",
      duration: "6 months",
      topics: ["Grammar", "Vocabulary", "Conversation", "Reading", "Writing"],
      skills: ["Language skills", "Cultural awareness", "Communication"],
      careerPaths: ["Translator", "Tourism", "International Relations", "Teacher"],
      icon: "🇫🇷",
      color: "#1F2937"
    }
  },
  {
    name: "German",
    code: "GERMAN",
    classCodes: ["SKILL-DEVELOPMENT"],
    description: "German language learning for academic and professional purposes",
    keywords: ["german", "language", "deutsch", "foreign", "engineering", "technical"],
    isAcademic: false,
    metadata: {
      difficulty: "intermediate",
      duration: "6 months",
      topics: ["Grammar", "Vocabulary", "Technical German", "Conversation", "Business Communication"],
      skills: ["Language skills", "Technical vocabulary", "Precision"],
      careerPaths: ["Engineer", "Researcher", "Translator", "Tourism", "Business Professional"],
      icon: "🇩🇪",
      color: "#374151"
    }
  },

  // Additional Academic Subjects
  {
    name: "Political Science",
    code: "POL-SCI",
    classCodes: ["CLASS-11", "CLASS-12", "BA", "MA", "UPSC-CSE"],
    description: "Study of political systems, governance, and international relations",
    keywords: ["political science", "politics", "governance", "democracy", "international relations", "policy"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Political Theory", "Indian Constitution", "International Relations", "Public Administration"],
      skills: ["Critical thinking", "Analysis", "Debate", "Writing skills"],
      careerPaths: ["Civil Servant", "Politician", "Diplomat", "Political Analyst", "Teacher"],
      examPreparation: ["UPSC-CSE", "NET"],
      icon: "🏛️",
      color: "#4B5563"
    }
  },
  {
    name: "Environmental Science",
    code: "ENV-SCI",
    classCodes: ["CLASS-9", "CLASS-10", "CLASS-11", "CLASS-12", "BSC", "MSC"],
    description: "Study of environmental issues, ecology, and sustainability",
    keywords: ["environment", "ecology", "sustainability", "pollution", "conservation", "climate change"],
    isAcademic: true,
    metadata: {
      difficulty: "intermediate",
      duration: "Ongoing",
      topics: ["Ecology", "Pollution", "Climate Change", "Conservation", "Sustainable Development"],
      skills: ["Analysis", "Research", "Problem-solving", "Environmental awareness"],
      careerPaths: ["Environmental Scientist", "Conservationist", "Researcher", "Consultant", "Teacher"],
      icon: "🌿",
      color: "#059669"
    }
  },

  // Skill-based Subjects
  {
    name: "Photography",
    code: "PHOTO",
    classCodes: ["SKILL-DEVELOPMENT", "ART"],
    description: "Photography techniques and visual storytelling",
    keywords: ["photography", "camera", "visual", "composition", "lighting", "editing"],
    isAcademic: false,
    metadata: {
      difficulty: "beginner",
      duration: "3 months",
      topics: ["Camera Basics", "Composition", "Lighting", "Editing", "Genre Photography"],
      skills: ["Creativity", "Technical skills", "Visual storytelling", "Attention to detail"],
      careerPaths: ["Photographer", "Photojournalist", "Wedding Photographer", "Product Photographer"],
      icon: "📷",
      color: "#6B7280"
    }
  },
  {
    name: "Creative Writing",
    code: "CREATIVE-WRITING",
    classCodes: ["BA", "MA", "SKILL-DEVELOPMENT"],
    description: "Creative writing techniques for stories, articles, and content",
    keywords: ["writing", "creative", "stories", "articles", "content", "blogging", "fiction"],
    isAcademic: false,
    metadata: {
      difficulty: "intermediate",
      duration: "3 months",
      topics: ["Fiction Writing", "Non-fiction", "Poetry", "Screenwriting", "Content Creation"],
      skills: ["Writing", "Creativity", "Imagination", "Editing"],
      careerPaths: ["Writer", "Content Creator", "Journalist", "Copywriter", "Editor"],
      icon: "✍️",
      color: "#92400E"
    }
  }
];

// Helper function to get class IDs from class codes
async function getClassIdsFromCodes(classCodes: string[]): Promise<string[]> {
  const classIds: string[] = [];

  for (const code of classCodes) {
    try {
      const classItem = await classService.getClassByCode(code);
      if (classItem) {
        classIds.push(classItem.id);
      } else {
        console.warn(`Class not found for code: ${code}`);
      }
    } catch (error) {
      console.error(`Error fetching class for code ${code}:`, error);
    }
  }

  return classIds;
}

// Seed subjects function
export async function seedSubjects(): Promise<void> {
  try {
    console.log('Starting to seed subjects...');

    for (const subjectData of subjectSeeds) {
      try {
        // Check if subject already exists
        const existingSubject = await subjectService.getSubjectByCode(subjectData.code || '');

        if (!existingSubject) {
          // Get class IDs from class codes
          const classIds = subjectData.classCodes ? await getClassIdsFromCodes(subjectData.classCodes) : [];

          // Create new subject if it doesn't exist
          await subjectService.createSubject({
            name: subjectData.name,
            code: subjectData.code,
            classIds: classIds,
            description: subjectData.description,
            keywords: subjectData.keywords,
            isActive: subjectData.isActive ?? true,
            isAcademic: subjectData.isAcademic ?? true,
            sortOrder: subjectData.sortOrder,
            metadata: subjectData.metadata
          });

          console.log(`Created subject: ${subjectData.name} (${subjectData.code})`);
        } else {
          console.log(`Subject already exists: ${subjectData.name} (${subjectData.code})`);
        }
      } catch (error: any) {
        console.error(`Error creating subject ${subjectData.name}:`, error.message);
      }
    }

    console.log('Subjects seeding completed!');
  } catch (error: any) {
    console.error('Error seeding subjects:', error);
    throw error;
  }
}

// Clear all subjects function (for testing)
export async function clearSubjects(): Promise<void> {
  try {
    console.log('Clearing all subjects...');
    const allSubjects = await subjectService.getAllSubjects();

    for (const subject of allSubjects) {
      try {
        await subjectService.deleteSubject(subject.id);
        console.log(`Deleted subject: ${subject.name}`);
      } catch (error: any) {
        console.error(`Error deleting subject ${subject.name}:`, error.message);
      }
    }

    console.log('Subjects clearing completed!');
  } catch (error: any) {
    console.error('Error clearing subjects:', error);
    throw error;
  }
}

// Export default seeder
export default seedSubjects;