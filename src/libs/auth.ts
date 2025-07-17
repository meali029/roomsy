// src/lib/auth.ts

import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/libs/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  // Note: Prisma adapter doesn't work with Credentials provider for database sessions
  // We'll use JWT sessions but still connect to database for user validation
  providers: [
    // 🔐 Email + Password with database validation
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials:", { email: !!credentials?.email, password: !!credentials?.password })
          return null
        }
        
        console.log("Auth attempt:", { email: credentials.email })
        
        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })
          
          if (!user) {
            console.log("User not found")
            return null
          }
          
          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValidPassword) {
            console.log("Invalid password")
            return null
          }
          
          console.log("Auth successful:", { id: user.id, email: user.email, name: user.name })
          return {
            id: user.id,
            email: user.email,
            name: user.name
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
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
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
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
