"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthInput from "./AuthInput"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        router.push("/login")
      } else {
        const { message } = await res.json()
        setError(message || "Something went wrong")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Network error")
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <AuthInput
        label="Full Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <AuthInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <AuthInput
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Register
      </button>
    </form>
  )
}
