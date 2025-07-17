// src/lib/auth.ts

// import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "@/libs/prisma"

export const authOptions = {
  // Temporarily remove adapter to isolate database issues
  // adapter: PrismaAdapter(prisma),
  
  providers: [
    // 🔐 Email + Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) return null

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) return null

          return user
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      },
    }),

    // 🔐 Google OAuth (only if credentials are provided)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      try {
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      try {
        if (token) {
          session.user.id = token.id
          session.user.email = token.email
          session.user.name = token.name
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    },
  },

  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Disable debug in production
  
  // Add production-specific settings
  cookies: {
    secure: process.env.NODE_ENV === "production",
  },
}
