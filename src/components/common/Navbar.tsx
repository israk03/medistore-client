"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Pill, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Products", href: "/products" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4",
        scrolled ? "py-3 bg-white/80 backdrop-blur-md border-b shadow-sm" : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">MediStore</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Trusted Pharmacy</span>
          </div>
        </Link>

        {/* DESKTOP NAV - centered */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-colors hover:text-indigo-600",
                pathname === link.href ? "text-indigo-600" : "text-slate-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => router.push('/profile')} variant="outline" className="rounded-full">
                My Account
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push('/login')} className="font-semibold">Sign In</Button>
                <Button onClick={() => router.push('/register')} className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6 shadow-md shadow-indigo-200 transition-all">
                  Join Now
                </Button>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-900">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 top-[64px] bg-white z-40 md:hidden flex flex-col p-6 gap-6"
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-2xl font-bold text-slate-900 border-b pb-4">
                {link.label}
              </Link>
            ))}
            <Button className="w-full py-6 text-lg rounded-2xl bg-indigo-600">Get Started</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}