import { ClassCategory } from '@educatedplanet/models';
import { classService } from '../services/class.service';

export interface ClassSeedData {
  name: string;
  code: string;
  category: ClassCategory;
  subClasses?: string[];
  description?: string;
  metadata?: {
    minAge?: number;
    maxAge?: number;
    duration?: string;
    subjects?: string[];
    prerequisites?: string[];
  };
}

// Predefined class data for seeding
export const classSeeds: ClassSeedData[] = [
  // School Classes
  {
    name: "Lower Kindergarten",
    code: "LKG",
    category: ClassCategory.SCHOOL,
    description: "Foundation year for early childhood education",
    metadata: { minAge: 3, maxAge: 4, duration: "1 year" }
  },
  {
    name: "Upper Kindergarten",
    code: "UKG",
    category: ClassCategory.SCHOOL,
    description: "Preparatory year for primary education",
    metadata: { minAge: 4, maxAge: 5, duration: "1 year" }
  },
  {
    name: "Class 1",
    code: "CLASS-1",
    category: ClassCategory.SCHOOL,
    description: "First year of primary education",
    metadata: { minAge: 5, maxAge: 6, duration: "1 year" }
  },
  {
    name: "Class 2",
    code: "CLASS-2",
    category: ClassCategory.SCHOOL,
    description: "Second year of primary education",
    metadata: { minAge: 6, maxAge: 7, duration: "1 year" }
  },
  {
    name: "Class 3",
    code: "CLASS-3",
    category: ClassCategory.SCHOOL,
    description: "Third year of primary education",
    metadata: { minAge: 7, maxAge: 8, duration: "1 year" }
  },
  {
    name: "Class 4",
    code: "CLASS-4",
    category: ClassCategory.SCHOOL,
    description: "Fourth year of primary education",
    metadata: { minAge: 8, maxAge: 9, duration: "1 year" }
  },
  {
    name: "Class 5",
    code: "CLASS-5",
    category: ClassCategory.SCHOOL,
    description: "Fifth year of primary education",
    metadata: { minAge: 9, maxAge: 10, duration: "1 year" }
  },
  {
    name: "Class 6",
    code: "CLASS-6",
    category: ClassCategory.SCHOOL,
    description: "First year of middle school",
    metadata: { minAge: 10, maxAge: 11, duration: "1 year" }
  },
  {
    name: "Class 7",
    code: "CLASS-7",
    category: ClassCategory.SCHOOL,
    description: "Second year of middle school",
    metadata: { minAge: 11, maxAge: 12, duration: "1 year" }
  },
  {
    name: "Class 8",
    code: "CLASS-8",
    category: ClassCategory.SCHOOL,
    description: "Third year of middle school",
    metadata: { minAge: 12, maxAge: 13, duration: "1 year" }
  },
  {
    name: "Class 9",
    code: "CLASS-9",
    category: ClassCategory.SCHOOL,
    description: "First year of high school",
    metadata: { minAge: 13, maxAge: 14, duration: "1 year" }
  },
  {
    name: "Class 10",
    code: "CLASS-10",
    category: ClassCategory.SCHOOL,
    description: "Second year of high school - Board exams",
    metadata: { minAge: 14, maxAge: 15, duration: "1 year" }
  },
  {
    name: "Class 11",
    code: "CLASS-11",
    category: ClassCategory.SCHOOL,
    description: "First year of intermediate education",
    metadata: { minAge: 15, maxAge: 16, duration: "1 year" }
  },
  {
    name: "Class 12",
    code: "CLASS-12",
    category: ClassCategory.SCHOOL,
    description: "Second year of intermediate education - Board exams",
    metadata: { minAge: 16, maxAge: 17, duration: "1 year" }
  },

  // College Classes
  {
    name: "Bachelor of Arts",
    code: "BA",
    category: ClassCategory.COLLEGE,
    description: "3-year undergraduate arts program",
    metadata: { minAge: 17, maxAge: 20, duration: "3 years" }
  },
  {
    name: "Bachelor of Science",
    code: "BSC",
    category: ClassCategory.COLLEGE,
    description: "3-year undergraduate science program",
    metadata: { minAge: 17, maxAge: 20, duration: "3 years" }
  },
  {
    name: "Bachelor of Commerce",
    code: "BCOM",
    category: ClassCategory.COLLEGE,
    description: "3-year undergraduate commerce program",
    metadata: { minAge: 17, maxAge: 20, duration: "3 years" }
  },
  {
    name: "Bachelor of Technology",
    code: "BTECH",
    category: ClassCategory.COLLEGE,
    description: "4-year undergraduate engineering program",
    metadata: { minAge: 17, maxAge: 21, duration: "4 years" }
  },
  {
    name: "Master of Arts",
    code: "MA",
    category: ClassCategory.COLLEGE,
    description: "2-year postgraduate arts program",
    metadata: { minAge: 20, maxAge: 22, duration: "2 years", prerequisites: ["BA"] }
  },
  {
    name: "Master of Science",
    code: "MSC",
    category: ClassCategory.COLLEGE,
    description: "2-year postgraduate science program",
    metadata: { minAge: 20, maxAge: 22, duration: "2 years", prerequisites: ["BSC"] }
  },
  {
    name: "Master of Technology",
    code: "MTECH",
    category: ClassCategory.COLLEGE,
    description: "2-year postgraduate engineering program",
    metadata: { minAge: 21, maxAge: 23, duration: "2 years", prerequisites: ["BTECH"] }
  },

  // Competitive Exams
  {
    name: "Civil Services Examination",
    code: "UPSC-CSE",
    category: ClassCategory.COMPETITIVE,
    description: "India's premier civil services examination",
    metadata: { minAge: 21, duration: "1 year preparation", subjects: ["History", "Geography", "Polity", "Economics", "Science"] }
  },
  {
    name: "Joint Entrance Examination",
    code: "JEE",
    category: ClassCategory.COMPETITIVE,
    description: "Engineering entrance examination for IITs and NITs",
    metadata: { minAge: 16, maxAge: 18, duration: "2 years preparation", subjects: ["Physics", "Chemistry", "Mathematics"] }
  },
  {
    name: "National Eligibility Test",
    code: "NET",
    category: ClassCategory.COMPETITIVE,
    description: "Eligibility test for college/university lectureship",
    metadata: { minAge: 21, duration: "6 months preparation" }
  },
  {
    name: "Common Admission Test",
    code: "CAT",
    category: ClassCategory.COMPETITIVE,
    description: "Management entrance examination for IIMs",
    metadata: { minAge: 20, duration: "1 year preparation" }
  },

  // Professional Courses
  {
    name: "Chartered Accountancy",
    code: "CA",
    category: ClassCategory.PROFESSIONAL,
    description: "Professional accounting certification program",
    metadata: { minAge: 18, duration: "4-5 years" }
  },
  {
    name: "Company Secretary",
    code: "CS",
    category: ClassCategory.PROFESSIONAL,
    description: "Professional company law certification program",
    metadata: { minAge: 17, duration: "3-4 years" }
  },
  {
    name: "Cost and Management Accountancy",
    code: "CMA",
    category: ClassCategory.PROFESSIONAL,
    description: "Professional cost accounting certification program",
    metadata: { minAge: 17, duration: "3-4 years" }
  },

  // Skill Development
  {
    name: "Web Development",
    code: "WEB-DEV",
    category: ClassCategory.SKILL_DEVELOPMENT,
    description: "Full-stack web development course",
    metadata: { minAge: 16, duration: "6 months", subjects: ["HTML", "CSS", "JavaScript", "React", "Node.js"] }
  },
  {
    name: "Digital Marketing",
    code: "DIGITAL-MARKETING",
    category: ClassCategory.SKILL_DEVELOPMENT,
    description: "Digital marketing and SEO course",
    metadata: { minAge: 16, duration: "3 months" }
  },
  {
    name: "Data Science",
    code: "DATA-SCIENCE",
    category: ClassCategory.SKILL_DEVELOPMENT,
    description: "Data science and machine learning course",
    metadata: { minAge: 18, duration: "9 months", subjects: ["Python", "Statistics", "Machine Learning", "Deep Learning"] }
  },
  {
    name: "Graphic Designing",
    code: "GRAPHIC-DESIGN",
    category: ClassCategory.SKILL_DEVELOPMENT,
    description: "Graphic design and UI/UX course",
    metadata: { minAge: 16, duration: "4 months" }
  },

  // Sports
  {
    name: "Cricket Training",
    code: "CRICKET",
    category: ClassCategory.SPORTS,
    description: "Professional cricket coaching",
    metadata: { minAge: 8, maxAge: 25, duration: "Ongoing" }
  },
  {
    name: "Football Training",
    code: "FOOTBALL",
    category: ClassCategory.SPORTS,
    description: "Professional football coaching",
    metadata: { minAge: 8, maxAge: 25, duration: "Ongoing" }
  },
  {
    name: "Swimming",
    code: "SWIMMING",
    category: ClassCategory.SPORTS,
    description: "Swimming lessons for all ages",
    metadata: { minAge: 5, maxAge: 50, duration: "3 months" }
  },

  // Art
  {
    name: "Classical Music",
    code: "CLASSICAL-MUSIC",
    category: ClassCategory.ART,
    description: "Indian classical music training",
    metadata: { minAge: 6, duration: "Ongoing" }
  },
  {
    name: "Dance Classes",
    code: "DANCE",
    category: ClassCategory.ART,
    description: "Various dance forms training",
    metadata: { minAge: 5, duration: "Ongoing" }
  },
  {
    name: "Painting",
    code: "PAINTING",
    category: ClassCategory.ART,
    description: "Painting and sketching classes",
    metadata: { minAge: 8, duration: "6 months" }
  },

  // Health
  {
    name: "Yoga",
    code: "YOGA",
    category: ClassCategory.HEALTH,
    description: "Yoga and meditation classes",
    metadata: { minAge: 10, maxAge: 70, duration: "3 months" }
  },
  {
    name: "Fitness Training",
    code: "FITNESS",
    category: ClassCategory.HEALTH,
    description: "Physical fitness and gym training",
    metadata: { minAge: 16, maxAge: 60, duration: "Ongoing" }
  }
];

