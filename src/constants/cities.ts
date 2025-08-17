// src/constants/cities.ts

export interface City {
  id: string
  name: string
  province: string
  popular: boolean
  universities: string[]
}

export const cities: City[] = [
  // Punjab - Major Cities
  {
    id: 'lahore',
    name: 'Lahore',
    province: 'Punjab',
    popular: true,
    universities: ['UET Lahore', 'PU', 'LUMS', 'UCP', 'UMT', 'FAST Lahore']
  },
  {
    id: 'faisalabad',
    name: 'Faisalabad',
    province: 'Punjab',
    popular: true,
    universities: ['UAF', 'UET Faisalabad', 'GCU Faisalabad']
  },
  {
    id: 'rawalpindi',
    name: 'Rawalpindi',
    province: 'Punjab',
    popular: true,
    universities: ['ARID University', 'UET Taxila', 'CMH Medical College']
  },
  {
    id: 'multan',
    name: 'Multan',
    province: 'Punjab',
    popular: true,
    universities: ['BZU', 'UMT Multan', 'Women University Multan']
  },
  {
    id: 'gujranwala',
    name: 'Gujranwala',
    province: 'Punjab',
    popular: false,
    universities: ['UET Gujranwala', 'GCU Gujranwala']
  },
  {
    id: 'sialkot',
    name: 'Sialkot',
    province: 'Punjab',
    popular: false,
    universities: ['University of Sialkot', 'GCU Sialkot']
  },
  {
    id: 'bahawalpur',
    name: 'Bahawalpur',
    province: 'Punjab',
    popular: false,
    universities: ['IUB', 'University of Bahawalpur']
  },
  {
    id: 'sargodha',
    name: 'Sargodha',
    province: 'Punjab',
    popular: false,
    universities: ['UOS', 'University of Sargodha']
  },

  // Sindh
  {
    id: 'karachi',
    name: 'Karachi',
    province: 'Sindh',
    popular: true,
    universities: ['KU', 'NED', 'IBA Karachi', 'DUHS', 'Szabist', 'Iqra University']
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    province: 'Sindh',
    popular: true,
    universities: ['University of Sindh', 'LUMHS', 'Mehran University']
  },
  {
    id: 'sukkur',
    name: 'Sukkur',
    province: 'Sindh',
    popular: false,
    universities: ['Sukkur IBA', 'Shah Abdul Latif University']
  },
  {
    id: 'larkana',
    name: 'Larkana',
    province: 'Sindh',
    popular: false,
    universities: ['Shah Abdul Latif University']
  },

  // Khyber Pakhtunkhwa
  {
    id: 'peshawar',
    name: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    popular: true,
    universities: ['University of Peshawar', 'UET Peshawar', 'IMSciences']
  },
  {
    id: 'mardan',
    name: 'Mardan',
    province: 'Khyber Pakhtunkhwa',
    popular: false,
    universities: ['Abdul Wali Khan University']
  },
  {
    id: 'abbottabad',
    name: 'Abbottabad',
    province: 'Khyber Pakhtunkhwa',
    popular: false,
    universities: ['COMSATS Abbottabad', 'University of Haripur']
  },

  // Balochistan
  {
    id: 'quetta',
    name: 'Quetta',
    province: 'Balochistan',
    popular: true,
    universities: ['University of Balochistan', 'BUITEMS']
  },

  // Federal Areas
  {
    id: 'islamabad',
    name: 'Islamabad',
    province: 'Federal',
    popular: true,
    universities: ['NUST', 'QAU', 'COMSATS', 'IIU', 'IIUI', 'NDU', 'AIR University']
  }
]

export const popularCities = cities.filter(city => city.popular)

export const getCitiesByProvince = (province: string) => 
  cities.filter(city => city.province === province)

export const searchCities = (query: string) => 
  cities.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase()) ||
    city.province.toLowerCase().includes(query.toLowerCase())
  )
