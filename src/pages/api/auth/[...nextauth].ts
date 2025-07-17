import NextAuth from "next-auth"
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/libs/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // @ts-expect-error NextAuth v4 typing compatibility
    return await NextAuth(req, res, authOptions)
  } catch (error) {
    console.error("NextAuth handler error:", error)
    
    // Return proper JSON error response
    return res.status(500).json({ 
      error: "Authentication service error",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    })
  }
}
