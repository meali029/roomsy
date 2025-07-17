import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: "USER" | "ADMIN"
    }
  }

  interface User {
    role: "USER" | "ADMIN"
  }
}
