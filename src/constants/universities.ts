// src/constants/universities.ts

export interface University {
  id: string
  name: string
  fullName: string
  city: string
  province: string
  type: 'public' | 'private'
  popular: boolean
}

export const universities: University[] = [
  // Islamabad/Federal
  {
    id: 'nust',
    name: 'NUST',
    fullName: 'National University of Sciences and Technology',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    popular: true
  },
  {
    id: 'qau',
    name: 'QAU',
    fullName: 'Quaid-i-Azam University',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    popular: true
  },
  {
    id: 'comsats-islamabad',
    name: 'COMSATS',
    fullName: 'COMSATS University Islamabad',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    popular: true
  },
  {
    id: 'iiui',
    name: 'IIUI',
    fullName: 'International Islamic University Islamabad',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    popular: true
  },
  {
    id: 'ndu',
    name: 'NDU',
    fullName: 'National Defence University',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    popular: false
  },
  {
    id: 'air-university',
    name: 'AIR University',
    fullName: 'Air University',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    popular: true
  },

  // Punjab - Lahore
  {
    id: 'pu',
    name: 'PU',
    fullName: 'University of the Punjab',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    popular: true
  },
  {
    id: 'uet-lahore',
    name: 'UET Lahore',
    fullName: 'University of Engineering and Technology Lahore',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    popular: true
  },
  {
    id: 'lums',
    name: 'LUMS',
    fullName: 'Lahore University of Management Sciences',
    city: 'Lahore',
    province: 'Punjab',
    type: 'private',
    popular: true
  },
  {
    id: 'ucp',
    name: 'UCP',
    fullName: 'University of Central Punjab',
    city: 'Lahore',
    province: 'Punjab',
    type: 'private',
    popular: true
  },
  {
    id: 'umt',
    name: 'UMT',
    fullName: 'University of Management and Technology',
    city: 'Lahore',
    province: 'Punjab',
    type: 'private',
    popular: true
  },
  {
    id: 'fast-lahore',
    name: 'FAST Lahore',
    fullName: 'FAST National University of Computer and Emerging Sciences',
    city: 'Lahore',
    province: 'Punjab',
    type: 'private',
    popular: true
  },
  {
    id: 'kemu',
    name: 'KEMU',
    fullName: 'King Edward Medical University',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    popular: true
  },

  // Punjab - Other Cities
  {
    id: 'uaf',
    name: 'UAF',
    fullName: 'University of Agriculture Faisalabad',
    city: 'Faisalabad',
    province: 'Punjab',
    type: 'public',
    popular: true
  },
  {
    id: 'uet-faisalabad',
    name: 'UET Faisalabad',
    fullName: 'University of Engineering and Technology Faisalabad',
    city: 'Faisalabad',
    province: 'Punjab',
    type: 'public',
    popular: true
  },
  {
    id: 'gcu-faisalabad',
    name: 'GCU Faisalabad',
    fullName: 'Government College University Faisalabad',
    city: 'Faisalabad',
    province: 'Punjab',
    type: 'public',
    popular: true
  },
  {
    id: 'bzu',
    name: 'BZU',
    fullName: 'Bahauddin Zakariya University',
    city: 'Multan',
    province: 'Punjab',
    type: 'public',
    popular: true
  },
  {
    id: 'iub',
    name: 'IUB',
    fullName: 'The Islamia University of Bahawalpur',
    city: 'Bahawalpur',
    province: 'Punjab',
    type: 'public',
    popular: true
  },
  {
    id: 'uos',
    name: 'UOS',
    fullName: 'University of Sargodha',
    city: 'Sargodha',
    province: 'Punjab',
    type: 'public',
    popular: true
  },
  {
    id: 'arid-university',
    name: 'ARID University',
    fullName: 'Pir Mehr Ali Shah Arid Agriculture University',
    city: 'Rawalpindi',
    province: 'Punjab',
    type: 'public',
    popular: true
  },

  // Sindh - Karachi
  {
    id: 'ku',
    name: 'KU',
    fullName: 'University of Karachi',
    city: 'Karachi',
    province: 'Sindh',
    type: 'public',
    popular: true
  },
  {
    id: 'ned',
    name: 'NED',
    fullName: 'NED University of Engineering and Technology',
    city: 'Karachi',
    province: 'Sindh',
    type: 'public',
    popular: true
  },
  {
    id: 'iba-karachi',
    name: 'IBA Karachi',
    fullName: 'Institute of Business Administration Karachi',
    city: 'Karachi',
    province: 'Sindh',
    type: 'public',
    popular: true
  },
  {
    id: 'duhs',
    name: 'DUHS',
    fullName: 'Dow University of Health Sciences',
    city: 'Karachi',
    province: 'Sindh',
    type: 'public',
    popular: true
  },
  {
    id: 'szabist',
    name: 'Szabist',
    fullName: 'Shaheed Zulfikar Ali Bhutto Institute of Science and Technology',
    city: 'Karachi',
    province: 'Sindh',
    type: 'private',
    popular: true
  },
  {
    id: 'iqra-university',
    name: 'Iqra University',
    fullName: 'Iqra University',
    city: 'Karachi',
    province: 'Sindh',
    type: 'private',
    popular: true
  },

  // Sindh - Other Cities
  {
    id: 'university-of-sindh',
    name: 'University of Sindh',
    fullName: 'University of Sindh Jamshoro',
    city: 'Hyderabad',
    province: 'Sindh',
    type: 'public',
    popular: true
  },
  {
    id: 'mehran-university',
    name: 'Mehran University',
    fullName: 'Mehran University of Engineering and Technology',
    city: 'Hyderabad',
    province: 'Sindh',
    type: 'public',
    popular: true
  },
  {
    id: 'sukkur-iba',
    name: 'Sukkur IBA',
    fullName: 'Sukkur Institute of Business Administration',
    city: 'Sukkur',
    province: 'Sindh',
    type: 'public',
    popular: true
  },

  // Khyber Pakhtunkhwa
  {
    id: 'university-of-peshawar',
    name: 'University of Peshawar',
    fullName: 'University of Peshawar',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    type: 'public',
    popular: true
  },
  {
    id: 'uet-peshawar',
    name: 'UET Peshawar',
    fullName: 'University of Engineering and Technology Peshawar',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    type: 'public',
    popular: true
  },
  {
    id: 'imsciences',
    name: 'IMSciences',
    fullName: 'Institute of Management Sciences',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    type: 'private',
    popular: true
  },
  {
    id: 'comsats-abbottabad',
    name: 'COMSATS Abbottabad',
    fullName: 'COMSATS University Abbottabad',
    city: 'Abbottabad',
    province: 'Khyber Pakhtunkhwa',
    type: 'public',
    popular: true
  },

  // Balochistan
  {
    id: 'university-of-balochistan',
    name: 'University of Balochistan',
    fullName: 'University of Balochistan',
    city: 'Quetta',
    province: 'Balochistan',
    type: 'public',
    popular: true
  },
  {
    id: 'buitems',
    name: 'BUITEMS',
    fullName: 'Balochistan University of Information Technology',
    city: 'Quetta',
    province: 'Balochistan',
    type: 'public',
    popular: true
  }
]

export const popularUniversities = universities.filter(uni => uni.popular)

export const getUniversitiesByCity = (city: string) => 
  universities.filter(uni => uni.city.toLowerCase() === city.toLowerCase())

export const getUniversitiesByProvince = (province: string) => 
  universities.filter(uni => uni.province === province)

export const searchUniversities = (query: string) => 
  universities.filter(uni => 
    uni.name.toLowerCase().includes(query.toLowerCase()) ||
    uni.fullName.toLowerCase().includes(query.toLowerCase()) ||
    uni.city.toLowerCase().includes(query.toLowerCase())
  )
