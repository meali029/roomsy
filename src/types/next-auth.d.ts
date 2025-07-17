declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "USER" | "ADMIN"
    }
  }

  interface User {
    role: "USER" | "ADMIN"
  }
}
