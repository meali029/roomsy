// src/app/(auth)/register/page.tsx

import RegisterForm from "@/components/auth/RegisterForm"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-xl shadow-md">
        <RegisterForm />

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
