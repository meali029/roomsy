import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Get user verification status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        isVerified: true,
        VerificationRequest: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            cnicUrl: true,
          }
        }
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const verificationData = {
      isVerified: user.isVerified,
      hasSubmittedRequest: !!user.VerificationRequest,
      requestStatus: user.VerificationRequest?.status || null,
      submittedAt: user.VerificationRequest?.createdAt || null,
      canResubmit: !user.isVerified && (!user.VerificationRequest || user.VerificationRequest.status === "REJECTED")
    }

    return res.status(200).json({ verification: verificationData })
  } catch (error) {
    console.error("Verification status API error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
