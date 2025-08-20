// src/pages/api/auth/register.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/libs/prisma"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

// Retry function for database operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: unknown) {
      if (attempt === maxRetries) throw error
      
      // Only retry on connection/timeout errors
      const err = error as { code?: string; message?: string }
      if (err.code === 'P2024' || err.message?.includes('connection') || err.message?.includes('timeout')) {
        console.log(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying...`)
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      } else {
        throw error
      }
    }
  }
  throw new Error("Max retries exceeded")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    // Check for existing user with retry logic
    const existingUser = await retryOperation(async () => {
      return await prisma.user.findUnique({ where: { email } })
    })

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with retry logic
    await retryOperation(async () => {
      return await prisma.user.create({
        data: {
          id: randomUUID(),
          name,
          email,
          password: hashedPassword,
          role: "USER", // default role
          gender: "",   // will be updated later in profile
          city: "",
          isVerified: false,
          privateProfile: false,
        },
      })
    })

    return res.status(201).json({ message: "User registered successfully" })
  } catch (error: unknown) {
    console.error("❌ Registration Error:", error)
    
    // Provide more specific error messages
    const err = error as { code?: string; message?: string }
    if (err.code === 'P2024') {
      return res.status(503).json({ message: "Database connection timeout. Please try again." })
    } else if (err.message?.includes('connection')) {
      return res.status(503).json({ message: "Database connection error. Please try again." })
    }
    
    return res.status(500).json({ message: "Something went wrong" })
  }
}
