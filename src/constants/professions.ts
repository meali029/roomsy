// src/constants/professions.ts

export interface Profession {
  id: string
  label: string
  category: string
  popular: boolean
}

export const professions: Profession[] = [
  // Students
  {
    id: 'undergraduate-student',
    label: 'Undergraduate Student',
    category: 'Student',
    popular: true
  },
  {
    id: 'graduate-student',
    label: 'Graduate Student',
    category: 'Student',
    popular: true
  },
  {
    id: 'phd-student',
    label: 'PhD Student',
    category: 'Student',
    popular: true
  },
  {
    id: 'medical-student',
    label: 'Medical Student',
    category: 'Student',
    popular: true
  },
  {
    id: 'engineering-student',
    label: 'Engineering Student',
    category: 'Student',
    popular: true
  },
  {
    id: 'business-student',
    label: 'Business Student',
    category: 'Student',
    popular: true
  },

  // Technology
  {
    id: 'software-engineer',
    label: 'Software Engineer',
    category: 'Technology',
    popular: true
  },
  {
    id: 'web-developer',
    label: 'Web Developer',
    category: 'Technology',
    popular: true
  },
  {
    id: 'data-scientist',
    label: 'Data Scientist',
    category: 'Technology',
    popular: true
  },
  {
    id: 'ui-ux-designer',
    label: 'UI/UX Designer',
    category: 'Technology',
    popular: true
  },
  {
    id: 'product-manager',
    label: 'Product Manager',
    category: 'Technology',
    popular: true
  },
  {
    id: 'cybersecurity-analyst',
    label: 'Cybersecurity Analyst',
    category: 'Technology',
    popular: false
  },
  {
    id: 'systems-administrator',
    label: 'Systems Administrator',
    category: 'Technology',
    popular: false
  },

  // Healthcare
  {
    id: 'doctor',
    label: 'Doctor',
    category: 'Healthcare',
    popular: true
  },
  {
    id: 'nurse',
    label: 'Nurse',
    category: 'Healthcare',
    popular: true
  },
  {
    id: 'pharmacist',
    label: 'Pharmacist',
    category: 'Healthcare',
    popular: true
  },
  {
    id: 'dentist',
    label: 'Dentist',
    category: 'Healthcare',
    popular: true
  },
  {
    id: 'physiotherapist',
    label: 'Physiotherapist',
    category: 'Healthcare',
    popular: false
  },
  {
    id: 'medical-technician',
    label: 'Medical Technician',
    category: 'Healthcare',
    popular: false
  },

  // Business & Finance
  {
    id: 'accountant',
    label: 'Accountant',
    category: 'Business & Finance',
    popular: true
  },
  {
    id: 'financial-analyst',
    label: 'Financial Analyst',
    category: 'Business & Finance',
    popular: true
  },
  {
    id: 'marketing-manager',
    label: 'Marketing Manager',
    category: 'Business & Finance',
    popular: true
  },
  {
    id: 'sales-manager',
    label: 'Sales Manager',
    category: 'Business & Finance',
    popular: true
  },
  {
    id: 'business-analyst',
    label: 'Business Analyst',
    category: 'Business & Finance',
    popular: true
  },
  {
    id: 'hr-manager',
    label: 'HR Manager',
    category: 'Business & Finance',
    popular: false
  },
  {
    id: 'consultant',
    label: 'Consultant',
    category: 'Business & Finance',
    popular: false
  },

  // Education
  {
    id: 'teacher',
    label: 'Teacher',
    category: 'Education',
    popular: true
  },
  {
    id: 'professor',
    label: 'Professor',
    category: 'Education',
    popular: true
  },
  {
    id: 'research-assistant',
    label: 'Research Assistant',
    category: 'Education',
    popular: true
  },
  {
    id: 'lecturer',
    label: 'Lecturer',
    category: 'Education',
    popular: true
  },
  {
    id: 'tutor',
    label: 'Tutor',
    category: 'Education',
    popular: false
  },

  // Engineering
  {
    id: 'civil-engineer',
    label: 'Civil Engineer',
    category: 'Engineering',
    popular: true
  },
  {
    id: 'mechanical-engineer',
    label: 'Mechanical Engineer',
    category: 'Engineering',
    popular: true
  },
  {
    id: 'electrical-engineer',
    label: 'Electrical Engineer',
    category: 'Engineering',
    popular: true
  },
  {
    id: 'chemical-engineer',
    label: 'Chemical Engineer',
    category: 'Engineering',
    popular: false
  },
  {
    id: 'architect',
    label: 'Architect',
    category: 'Engineering',
    popular: true
  },

  // Creative & Media
  {
    id: 'graphic-designer',
    label: 'Graphic Designer',
    category: 'Creative & Media',
    popular: true
  },
  {
    id: 'photographer',
    label: 'Photographer',
    category: 'Creative & Media',
    popular: false
  },
  {
    id: 'content-writer',
    label: 'Content Writer',
    category: 'Creative & Media',
    popular: true
  },
  {
    id: 'journalist',
    label: 'Journalist',
    category: 'Creative & Media',
    popular: false
  },
  {
    id: 'video-editor',
    label: 'Video Editor',
    category: 'Creative & Media',
    popular: false
  },

  // Government & Public Service
  {
    id: 'civil-servant',
    label: 'Civil Servant',
    category: 'Government',
    popular: true
  },
  {
    id: 'police-officer',
    label: 'Police Officer',
    category: 'Government',
    popular: false
  },
  {
    id: 'military-officer',
    label: 'Military Officer',
    category: 'Government',
    popular: false
  },

  // Service Industry
  {
    id: 'chef',
    label: 'Chef',
    category: 'Service',
    popular: false
  },
  {
    id: 'customer-service',
    label: 'Customer Service Representative',
    category: 'Service',
    popular: true
  },
  {
    id: 'retail-manager',
    label: 'Retail Manager',
    category: 'Service',
    popular: false
  },

  // Freelancer/Self-Employed
  {
    id: 'freelancer',
    label: 'Freelancer',
    category: 'Self-Employed',
    popular: true
  },
  {
    id: 'entrepreneur',
    label: 'Entrepreneur',
    category: 'Self-Employed',
    popular: true
  },
  {
    id: 'self-employed',
    label: 'Self-Employed',
    category: 'Self-Employed',
    popular: true
  },

  // Other
  {
    id: 'unemployed',
    label: 'Unemployed',
    category: 'Other',
    popular: false
  },
  {
    id: 'retired',
    label: 'Retired',
    category: 'Other',
    popular: false
  },
  {
    id: 'homemaker',
    label: 'Homemaker',
    category: 'Other',
    popular: false
  },
  {
    id: 'other',
    label: 'Other',
    category: 'Other',
    popular: false
  }
]

export const professionCategories = [
  'Student',
  'Technology',
  'Healthcare',
  'Business & Finance',
  'Education',
  'Engineering',
  'Creative & Media',
  'Government',
  'Service',
  'Self-Employed',
  'Other'
]

export const popularProfessions = professions.filter(prof => prof.popular)

export const getProfessionsByCategory = (category: string) => 
  professions.filter(prof => prof.category === category)

export const searchProfessions = (query: string) => 
  professions.filter(prof => 
    prof.label.toLowerCase().includes(query.toLowerCase()) ||
    prof.category.toLowerCase().includes(query.toLowerCase())
  )

export const getProfessionById = (id: string) => 
  professions.find(prof => prof.id === id)
