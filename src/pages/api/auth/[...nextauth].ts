import NextAuth from "next-auth/next"
import { authOptions } from "@/libs/auth"

export default NextAuth(authOptions)
