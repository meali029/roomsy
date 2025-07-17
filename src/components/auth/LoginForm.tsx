"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import AuthInput from "./AuthInput"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Clear previous errors

    console.log("Login attempt:", { email, passwordLength: password.length })

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("SignIn response:", res)

      if (res?.error) {
        console.error("SignIn error:", res.error)
        setError("Invalid email or password")
      } else if (res?.ok) {
        console.log("Login successful, redirecting...")
        router.push("/dashboard")
      } else {
        console.error("Unexpected response:", res)
        setError("Login failed. Please try again.")
      }
    } catch (error) {
      console.error("Login exception:", error)
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <AuthInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <AuthInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Login
      </button>
    </form>
  )
}
