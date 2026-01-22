"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  User,
  Calendar,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  Wind,
  Paintbrush,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const services = [
  { name: "Plumbing", icon: Wrench, href: "/search?category=plumbing" },
  { name: "Electrical", icon: Zap, href: "/search?category=electrical" },
  { name: "Cleaning", icon: Sparkles, href: "/search?category=cleaning" },
  { name: "Handyman", icon: Hammer, href: "/search?category=handyman" },
  { name: "HVAC", icon: Wind, href: "/search?category=hvac" },
  { name: "Painting", icon: Paintbrush, href: "/search?category=painting" },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/search" },
  { name: "How it Works", href: "/#how-it-works" },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-linear-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <Search className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Local Service
              </span>
              <span className="text-xs font-bold text-[#f97316] tracking-wider">
                FINDER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-1",
                  pathname === link.href
                    ? "text-[#f97316] bg-[#fff7ed] shadow-sm"
                    : "text-gray-700 hover:text-[#f97316] hover:bg-gray-50",
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                onBlur={() => setTimeout(() => setServicesOpen(false), 150)}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-1",
                  servicesOpen
                    ? "text-[#f97316] bg-[#fff7ed] shadow-sm"
                    : "text-gray-700 hover:text-[#f97316] hover:bg-gray-50",
                )}
              >
                Services
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    servicesOpen && "rotate-180",
                  )}
                />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#fff7ed] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-inset rounded-lg mx-2"
                    >
                      <service.icon
                        className="w-5 h-5 text-[#f97316]"
                        strokeWidth={2}
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {service.name}
                      </span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2 mx-2">
                    <Link
                      href="/search"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white transition-colors rounded-lg font-bold text-sm"
                    >
                      View All Services
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-[#f97316] focus-within:border-[#f97316] focus-within:ring-2 focus-within:ring-[#f97316] focus-within:ring-opacity-20 transition-all">
              <Search className="w-5 h-5 text-[#f97316]" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search for services..."
                className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Notifications - Only show when logged in */}
            {isAuthenticated && (
              <button
                className="relative p-3 rounded-xl hover:bg-gray-50 transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-700" strokeWidth={2} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#f97316] rounded-full ring-2 ring-white" />
              </button>
            )}

            {/* User Menu or Login Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                  className="flex items-center gap-2 p-2 pr-3 rounded-xl hover:bg-gray-50 transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 bg-linear-to-br from-[#f97316] to-[#ea580c] rounded-lg flex items-center justify-center shadow-md\">
                    <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-500 transition-transform",
                      userMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/bookings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#fff7ed] transition-colors mx-2 rounded-lg mt-2"
                    >
                      <Calendar
                        className="w-5 h-5 text-[#f97316]"
                        strokeWidth={2}
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        My Bookings
                      </span>
                    </Link>
                    {user?.role === "provider" && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#fff7ed] transition-colors mx-2 rounded-lg"
                      >
                        <Settings
                          className="w-5 h-5 text-[#f97316]"
                          strokeWidth={2}
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          Provider Dashboard
                        </span>
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#fff7ed] transition-colors mx-2 rounded-lg"
                    >
                      <User
                        className="w-5 h-5 text-[#f97316]"
                        strokeWidth={2}
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        Profile
                      </span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#fff7ed] transition-colors mx-2 rounded-lg"
                    >
                      <Settings
                        className="w-5 h-5 text-[#f97316]"
                        strokeWidth={2}
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        Settings
                      </span>
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-50 transition-colors text-red-600 mx-2 rounded-lg font-semibold"
                      >
                        <LogOut className="w-5 h-5" strokeWidth={2} />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="default"
                    className="font-semibold"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="default" className="font-bold shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            <Link href="/search">
              <Button size="default" className="font-bold shadow-lg">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-50 transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-gray-100 bg-white animate-in slide-in-from-top duration-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-[#f97316] focus-within:ring-2 focus-within:ring-[#f97316] focus-within:ring-opacity-20 transition-all">
              <Search className="w-5 h-5 text-[#f97316]" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search services..."
                className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-gray-500"
              />
            </div>

            {/* Mobile Nav Links */}
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-inset",
                    pathname === link.href
                      ? "text-[#f97316] bg-[#fff7ed] shadow-sm"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Services */}
            <div className="border-t-2 border-gray-100 pt-4">
              <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Services
              </p>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-xl hover:bg-[#fff7ed] hover:border-[#f97316] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-inset border-2 border-transparent"
                  >
                    <service.icon
                      className="w-5 h-5 text-[#f97316]"
                      strokeWidth={2}
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="border-t-2 border-gray-100 pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <Calendar
                      className="w-5 h-5 text-[#f97316]"
                      strokeWidth={2}
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      My Bookings
                    </span>
                  </Link>
                  {user?.role === "provider" && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      <Settings
                        className="w-5 h-5 text-[#f97316]"
                        strokeWidth={2}
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        Provider Dashboard
                      </span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <User className="w-5 h-5 text-[#f97316]" strokeWidth={2} />
                    <span className="text-sm font-semibold text-gray-900">
                      Profile
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all w-full text-red-600"
                  >
                    <LogOut className="w-5 h-5" strokeWidth={2} />
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <User className="w-5 h-5 text-[#f97316]" strokeWidth={2} />
                    <span className="text-sm font-semibold text-gray-900">
                      Sign In
                    </span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <User className="w-5 h-5 text-[#f97316]" strokeWidth={2} />
                    <span className="text-sm font-semibold text-gray-900">
                      Create Account
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile CTA */}
            <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full font-bold shadow-lg" size="lg">
                Find Services
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