// Seed classes function
export async function seedClasses(): Promise<void> {
  try {
    console.log('Starting to seed classes...');

    for (const classData of classSeeds) {
      try {
        // Check if class already exists
        const existingClass = await classService.getClassByCode(classData.code);

        if (!existingClass) {
          // Create new class if it doesn't exist
          await classService.createClass({
            name: classData.name,
            code: classData.code,
            category: classData.category,
            subClasses: classData.subClasses,
            description: classData.description,
            isActive: true,
            sortOrder: 0, // Will be auto-calculated
            metadata: classData.metadata
          });

          console.log(`Created class: ${classData.name} (${classData.code})`);
        } else {
          console.log(`Class already exists: ${classData.name} (${classData.code})`);
        }
      } catch (error: any) {
        console.error(`Error creating class ${classData.name}:`, error.message);
      }
    }

    console.log('Classes seeding completed!');
  } catch (error: any) {
    console.error('Error seeding classes:', error);
    throw error;
  }
}

// Clear all classes function (for testing)
export async function clearClasses(): Promise<void> {
  try {
    console.log('Clearing all classes...');
    const allClasses = await classService.getAllClasses();

    for (const classItem of allClasses) {
      try {
        // Only delete classes that are not referenced
        await classService.deleteClass(classItem.id);
        console.log(`Deleted class: ${classItem.name}`);
      } catch (error: any) {
        console.error(`Error deleting class ${classItem.name}:`, error.message);
      }
    }

    console.log('Classes clearing completed!');
  } catch (error: any) {
    console.error('Error clearing classes:', error);
    throw error;
  }
}

// Export default seeder
export default seedClasses;