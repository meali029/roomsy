import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const diagnostics = {
      nodeEnv: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      timestamp: new Date().toISOString(),
    }

    return res.status(200).json(diagnostics)
  } catch (error) {
    console.error("Diagnostics error:", error)
    return res.status(500).json({ 
      error: "Failed to get diagnostics",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
