// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth"
import { authOptions } from "@/libs/auth"

// @ts-expect-error NextAuth v4 syntax compatibility
export default NextAuth(authOptions)
