import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const { id } = req.query
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid review ID" })
    }

    if (req.method === "PATCH") {
      // This endpoint is disabled since status field doesn't exist in the database
      return res.status(404).json({ message: "Not found" })
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error: unknown) {
    console.error("Admin review reject API error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
