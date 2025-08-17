// src/constants/genders.ts

export interface Gender {
  id: string
  label: string
  value: string
  icon?: string
}

export const genders: Gender[] = [
  {
    id: 'male',
    label: 'Male',
    value: 'male',
    icon: '👨'
  },
  {
    id: 'female',
    label: 'Female',
    value: 'female',
    icon: '👩'
  },
  {
    id: 'any',
    label: 'Any',
    value: 'any',
    icon: '👥'
  }
]

export const roommatePrefGenders: Gender[] = [
  {
    id: 'male-only',
    label: 'Male Only',
    value: 'male',
    icon: '👨'
  },
  {
    id: 'female-only',
    label: 'Female Only',
    value: 'female',
    icon: '👩'
  },
  {
    id: 'mixed',
    label: 'Mixed Gender',
    value: 'mixed',
    icon: '👥'
  },
  {
    id: 'no-preference',
    label: 'No Preference',
    value: 'any',
    icon: '🤝'
  }
]

export const getGenderById = (id: string) => 
  genders.find(gender => gender.id === id)

export const getGenderByValue = (value: string) => 
  genders.find(gender => gender.value === value)
