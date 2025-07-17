import NextAuth from "next-auth"
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/libs/auth"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-expect-error NextAuth v4 handler compatibility
  return NextAuth(req, res, authOptions)
}
