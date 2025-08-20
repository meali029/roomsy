// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced database URL with connection pooling parameters
const getDatabaseUrl = () => {
  const baseUrl = process.env.DATABASE_URL
  if (!baseUrl) {
    throw new Error("DATABASE_URL is not defined")
  }
  
  // Add connection pool parameters if not already present
  if (baseUrl.includes('?')) {
    return `${baseUrl}&connection_limit=5&pool_timeout=10&connect_timeout=60`
  } else {
    return `${baseUrl}?connection_limit=5&pool_timeout=10&connect_timeout=60`
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : ["error"],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Helper function to safely disconnect from database
export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error("Error disconnecting from database:", error)
  }
}

// Ensure proper cleanup on process termination
if (typeof window === 'undefined') {
  process.on('beforeExit', () => {
    disconnectPrisma()
  })
  
  process.on('SIGINT', () => {
    disconnectPrisma()
    process.exit(0)
  })
  
  process.on('SIGTERM', () => {
    disconnectPrisma()
    process.exit(0)
  })
}
