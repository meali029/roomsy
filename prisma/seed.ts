import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      gender: 'Male',
      city: 'Lahore',
      university: 'University of Punjab',
      profession: 'Student',
      isVerified: true,
    },
  })

  console.log('👤 Created user:', user.email)

  // Create some sample listings
  const listing1 = await prisma.listing.upsert({
    where: { id: 'sample-listing-1' },
    update: {},
    create: {
      id: 'sample-listing-1',
      title: 'Spacious Room in DHA',
      description: 'Beautiful room in a peaceful area of DHA Lahore with all amenities.',
      rent: 25000,
      city: 'Lahore',
      location: 'DHA Phase 5',
      genderPreference: 'Male',
      availableFrom: new Date('2024-02-01'),
      availableMonths: 12,
      imageUrls: ['/assets/roomsy-hero.png'],
      userId: user.id,
    },
  })

  const listing2 = await prisma.listing.upsert({
    where: { id: 'sample-listing-2' },
    update: {},
    create: {
      id: 'sample-listing-2',
      title: 'Affordable Room near University',
      description: 'Budget-friendly accommodation near major universities.',
      rent: 15000,
      city: 'Lahore',
      location: 'Johar Town',
      genderPreference: 'Any',
      availableFrom: new Date('2024-02-15'),
      availableMonths: 6,
      imageUrls: ['/assets/roomsy-hero.png'],
      userId: user.id,
    },
  })

  console.log('🏠 Created listings:', listing1.title, 'and', listing2.title)
  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })