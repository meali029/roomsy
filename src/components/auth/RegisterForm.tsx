"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import RoomsyLoader from "../shared/RoomsyLoader"
import { MotionDiv } from "../shared/MotionWrapper"
import { Mail, Lock, User, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Reset form state when component mounts (for navigation between pages)
  useEffect(() => {
    setFormData({ name: "", email: "", password: "" })
    setError("")
    setLoading(false)
    setSuccess(false)
    setShowPassword(false)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("") // Clear error when user starts typing
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return // Prevent multiple submissions
    
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        const { message } = await res.json()
        setError(message || "Something went wrong")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="glass-mint p-8  rounded-2xl shadow-deep-teal backdrop-blur-xl text-center">
        <MotionDiv direction="up">
          <div className="w-16 h-16 bg-soft-sage rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-4">Account Created!</h2>
          <p className="text-black/70 text-lg mb-6">
            Welcome to Roomsy! Redirecting you to login...
          </p>
          <div className="flex justify-center">
            <RoomsyLoader size="sm" showText={false} />
          </div>
        </MotionDiv>
      </div>
    )
  }

  return (
    <div className="glass-mint p-3 lg:p-4 rounded-2xl shadow-deep-teal backdrop-blur-xl max-w-md w-full">
      <MotionDiv direction="up" className="text-center mb-4">
        <div className="w-9 h-9 bg-deep-teal rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-soft">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-black mb-1">Join Roomsy</h2>
        <p className="text-black/70 text-sm lg:text-base">Create your account to get started</p>
      </MotionDiv>

      {error && (
        <MotionDiv direction="up" className="glass-mint border-2 border-red-300/50 rounded-xl p-2 mb-3">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        </MotionDiv>
      )}

      <form onSubmit={handleRegister} className="space-y-3">
        <MotionDiv direction="up" delay={0.1}>
          <div className="relative">
            <label className="block text-xs font-semibold text-black mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-black/50" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full pl-10 pr-4 py-1.5 lg:py-2 bg-white/80 border-2 border-transparent rounded-xl focus:border-deep-teal focus:bg-white transition-all duration-300 text-black placeholder-black/50 shadow-inner text-sm"
              />
            </div>
          </div>
        </MotionDiv>

        <MotionDiv direction="up" delay={0.2}>
          <div className="relative">
            <label className="block text-xs font-semibold text-black mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-4 py-1.5 lg:py-2 bg-white/80 border-2 border-transparent rounded-xl focus:border-deep-teal focus:bg-white transition-all duration-300 text-black placeholder-black/50 shadow-inner text-sm"
              />
            </div>
          </div>
        </MotionDiv>

        <MotionDiv direction="up" delay={0.3}>
          <div className="relative">
            <label className="block text-xs font-semibold text-black mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                className="w-full pl-10 pr-10 py-1.5 lg:py-2 bg-white/80 border-2 border-transparent rounded-xl focus:border-deep-teal focus:bg-white transition-all duration-300 text-black placeholder-black/50 shadow-inner text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-1 text-xs text-black/60">
              Password should be at least 8 characters long
            </div>
          </div>
        </MotionDiv>

        <MotionDiv direction="up" delay={0.4}>
          <label className="flex items-start space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              required
              className="w-3 h-3 text-deep-teal rounded border-2 border-black/20 mt-0.5" 
            />
            <span className="text-xs text-black/70 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-deep-teal hover:text-rich-green font-medium transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-deep-teal hover:text-rich-green font-medium transition-colors">
                Privacy Policy
              </Link>
            </span>
          </label>
        </MotionDiv>

        <MotionDiv direction="up" delay={0.5}>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-deep-teal hover:bg-rich-green text-white font-semibold py-1.5 lg:py-2 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RoomsyLoader size="sm" showText={false} />
                <span className="ml-2">Creating Account...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Account
              </span>
            )}
          </button>
        </MotionDiv>
      </form>

      <div  className="mt-4 pt-3 border-t border-black/10 text-center">
        <p className="text-black/70 mb-2 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-deep-teal font-semibold hover:text-rich-green transition-colors">
            Sign in here
          </Link>
        </p>
        
        <div className="flex items-center justify-center space-x-3 text-xs text-black/50">
          <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/support" className="hover:text-black transition-colors">Support</Link>
        </div>
      </div>
    </div>
  )
}
