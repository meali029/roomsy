"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

interface SessionUser {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname() || ""
  const isAdmin = (session?.user as SessionUser)?.role === "ADMIN"
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle mobile logout event
  useEffect(() => {
    const handleMobileLogout = () => {
      handleLogout()
    }
    window.addEventListener('mobile-logout', handleMobileLogout)
    return () => window.removeEventListener('mobile-logout', handleMobileLogout)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Don't show regular navbar for admin users on admin pages
  if (isAdmin && pathname.startsWith('/admin')) {
    return null
  }

  // Different nav links based on authentication status
  const getNavLinks = () => {
    if (!session?.user) {
      return [
        { label: "Home", href: "/" },
        { label: "Browse Listings", href: "/listing" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Success Stories", href: "/success-stories" },
        { label: "Support", href: "/support" },
        { label: "FAQ", href: "/faq" },
      ]
    }
    
    if (isAdmin) {
      return [
        { label: "Home", href: "/" },
        { label: "Admin Panel", href: "/admin" },
        { label: "Support", href: "/support" },
      ]
    }
    
    return [
      { label: "Home", href: "/" },
      { label: "Browse", href: "/listing" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Messages", href: "#" },
      { label: "Support", href: "/support" },
    ]
  }

  const navLinks = getNavLinks()

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-sage shadow-soft' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto container-spacing py-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href={isAdmin ? "/admin" : "/"} 
          className="text-2xl md:text-3xl font-bold text-darkest-green tracking-tight hover:scale-105 transition-transform duration-200"
        >
          {isAdmin ? "Roomsy Admin" : "Roomsy.pk"}
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-rich-green font-semibold" 
                  : "text-black hover:text-rich-green"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex gap-3 items-center">
          {session?.user ? (
            <>
              {/* Show Create Listing only for regular users */}
              {!isAdmin && (
                <Link
                  href="/listing/create"
                  className="btn-rich text-sm py-3 px-6"
                >
                  + Create Listing
                </Link>
              )}
              
              {/* User Profile Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                  isAdmin 
                    ? "bg-darkest-green/10 text-darkest-green hover:bg-darkest-green/20 border border-darkest-green/20" 
                    : "bg-soft-sage/20 text-rich-green hover:bg-soft-sage/30 border border-soft-sage/30"
                } backdrop-blur-sm`}>
                  {isAdmin ? "👑 " : "👤 "}{session.user.name?.split(" ")[0]}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 glass-mint opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 rounded-xl">
                  <div className="p-2">
                    <div className="px-4 py-3 border-b border-soft-sage/20">
                      <p className="text-sm font-semibold text-black">{session.user.name}</p>
                      <p className="text-xs text-black/70">{session.user.email}</p>
                    </div>
                    
                    {!isAdmin && (
                      <>
                        <Link
                          href="/dashboard/profile"
                          className="block px-4 py-3 text-sm text-black hover:bg-mint-cream/50 rounded-xl transition-all duration-200"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-3 text-sm text-black hover:bg-mint-cream/50 rounded-xl transition-all duration-200"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/listing/create"
                          className="block px-4 py-3 text-sm text-black hover:bg-mint-cream/50 rounded-xl transition-all duration-200"
                        >
                          Create Listing
                        </Link>
                      </>
                    )}
                    
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-3 text-sm text-black hover:bg-mint-cream/50 rounded-xl transition-all duration-200"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-darkest-green hover:bg-darkest-green/10 rounded-xl transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm text-black hover:text-rich-green font-medium transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-rich text-sm py-3 px-6"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-black hover:text-rich-green transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-sage border-t border-white/20">
          <div className="container-spacing py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-white bg-rich-green font-semibold" 
                    : "text-black hover:text-rich-green hover:bg-mint-cream/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Actions */}
            {session?.user ? (
              <div className="pt-4 border-t border-white/20 space-y-3">
                {!isAdmin && (
                  <>
                    <Link
                      href="/listing/create"
                      onClick={() => setIsMenuOpen(false)}
                      className="relative block px-6 py-4 text-sm font-bold text-black bg-mint-cream rounded-2xl
                               shadow-soft border border-mint-cream/70 
                               hover:bg-mint-cream hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
                               active:scale-[0.98] transition-all duration-300 ease-out group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-soft-sage/20 to-mint-cream/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <span className="text-lg">+</span>
                        <span>Create Listing</span>
                        <div className="ml-auto w-2 h-2 bg-rich-green rounded-full animate-pulse"></div>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-black hover:bg-mint-cream/50 rounded-xl transition-all duration-200"
                    >
                      My Profile
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-darkest-green hover:bg-darkest-green/10 rounded-xl transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/20 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-black hover:bg-mint-cream/50 rounded-xl transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-white bg-rich-green rounded-xl"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
