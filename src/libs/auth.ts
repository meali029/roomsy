// src/lib/auth.ts

import CredentialsProvider from "next-auth/providers/credentials"

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
        // Simplified auth for production debugging
        if (!credentials?.email || !credentials?.password) return null
        
        // Mock user for testing - replace with actual DB check later
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          return {
            id: "1",
            email: credentials.email,
            name: "Test User"
          }
        }
        
        return null
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
