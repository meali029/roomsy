"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import RoomsyLoader from "../shared/RoomsyLoader"
import { MotionDiv } from "../shared/MotionWrapper"
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Reset form state when component mounts (for navigation between pages)
  useEffect(() => {
    setEmail("")
    setPassword("")
    setError("")
    setLoading(false)
    setShowPassword(false)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return // Prevent multiple submissions
    
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password")
      } else {
        // Small delay to show success state
        setTimeout(() => {
          router.push("/dashboard/profile")
        }, 500)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (error) setError("")
  }

  return (
    <div className="glass-mint p-4 lg:p-6 rounded-2xl shadow-deep-teal backdrop-blur-xl max-w-md w-full">
      <MotionDiv direction="up" className="text-center mb-4">
        <div className="w-12 h-12 bg-rich-green rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-soft">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-black mb-1">Welcome Back!</h2>
        <p className="text-black/70 text-sm lg:text-base">Sign in to continue your journey</p>
      </MotionDiv>

      {error && (
        <MotionDiv direction="up" className="glass-mint border-2 border-red-300/50 rounded-xl p-2 mb-3">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        </MotionDiv>
      )}

      <form onSubmit={handleLogin} className="space-y-3">
        <MotionDiv direction="up" delay={0.1}>
          <div className="relative">
            <label className="block text-xs font-semibold text-black mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-4 py-2.5 lg:py-3 bg-white/80 border-2 border-transparent rounded-xl focus:border-rich-green focus:bg-white transition-all duration-300 text-black placeholder-black/50 shadow-inner text-sm"
              />
            </div>
          </div>
        </MotionDiv>

        <MotionDiv direction="up" delay={0.2}>
          <div className="relative">
            <label className="block text-xs font-semibold text-black mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-10 py-2.5 lg:py-3 bg-white/80 border-2 border-transparent rounded-xl focus:border-rich-green focus:bg-white transition-all duration-300 text-black placeholder-black/50 shadow-inner text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </MotionDiv>

        <MotionDiv direction="up" delay={0.3}>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-3 h-3 text-rich-green rounded border-2 border-black/20" />
              <span className="text-black/70">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-rich-green hover:text-forest-teal font-medium transition-colors">
              Forgot password?
            </Link>
          </div>
        </MotionDiv>

        <MotionDiv direction="up" delay={0.4}>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rich-green hover:bg-forest-teal text-white font-semibold py-2.5 lg:py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RoomsyLoader size="sm" showText={false} />
                <span className="ml-2">Signing In...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Sign In
              </span>
            )}
          </button>
        </MotionDiv>
      </form>

      <MotionDiv direction="up" delay={0.5} className="mt-4 pt-3 border-t border-black/10 text-center">
        <p className="text-black/70 mb-2 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-rich-green font-semibold hover:text-forest-teal transition-colors">
            Sign up here
          </Link>
        </p>
        
        <div className="flex items-center justify-center space-x-3 text-xs text-black/50">
          <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/support" className="hover:text-black transition-colors">Support</Link>
        </div>
      </MotionDiv>
    </div>
  )
}
