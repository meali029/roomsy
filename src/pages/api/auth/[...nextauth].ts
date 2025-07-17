// pages/api/auth/[...nextauth].ts
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import { authOptions } from "@/libs/auth"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-expect-error NextAuth v4 typing issue
  return NextAuth(req, res, authOptions)
}
