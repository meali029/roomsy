// src/lib/auth.ts

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "@/libs/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // 🔐 Email + Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return user
      },
    }),

    // 🔐 Google OAuth (optional for now)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ token, session }: { token: any; session: any }) {
      if (token && session.user) {
        (session.user as { id?: string; role?: string; email?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string; email?: string }).role = token.role as string;
        (session.user as { id?: string; role?: string; email?: string }).email = token.email as string;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id
        token.role = (user as { id: string; role?: string }).role
      }
      return token
    },
  },

  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
