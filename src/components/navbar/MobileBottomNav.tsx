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
  LogOut,
  MapPin
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
        icon: Plus, 
        label: "Create", 
        href: "/listing/create",
        active: pathname === '/listing/create'
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
      icon: MapPin, 
      label: "Location Finder", 
      href: "/location-finder",
    },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      href: "/chat",
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setShowMore(false)}
        >
          <div className="absolute bottom-24 right-6 glass-mint rounded-2xl shadow-glass border border-mint-cream/50 p-1 min-w-52 animate-slide-up">
            {session?.user && moreMenuItems.map((item, index) => (
              <div key={index}>
                {item.href === "#" ? (
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left text-black hover:bg-mint-cream/70 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-soft group"
                  >
                    <div className="p-2 rounded-xl bg-black/5 group-hover:bg-black/10 transition-colors duration-200">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className="flex items-center gap-4 px-5 py-4 text-black hover:bg-mint-cream/70 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-soft group"
                  >
                    <div className="p-2 rounded-xl bg-black/5 group-hover:bg-black/10 transition-colors duration-200">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm flex items-center gap-2">
                      {item.label}
                      {item.label === "Location Finder" && (
                        <span className="text-xs bg-rich-green text-white px-2 py-1 rounded-full font-bold">
                          AI
                        </span>
                      )}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <nav className="glass-teal px-6 py-3 md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/30 shadow-2xl">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item, index) => (
            <div key={index} className="flex-1">
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-2xl w-full min-h-[60px]
                    text-xs font-semibold transition-all duration-300 ease-out group relative
                    ${item.active 
                      ? 'text-white bg-white/25 shadow-soft scale-105 border border-white/10' 
                      : 'text-white/75 hover:text-white hover:bg-white/15 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  <div className={`
                    transition-all duration-300 ease-out mb-1.5
                    ${item.active ? 'animate-pulse' : 'group-hover:-translate-y-0.5'}
                  `}>
                    <item.icon className="w-6 h-6" strokeWidth={item.active ? 2.5 : 2} />
                  </div>
                  <span className={`
                    transition-all duration-300 leading-tight
                    ${item.active ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}
                  `}>
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/60 rounded-full"></div>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-2xl w-full min-h-[60px]
                    text-xs font-semibold transition-all duration-300 ease-out group relative
                    ${item.active 
                      ? 'text-white bg-white/25 shadow-soft scale-105 border border-white/10' 
                      : 'text-white/75 hover:text-white hover:bg-white/15 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  <div className={`
                    transition-all duration-300 ease-out mb-1.5
                    ${item.active ? 'animate-pulse' : 'group-hover:-translate-y-0.5'}
                  `}>
                    <item.icon className="w-6 h-6" strokeWidth={item.active ? 2.5 : 2} />
                  </div>
                  <span className={`
                    transition-all duration-300 leading-tight
                    ${item.active ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}
                  `}>
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/60 rounded-full"></div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-24 md:hidden" />
    </>
  )
}
