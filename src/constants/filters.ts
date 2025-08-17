// src/constants/filters.ts

export interface Filter {
  id: string
  label: string
  type: 'select' | 'range' | 'checkbox' | 'radio'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
  defaultValue?: string | number | string[] | boolean
}

export interface FilterOption {
  id: string
  label: string
  value: string | number
  icon?: string
}

// Price Range Options
export const priceRanges: FilterOption[] = [
  { id: 'under-10k', label: 'Under Rs. 10,000', value: '0-10000' },
  { id: '10k-15k', label: 'Rs. 10,000 - 15,000', value: '10000-15000' },
  { id: '15k-20k', label: 'Rs. 15,000 - 20,000', value: '15000-20000' },
  { id: '20k-25k', label: 'Rs. 20,000 - 25,000', value: '20000-25000' },
  { id: '25k-30k', label: 'Rs. 25,000 - 30,000', value: '25000-30000' },
  { id: '30k-40k', label: 'Rs. 30,000 - 40,000', value: '30000-40000' },
  { id: '40k-50k', label: 'Rs. 40,000 - 50,000', value: '40000-50000' },
  { id: 'above-50k', label: 'Above Rs. 50,000', value: '50000-999999' }
]

// Room Types
export const roomTypes: FilterOption[] = [
  { id: 'single', label: 'Single Room', value: 'single', icon: '🛏️' },
  { id: 'shared', label: 'Shared Room', value: 'shared', icon: '👥' },
  { id: 'private', label: 'Private Room', value: 'private', icon: '🚪' },
  { id: 'studio', label: 'Studio Apartment', value: 'studio', icon: '🏠' },
  { id: 'full-apartment', label: 'Full Apartment', value: 'apartment', icon: '🏢' }
]

// Property Types
export const propertyTypes: FilterOption[] = [
  { id: 'apartment', label: 'Apartment', value: 'apartment', icon: '🏢' },
  { id: 'house', label: 'House', value: 'house', icon: '🏠' },
  { id: 'hostel', label: 'Hostel', value: 'hostel', icon: '🏨' },
  { id: 'pg', label: 'Paying Guest', value: 'pg', icon: '🏡' },
  { id: 'villa', label: 'Villa', value: 'villa', icon: '🏘️' },
  { id: 'shared-house', label: 'Shared House', value: 'shared-house', icon: '🏚️' }
]

// Amenities
export const amenities: FilterOption[] = [
  { id: 'wifi', label: 'WiFi', value: 'wifi', icon: '📶' },
  { id: 'ac', label: 'Air Conditioning', value: 'ac', icon: '❄️' },
  { id: 'heater', label: 'Heater', value: 'heater', icon: '🔥' },
  { id: 'kitchen', label: 'Kitchen Access', value: 'kitchen', icon: '🍳' },
  { id: 'laundry', label: 'Laundry', value: 'laundry', icon: '👕' },
  { id: 'parking', label: 'Parking', value: 'parking', icon: '🚗' },
  { id: 'security', label: 'Security', value: 'security', icon: '🔒' },
  { id: 'gym', label: 'Gym', value: 'gym', icon: '💪' },
  { id: 'elevator', label: 'Elevator', value: 'elevator', icon: '⬆️' },
  { id: 'balcony', label: 'Balcony', value: 'balcony', icon: '🌅' },
  { id: 'furnished', label: 'Furnished', value: 'furnished', icon: '🛋️' },
  { id: 'study-room', label: 'Study Room', value: 'study-room', icon: '📚' },
  { id: 'garden', label: 'Garden', value: 'garden', icon: '🌱' },
  { id: 'rooftop', label: 'Rooftop Access', value: 'rooftop', icon: '🏠' }
]

// Proximity Filters
export const proximityOptions: FilterOption[] = [
  { id: 'walking', label: 'Walking Distance (0-1 km)', value: '0-1' },
  { id: 'nearby', label: 'Nearby (1-3 km)', value: '1-3' },
  { id: 'reachable', label: 'Reachable (3-5 km)', value: '3-5' },
  { id: 'far', label: 'Further Away (5+ km)', value: '5-999' }
]

// Lifestyle Preferences
export const lifestylePreferences: FilterOption[] = [
  { id: 'non-smoker', label: 'Non-Smoker', value: 'non-smoker', icon: '🚭' },
  { id: 'vegetarian', label: 'Vegetarian', value: 'vegetarian', icon: '🥬' },
  { id: 'pet-friendly', label: 'Pet Friendly', value: 'pet-friendly', icon: '🐕' },
  { id: 'quiet', label: 'Quiet Environment', value: 'quiet', icon: '🤫' },
  { id: 'social', label: 'Social Environment', value: 'social', icon: '🎉' },
  { id: 'early-riser', label: 'Early Riser', value: 'early-riser', icon: '🌅' },
  { id: 'night-owl', label: 'Night Owl', value: 'night-owl', icon: '🌙' },
  { id: 'clean', label: 'Clean & Organized', value: 'clean', icon: '✨' }
]

// Sort Options
export const sortOptions: FilterOption[] = [
  { id: 'newest', label: 'Newest First', value: 'created_desc' },
  { id: 'oldest', label: 'Oldest First', value: 'created_asc' },
  { id: 'price-low', label: 'Price: Low to High', value: 'price_asc' },
  { id: 'price-high', label: 'Price: High to Low', value: 'price_desc' },
  { id: 'distance', label: 'Distance', value: 'distance_asc' },
  { id: 'popularity', label: 'Most Popular', value: 'views_desc' }
]

// Complete Filter Configuration
export const listingFilters: Filter[] = [
  {
    id: 'city',
    label: 'City',
    type: 'select',
    defaultValue: ''
  },
  {
    id: 'price-range',
    label: 'Price Range',
    type: 'select',
    options: priceRanges,
    defaultValue: ''
  },
  {
    id: 'room-type',
    label: 'Room Type',
    type: 'radio',
    options: roomTypes,
    defaultValue: ''
  },
  {
    id: 'property-type',
    label: 'Property Type',
    type: 'select',
    options: propertyTypes,
    defaultValue: ''
  },
  {
    id: 'gender-preference',
    label: 'Gender Preference',
    type: 'radio',
    defaultValue: 'any'
  },
  {
    id: 'amenities',
    label: 'Amenities',
    type: 'checkbox',
    options: amenities,
    defaultValue: []
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle Preferences',
    type: 'checkbox',
    options: lifestylePreferences,
    defaultValue: []
  },
  {
    id: 'university-proximity',
    label: 'Distance from University',
    type: 'select',
    options: proximityOptions,
    defaultValue: ''
  },
  {
    id: 'sort',
    label: 'Sort By',
    type: 'select',
    options: sortOptions,
    defaultValue: 'newest'
  }
]

// Helper Functions
export const getFilterById = (id: string) => 
  listingFilters.find(filter => filter.id === id)

export const getFilterOptions = (filterId: string) => {
  const filter = getFilterById(filterId)
  return filter?.options || []
}

export const parseFilterValue = (filterId: string, value: string) => {
  const filter = getFilterById(filterId)
  
  if (filter?.type === 'checkbox') {
    return value.split(',').filter(v => v.length > 0)
  }
  
  if (filterId === 'price-range' && value.includes('-')) {
    const [min, max] = value.split('-').map(Number)
    return { min, max }
  }
  
  return value
}

export const buildFilterQuery = (filters: Record<string, string | number | string[] | boolean>) => {
  const query: Record<string, string | number | string[] | boolean> = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
      query[key] = value
    }
  })
  
  return query
}
