"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  Home, 
  Search, 
  MessageCircle, 
  User, 
  MoreHorizontal,
  Plus,
  Settings,
  LogOut
} from "lucide-react"
import { useState } from "react"

interface SessionUser {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export default function MobileBottomNav() {
  const { data: session } = useSession()
  const pathname = usePathname() || ""
  const [showMore, setShowMore] = useState(false)
  const isAdmin = (session?.user as SessionUser)?.role === "ADMIN"

  // Don't show on admin pages
  if (isAdmin && pathname.startsWith('/admin')) {
    return null
  }

  const getNavItems = () => {
    if (!session?.user) {
      return [
        { 
          icon: Home, 
          label: "Home", 
          href: "/",
          active: pathname === "/"
        },
        { 
          icon: Search, 
          label: "Browse", 
          href: "/listing",
          active: pathname.startsWith('/listing') && pathname !== '/listing/create'
        },
        { 
          icon: MessageCircle, 
          label: "Support", 
          href: "/support",
          active: pathname === "/support"
        },
        { 
          icon: User, 
          label: "Login", 
          href: "/login",
          active: pathname.startsWith('/login') || pathname.startsWith('/register')
        },
      ]
    }

    return [
      { 
        icon: Home, 
        label: "Home", 
        href: "/",
        active: pathname === "/"
      },
      { 
        icon: Search, 
        label: "Browse", 
        href: "/listing",
        active: pathname.startsWith('/listing') && pathname !== '/listing/create'
      },
      { 
        icon: MessageCircle, 
        label: "Messages", 
        href: "/",
        active: pathname === "/"
      },
      { 
        icon: User, 
        label: "Profile", 
        href: "/dashboard",
        active: pathname.startsWith('/dashboard')
      },
      { 
        icon: MoreHorizontal, 
        label: "More", 
        onClick: () => setShowMore(!showMore),
        active: false
      },
    ]
  }

  const moreMenuItems = [
    { 
      icon: Plus, 
      label: "Create Listing", 
      href: "/listing/create",
    },
    { 
      icon: Settings, 
      label: "Settings", 
      href: "/dashboard/profile",
    },
    { 
      icon: MessageCircle, 
      label: "Support", 
      href: "/support",
    },
    { 
      icon: LogOut, 
      label: "Logout", 
      href: "#",
      onClick: () => {
        // This will be handled by the parent component
        window.dispatchEvent(new CustomEvent('mobile-logout'))
      }
    },
  ]

  const navItems = getNavItems()

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setShowMore(false)}
        >
          <div className="absolute bottom-20 right-4 glass-mint rounded-xl shadow-glass border border-mint-cream/50 p-2 min-w-48">
            {session?.user && moreMenuItems.map((item, index) => (
              <div key={index}>
                {item.href === "#" ? (
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-black hover:bg-mint-cream/50 rounded-xl transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className="flex items-center gap-3 px-4 py-3 text-black hover:bg-mint-cream/50 rounded-xl transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <nav className="glass-teal px-4 py-2 md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/20">
        <div className="flex justify-around items-center">
          {navItems.map((item, index) => (
            <div key={index} className="flex-1 max-w-20">
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl w-full
                    text-xs font-medium transition-all duration-200 ease-in-out
                    ${item.active 
                      ? 'text-white bg-white/20 shadow-soft' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl w-full
                    text-xs font-medium transition-all duration-200 ease-in-out
                    ${item.active 
                      ? 'text-white bg-white/20 shadow-soft' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-20 md:hidden" />
    </>
  )
}
