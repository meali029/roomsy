// src/pages/api/auth/register.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/libs/prisma"
import bcrypt from "bcryptjs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
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

    return res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("❌ Registration Error:", error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}
