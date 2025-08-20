import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import { Prisma } from "@prisma/client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { name, gender, budget, city, university, profession, privateProfile } = req.body

    // Validate required fields
    if (!name || !gender || !city) {
      return res.status(400).json({ message: "Name, gender, and city are required" })
    }

    // Validate budget if provided
    if (budget && (isNaN(budget) || budget < 0)) {
      return res.status(400).json({ message: "Budget must be a positive number" })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        gender,
        budget: budget ? parseInt(budget) : null,
        city,
        university: university?.trim() || null,
        profession: profession?.trim() || null,
        privateProfile: Boolean(privateProfile),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        budget: true,
        city: true,
        university: true,
        profession: true,
        profilePicture: true,
        isVerified: true,
        privateProfile: true,
        createdAt: true,
      },
    })

    return res.status(200).json({ user: updatedUser, message: "Profile updated successfully" })
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      err.code === "P1001" ||
      /Can't reach database server/i.test(err.message || "")
    ) {
      return res.status(503).json({ message: "Database unavailable. Please try again shortly." })
    }
    console.error("Update profile API error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
