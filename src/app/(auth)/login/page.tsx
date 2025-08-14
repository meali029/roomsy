// src/app/(auth)/login/page.tsx

"use client"

import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-xl shadow-md">
        <LoginForm />

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
