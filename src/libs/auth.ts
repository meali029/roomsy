// src/lib/auth.ts

import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/libs/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    // 🔐 Email + Password - Simplified for production
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // 1) Look up user in DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
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
            isBanned: true,
            banReason: true,
          },
        })
        if (!user || !user.password) return null

        // 2) Check if user is banned
        if (user.isBanned) {
          throw new Error(`Account banned: ${user.banReason || "Contact support for more information"}`)
        }

        // 3) Compare password
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        // 4) Return minimal, trusted user object for JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
    token.role = user.role
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
    session.user.role = token.role ?? "USER"
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
