// Application constants

export const APP_CONFIG = {
  name: 'EducatedPlanet',
  domain: 'educatedplanet.net',
  description: 'Local Tutor Listing Platform'
} as const;

export const LOCATIONS = {
  BHUBANESWAR: [
    'Patia',
    'Old Town',
    'Saheed Nagar',
    'Nayapalli',
    'Khandagiri',
    'Unit-1',
    'Unit-2',
    'Unit-3',
    'Unit-4',
    'Unit-6',
    'Unit-8',
    'Rasulgarh',
    'Baramunda'
  ],
  DEFAULT_CITY: 'Bhubaneswar',
  DEFAULT_STATE: 'Odisha'
} as const;

export const SUBJECTS = {
  ACADEMIC: [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Hindi',
    'Odia',
    'Computer Science',
    'History',
    'Geography',
    'Civics',
    'Economics'
  ],
  PROFESSIONAL: [
    'Programming',
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Digital Marketing',
    'Graphic Design',
    'Music',
    'Art',
    'Yoga',
    'Dance'
  ]
} as const;

export const CLASS_LEVELS = [
  'Class 1-5',
  'Class 6-8',
  'Class 9-10',
  'Class 11-12',
  'Graduation',
  'Post Graduation',
  'Professional'
] as const;

export const USER_ROLES = {
  USER: 'user',
  TUTOR: 'tutor',
  ADMIN: 'admin'
} as const;

export const TEACHING_MODES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  BOTH: 'both'
} as const;